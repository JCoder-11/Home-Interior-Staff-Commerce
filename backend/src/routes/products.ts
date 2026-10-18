import { Router, Response } from "express";
import { supabase } from "../supabase";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_PRICE = 9999999999.99;
const FIELDS = "id, name, category, description, price, image_url, created_at, updated_at";

const text = (value: unknown) => String(value ?? "").trim();

const parsePrice = (value: unknown): number | null => {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (value === "") return null;
  const price = Number(value);
  if (!Number.isFinite(price) || price <= 0 || price > MAX_PRICE) return null;
  return Math.round(price * 100) / 100;
};

const isValidImageUrl = (value: string) => value === "" || /^https?:\/\/\S+$/i.test(value);

const updateProduct = async (id: string, updates: Record<string, unknown>, res: Response) => {
  if (!UUID_PATTERN.test(id)) {
    return res.status(404).json({ error: "Product not found" });
  }

  const { data, error } = await supabase
    .from("products")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(FIELDS)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!data) {
    return res.status(404).json({ error: "Product not found" });
  }

  return res.json(data);
};

router.use(requireAuth);

const staff = requireRole("sales", "admin");
const adminOnly = requireRole("admin");

router.get("/", staff, async (req, res) => {
  const search = String(req.query.search ?? "").replace(/[%,()*\\_]/g, " ").trim();
  const category = String(req.query.category ?? "").trim();
  const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "20"), 10) || 20, 1), 100);
  const from = (page - 1) * limit;

  let query = supabase.from("products").select(FIELDS, { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,category.ilike.%${search}%`);
  }
  if (category) {
    query = query.eq("category", category);
  }

  const { data, error, count } = await query
    .order("name", { ascending: true })
    .range(from, from + limit - 1);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ items: data, total: count ?? 0, page, limit });
});

router.get("/categories", staff, async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("category")
    .not("category", "is", null);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const categories = Array.from(new Set((data ?? []).map((row) => row.category as string))).sort();

  return res.json(categories);
});

router.get("/:id", staff, async (req, res) => {
  const id = String(req.params.id);

  if (!UUID_PATTERN.test(id)) {
    return res.status(404).json({ error: "Product not found" });
  }

  const { data, error } = await supabase
    .from("products")
    .select(FIELDS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!data) {
    return res.status(404).json({ error: "Product not found" });
  }

  return res.json(data);
});

router.post("/", adminOnly, async (req, res) => {
  const name = text(req.body.name);
  const price = parsePrice(req.body.price);
  const imageUrl = text(req.body.image_url);

  if (name.length < 2) {
    return res.status(400).json({ error: "Please enter a product name." });
  }
  if (price === null) {
    return res.status(400).json({ error: "Price must be a number greater than zero." });
  }
  if (!isValidImageUrl(imageUrl)) {
    return res.status(400).json({ error: "Image must be a valid http or https link." });
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      category: text(req.body.category) || null,
      description: text(req.body.description) || null,
      image_url: imageUrl || null,
      price,
      created_by: req.user!.userId,
    })
    .select(FIELDS)
    .single();

  if (error || !data) {
    return res.status(500).json({ error: error?.message || "Could not create product" });
  }

  return res.status(201).json(data);
});

router.put("/:id", adminOnly, async (req, res) => {
  const updates: Record<string, unknown> = {};

  if (req.body.name !== undefined) {
    const name = text(req.body.name);
    if (name.length < 2) {
      return res.status(400).json({ error: "Please enter a product name." });
    }
    updates.name = name;
  }

  if (req.body.category !== undefined) {
    updates.category = text(req.body.category) || null;
  }

  if (req.body.description !== undefined) {
    updates.description = text(req.body.description) || null;
  }

  if (req.body.image_url !== undefined) {
    const imageUrl = text(req.body.image_url);
    if (!isValidImageUrl(imageUrl)) {
      return res.status(400).json({ error: "Image must be a valid http or https link." });
    }
    updates.image_url = imageUrl || null;
  }

  if (req.body.price !== undefined) {
    const price = parsePrice(req.body.price);
    if (price === null) {
      return res.status(400).json({ error: "Price must be a number greater than zero." });
    }
    updates.price = price;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Nothing to update." });
  }

  return updateProduct(String(req.params.id), updates, res);
});

router.patch("/:id/price", adminOnly, async (req, res) => {
  const price = parsePrice(req.body.price);

  if (price === null) {
    return res.status(400).json({ error: "Price must be a number greater than zero." });
  }

  return updateProduct(String(req.params.id), { price }, res);
});

export default router;