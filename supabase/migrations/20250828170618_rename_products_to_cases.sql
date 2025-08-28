-- Rename products table to cases and add new fields
ALTER TABLE products RENAME TO cases;

-- Add new columns for cases
ALTER TABLE cases
ADD COLUMN company_name TEXT,
ADD COLUMN company_logo TEXT,
ADD COLUMN case_title TEXT,
ADD COLUMN description TEXT,
ADD COLUMN is_visible BOOLEAN DEFAULT true,
ADD COLUMN address TEXT,
ADD COLUMN object_type TEXT,
ADD COLUMN images TEXT[]; -- Array of image URLs

-- Update existing columns (rename some)
ALTER TABLE cases
RENAME COLUMN name TO case_name;

-- Update existing data to match new structure first
UPDATE cases SET
  company_name = COALESCE(company_name, 'Default Company'),
  case_title = COALESCE(case_title, case_name),
  description = COALESCE(description, 'Default case description'),
  address = COALESCE(address, 'Default Address'),
  object_type = COALESCE(object_type, 'Apartment'),
  images = COALESCE(images, ARRAY['/placeholder-image.jpg'])
WHERE company_name IS NULL OR case_title IS NULL OR description IS NULL OR address IS NULL OR object_type IS NULL;

-- Now make fields NOT NULL
ALTER TABLE cases
ALTER COLUMN company_name SET NOT NULL,
ALTER COLUMN case_title SET NOT NULL,
ALTER COLUMN description SET NOT NULL,
ALTER COLUMN address SET NOT NULL,
ALTER COLUMN object_type SET NOT NULL;

-- Update the status enum to be more relevant for cases
ALTER TABLE cases
DROP CONSTRAINT IF EXISTS cases_status_check;

-- Update existing data to match new structure
UPDATE cases SET
  company_name = 'Sample Company',
  company_logo = '/placeholder-logo.png',
  case_title = case_name,
  description = 'Sample case description',
  address = 'Sample Address',
  object_type = 'Apartments',
  images = ARRAY['/placeholder-image.jpg']
WHERE company_name IS NULL;

-- Add constraints
ALTER TABLE cases
ADD CONSTRAINT cases_company_name_not_empty CHECK (company_name != ''),
ADD CONSTRAINT cases_case_title_not_empty CHECK (case_title != ''),
ADD CONSTRAINT cases_description_not_empty CHECK (description != ''),
ADD CONSTRAINT cases_address_not_empty CHECK (address != ''),
ADD CONSTRAINT cases_object_type_not_empty CHECK (object_type != '');

-- Update indexes
DROP INDEX IF EXISTS idx_products_status;
DROP INDEX IF EXISTS idx_products_available_at;

CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_is_visible ON cases(is_visible);
CREATE INDEX idx_cases_object_type ON cases(object_type);
