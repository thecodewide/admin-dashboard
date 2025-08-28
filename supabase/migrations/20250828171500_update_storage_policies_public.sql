-- Update storage policies to allow public access without authentication
-- Drop existing policies
DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Allow image uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow image updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow image deletion" ON storage.objects;
DROP POLICY IF EXISTS "Service role can manage all images" ON storage.objects;

-- Create new policies that allow all operations without authentication
CREATE POLICY "Public images access" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Public image uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Public image updates" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images');

CREATE POLICY "Public image deletion" ON storage.objects
  FOR DELETE USING (bucket_id = 'images');

-- Ensure the bucket is public
UPDATE storage.buckets
SET public = true
WHERE id = 'images';
