import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../supabase";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!["sales", "admin", "it_admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authUser.user) {
    return res.status(400).json({ error: authError?.message || "Could not create user" });
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: authUser.user.id,
    name,
    email,
    role,
    status: "PENDING",
  });

  if (profileError) {
    return res.status(400).json({ error: profileError.message });
  }

  return res.status(201).json({
    message: "Account created. Awaiting admin approval.",
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  console.log("Logged in user ID:", data.user.id);

  const { data: allProfiles, error: allError } = await supabase
    .from("profiles")
    .select("*");

  console.log("ALL profiles via API:", allProfiles);
  console.log("ALL profiles error:", allError);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  console.log("Profile lookup result:", profile, profileError);

  if (profileError || !profile) {
    return res.status(404).json({ error: "Profile not found" });
  }

  if (profile.status !== "ACTIVE") {
    return res.status(403).json({
      error: `Account is ${profile.status.toLowerCase()}. Access denied.`,
    });
  }

  const token = jwt.sign(
    { userId: profile.id, role: profile.role, status: profile.status },
    process.env.JWT_SECRET!,
    { expiresIn: "8h" }
  );

  return res.json({
    token,
    user: { id: profile.id, name: profile.name, role: profile.role },
  });
});

export default router;