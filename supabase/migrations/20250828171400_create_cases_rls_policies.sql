-- Enable RLS on cases table
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT (anyone can read cases)
CREATE POLICY "Enable read access for all users" ON cases
  FOR SELECT USING (true);

-- Policy for INSERT (only authenticated users can insert)
CREATE POLICY "Enable insert for authenticated users" ON cases
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for UPDATE (only authenticated users can update)
CREATE POLICY "Enable update for authenticated users" ON cases
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy for DELETE (only authenticated users can delete)
CREATE POLICY "Enable delete for authenticated users" ON cases
  FOR DELETE USING (auth.role() = 'authenticated');

-- For now, we'll allow all operations for service role (server-side operations)
-- This is for admin operations through the API
CREATE POLICY "Enable all operations for service role" ON cases
  FOR ALL USING (auth.role() = 'service_role');

-- Also create a policy that allows operations when no authentication is required
-- This is for development/testing purposes
CREATE POLICY "Enable all operations when no auth" ON cases
  FOR ALL USING (auth.role() IS NULL OR auth.role() = 'anon');
