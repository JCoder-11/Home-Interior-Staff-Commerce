import { Router } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { supabase, createAuthClient } from "../supabase";
import { validatePassword } from "../utils/passwordRules";
import { sendResetCode } from "../services/email";

const router = Router();

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS_MESSAGES: Record<string, string> = {
  PENDING: "Your account is awaiting admin approval.",
  REJECTED: "Your registration was not approved. Please contact an administrator.",
  DEACTIVATED: "Your account has been deactivated. Please contact IT support.",
};

const normalizeEmail = (value: unknown) => String(value ?? "").trim().toLowerCase();

const generateCode = () => crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");

const hashCode = (code: string) =>
  crypto.createHmac("sha256", process.env.JWT_SECRET!).update(code).digest("hex");

const codesMatch = (a: string, b: string) =>
  crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

const checkCode = async (email: string, code: string) => {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (!profile) return null;

  const { data: reset } = await supabase
    .from("password_resets")
    .select("*")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (!reset) return null;
  if (new Date(reset.expires_at).getTime() < Date.now()) return null;
  if (reset.attempts >= MAX_ATTEMPTS) return null;

  if (!codesMatch(reset.code_hash, hashCode(code))) {
    await supabase
      .from("password_resets")
      .update({ attempts: reset.attempts + 1 })
      .eq("id", reset.id);
    return null;
  }

  return { userId: profile.id as string, resetId: reset.id as string };
};

router.post("/register", async (req, res) => {
  const fullName = String(req.body.fullName ?? "").trim();
  const phone = String(req.body.phone ?? "").trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password ?? "");

  if (fullName.length < 2) {
    return res.status(400).json({ error: "Please enter your full name." });
  }

  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return res.status(400).json({ error: "Please enter a valid phone number." });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
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

  const { error: profileError } = await supabase.from("profiles").insert({
    id: authUser.user.id,
    name: fullName,
    phone,
    email,
    role: "sales",
    status: "PENDING",
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(authUser.user.id);
    return res.status(400).json({ error: profileError.message });
  }

  return res.status(201).json({
    message: "Account created. Awaiting admin approval.",
  });
});

router.post("/login", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password ?? "");

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const authClient = createAuthClient();
  const { data, error } = await authClient.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    return res.status(404).json({ error: "Profile not found" });
  }

  if (profile.status !== "ACTIVE") {
    return res.status(403).json({
      error: STATUS_MESSAGES[profile.status] ?? "Access denied.",
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

router.post("/forgot-password", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const genericResponse = { message: "If that email is registered, a code has been sent." };

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, email")
    .eq("email", email)
    .maybeSingle();

  if (!profile) {
    return res.json(genericResponse);
  }

  const { data: recent } = await supabase
    .from("password_resets")
    .select("created_at")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (recent && Date.now() - new Date(recent.created_at).getTime() < RESEND_COOLDOWN_MS) {
    return res.json(genericResponse);
  }

  const code = generateCode();

  await supabase.from("password_resets").delete().eq("user_id", profile.id);

  const { error: insertError } = await supabase.from("password_resets").insert({
    user_id: profile.id,
    code_hash: hashCode(code),
    expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(),
  });

  if (insertError) {
    console.error("Could not store reset code:", insertError.message);
    return res.json(genericResponse);
  }

  try {
    await sendResetCode(profile.email, profile.name, code);
  } catch (err) {
    console.error("Could not send reset email:", err);
  }

  return res.json(genericResponse);
});

router.post("/verify-code", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const code = String(req.body.code ?? "");

  if (!email || !/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }

  const match = await checkCode(email, code);
  if (!match) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }

  return res.json({ valid: true });
});

router.post("/reset-password", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const code = String(req.body.code ?? "");
  const password = String(req.body.password ?? "");

  if (!email || !/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }

  const match = await checkCode(email, code);
  if (!match) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }

  const { error } = await supabase.auth.admin.updateUserById(match.userId, { password });
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  await supabase.from("password_resets").delete().eq("id", match.resetId);

  return res.json({ message: "Password updated. You can now sign in." });
});

export default router;