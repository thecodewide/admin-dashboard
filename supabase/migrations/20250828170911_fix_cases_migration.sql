-- Fix cases table structure by properly handling null values before setting NOT NULL constraints

-- Update existing data to match new structure first
UPDATE cases SET
  company_name = COALESCE(company_name, 'Default Company'),
  company_logo = COALESCE(company_logo, '/placeholder-logo.png'),
  case_title = COALESCE(case_title, case_name),
  description = COALESCE(description, 'Default case description'),
  address = COALESCE(address, 'Default Address'),
  object_type = COALESCE(object_type, 'Apartment'),
  images = COALESCE(images, ARRAY['/placeholder-image.jpg'])
WHERE company_name IS NULL
   OR company_logo IS NULL
   OR case_title IS NULL
   OR description IS NULL
   OR address IS NULL
   OR object_type IS NULL
   OR images IS NULL;

-- Now make fields NOT NULL
ALTER TABLE cases
ALTER COLUMN company_name SET NOT NULL,
ALTER COLUMN company_logo SET NOT NULL,
ALTER COLUMN case_title SET NOT NULL,
ALTER COLUMN description SET NOT NULL,
ALTER COLUMN address SET NOT NULL,
ALTER COLUMN object_type SET NOT NULL,
ALTER COLUMN images SET NOT NULL;
