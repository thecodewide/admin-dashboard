-- Create the status enum
CREATE TYPE status AS ENUM ('active', 'inactive', 'archived');

-- Create the products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  name TEXT NOT NULL,
  status status NOT NULL DEFAULT 'active',
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  available_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create an index on status for better query performance
CREATE INDEX idx_products_status ON products(status);

-- Create an index on available_at for sorting
CREATE INDEX idx_products_available_at ON products(available_at DESC);
