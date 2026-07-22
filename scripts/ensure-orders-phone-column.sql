-- One-time migration previously inlined into checkout initialization.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(80);
