-- Add phone column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
