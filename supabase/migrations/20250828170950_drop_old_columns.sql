-- Drop old columns that are no longer needed
ALTER TABLE cases DROP COLUMN IF EXISTS image_url;
ALTER TABLE cases DROP COLUMN IF EXISTS price;
ALTER TABLE cases DROP COLUMN IF EXISTS stock;
