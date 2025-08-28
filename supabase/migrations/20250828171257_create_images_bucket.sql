-- Create storage bucket for case images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- Set up RLS policies for the images bucket
CREATE POLICY "Images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Allow image uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow image updates" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images');

CREATE POLICY "Allow image deletion" ON storage.objects
  FOR DELETE USING (bucket_id = 'images');

-- Allow service role to perform all operations (for API)
CREATE POLICY "Service role can manage all images" ON storage.objects
  FOR ALL USING (bucket_id = 'images' AND auth.role() = 'service_role');
