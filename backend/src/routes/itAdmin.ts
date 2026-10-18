import { Router } from "express";
import { supabase } from "../supabase";
import { requireAuth, requireRole } from "../middleware/auth";
import { validatePassword } from "../utils/passwordRules";

const router = Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.use(requireAuth, requireRole("it_admin"));

router.get("/accounts", async (req, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, phone, email, role, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

router.post("/accounts", async (req, res) => {
  const name = String(req.body.name ?? "").trim();
  const email = String(req.body.email ?? "").trim().toLowerCase();
  const phone = String(req.body.phone ?? "").trim();
  const password = String(req.body.password ?? "");
  const role = String(req.body.role ?? "admin");

  if (name.length < 2) {
    return res.status(400).json({ error: "Please enter a full name." });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  if (!["admin", "it_admin"].includes(role)) {
    return res.status(400).json({ error: "Role must be admin or it_admin." });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authUser.user) {
    return res.status(400).json({ error: authError?.message || "Could not create user" });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: authUser.user.id,
      name,
      email,
      phone: phone || null,
      role,
      status: "ACTIVE",
    })
    .select("id, name, email, role, status")
    .single();

  if (profileError || !profile) {
    await supabase.auth.admin.deleteUser(authUser.user.id);
    return res.status(400).json({ error: profileError?.message || "Could not create profile" });
  }

  return res.status(201).json({ message: "Account created", user: profile });
});

router.post("/accounts/:id/deactivate", async (req, res) => {
  const id = String(req.params.id);

  if (id === req.user!.userId) {
    return res.status(400).json({ error: "You cannot deactivate your own account" });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ status: "DEACTIVATED" })
    .eq("id", id)
    .eq("status", "ACTIVE")
    .select("id, name, email, status")
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Active account not found" });
  }

  return res.json({ message: "Account deactivated", user: data });
});

router.post("/accounts/:id/activate", async (req, res) => {
  const id = String(req.params.id);

  const { data, error } = await supabase
    .from("profiles")
    .update({ status: "ACTIVE" })
    .eq("id", id)
    .eq("status", "DEACTIVATED")
    .select("id, name, email, status")
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Deactivated account not found" });
  }

  return res.json({ message: "Account activated", user: data });
});

export default router;