export const SQL_SCRIPT = `
-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  bedrooms INT,
  bathrooms INT,
  area DECIMAL(10, 2),
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  zip_code VARCHAR(20),
  property_type VARCHAR(50) NOT NULL,
  listing_type VARCHAR(50) NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_images table
CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_properties table
CREATE TABLE IF NOT EXISTS saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Insert sample properties
INSERT INTO properties (title, description, price, bedrooms, bathrooms, area, address, city, state, zip_code, property_type, listing_type, is_featured)
VALUES
('Modern Apartment in Downtown', 'This beautiful modern apartment features high ceilings, large windows, and an open floor plan. Perfect for young professionals or small families.', 250000, 2, 2, 1200, '123 Main St', 'New York', 'NY', '10001', 'apartment', 'sale', true),
('Luxury Villa with Pool', 'Stunning luxury villa with private pool, garden, and panoramic views. This property offers the perfect blend of comfort and elegance.', 1200000, 4, 3, 3500, '456 Ocean Ave', 'Miami', 'FL', '33139', 'villa', 'sale', true),
('Cozy Studio for Rent', 'Fully furnished studio apartment in a quiet neighborhood. All utilities included.', 1500, 0, 1, 500, '789 Park Rd', 'Boston', 'MA', '02115', 'apartment', 'rent', false);

-- Insert sample property images with URLs pointing to actual images in our public directory
INSERT INTO property_images (property_id, image_url, is_primary)
SELECT 
  p.id,
  CASE p.property_type
    WHEN 'apartment' THEN 
      CASE WHEN p.title LIKE '%Studio%' THEN '/studio-1.jpg'
      ELSE '/apartment-1.jpg'
      END
    WHEN 'villa' THEN '/villa-1.jpg'
  END,
  true
FROM properties p;

-- Add additional (non-primary) images for each property
INSERT INTO property_images (property_id, image_url, is_primary)
SELECT 
  p.id,
  CASE p.property_type
    WHEN 'apartment' THEN 
      CASE WHEN p.title LIKE '%Studio%' THEN '/studio-2.jpg'
      ELSE '/apartment-2.jpg'
      END
    WHEN 'villa' THEN '/villa-2.jpg'
  END,
  false
FROM properties p;
`;
