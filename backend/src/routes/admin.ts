import { Router, Request, Response } from "express";
import { supabase } from "../supabase";
import { requireAuth, requireRole } from "../middleware/auth";
import { sendAccountDecision } from "../services/email";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/accounts/pending", async (req, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, phone, email, role, status, created_at")
    .eq("status", "PENDING")
    .order("created_at", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

const decide = (newStatus: "ACTIVE" | "REJECTED") => async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const { data, error } = await supabase
    .from("profiles")
    .update({ status: newStatus })
    .eq("id", id)
    .eq("status", "PENDING")
    .select("id, name, email, status")
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Pending account not found" });
  }

  try {
    await sendAccountDecision(data.email, data.name, newStatus === "ACTIVE");
  } catch (err) {
    console.error("Could not send decision email:", err);
  }

  return res.json({ message: `Account ${newStatus.toLowerCase()}`, user: data });
};

router.post("/accounts/:id/approve", decide("ACTIVE"));
router.post("/accounts/:id/reject", decide("REJECTED"));

export default router;