-- Update existing cases with new field values
UPDATE cases SET
  company_name = CASE
    WHEN id = 9 THEN 'Elite Construction'
    WHEN id = 10 THEN 'Urban Development Corp'
    WHEN id = 11 THEN 'Green Builders'
    WHEN id = 12 THEN 'Metro Properties'
    ELSE 'Default Company'
  END,
  company_logo = CASE
    WHEN id = 9 THEN 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop'
    WHEN id = 10 THEN 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop'
    WHEN id = 11 THEN 'https://images.unsplash.com/photo-1444927714506-8492d94d9dbc?w=200&h=200&fit=crop'
    WHEN id = 12 THEN 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop'
    ELSE '/placeholder-logo.png'
  END,
  case_title = CASE
    WHEN id = 9 THEN 'Luxury Apartment Complex'
    WHEN id = 10 THEN 'Skyline Business Center'
    WHEN id = 11 THEN 'Sustainable Resort Complex'
    WHEN id = 12 THEN 'City Center Development'
    ELSE case_name
  END,
  description = CASE
    WHEN id = 9 THEN 'Modern luxury apartment complex featuring state-of-the-art amenities, sustainable design, and premium finishes.'
    WHEN id = 10 THEN 'Contemporary office tower with innovative workspace design, advanced building systems, and LEED certification.'
    WHEN id = 11 THEN 'Eco-friendly resort development combining luxury hospitality with environmental responsibility.'
    WHEN id = 12 THEN 'Mixed-use development combining residential, retail, and office spaces in the heart of the city.'
    ELSE 'Default case description'
  END,
  address = CASE
    WHEN id = 9 THEN '123 Luxury Ave, Downtown City'
    WHEN id = 10 THEN '456 Business Blvd, Financial District'
    WHEN id = 11 THEN '789 Paradise Road, Coastal Area'
    WHEN id = 12 THEN '321 Main Street, City Center'
    ELSE 'Default Address'
  END,
  object_type = CASE
    WHEN id = 9 THEN 'Apartments'
    WHEN id = 10 THEN 'Office Building'
    WHEN id = 11 THEN 'Resort'
    WHEN id = 12 THEN 'Mixed-Use'
    ELSE 'Apartment'
  END,
  images = CASE
    WHEN id = 9 THEN ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop']
    WHEN id = 10 THEN ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop']
    WHEN id = 11 THEN ARRAY['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop']
    WHEN id = 12 THEN ARRAY['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop']
    ELSE ARRAY['/placeholder-image.jpg']
  END
WHERE id IN (9, 10, 11, 12);
