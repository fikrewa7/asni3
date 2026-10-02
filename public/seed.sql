-- rooms
INSERT INTO rooms (room_number, room_type, capacity, price_per_night_etb, status, description) VALUES
  ('101','Standard',        2, 1800,'Available','Cozy room with garden view'),
  ('102','Standard',        2, 1800,'Available','Quiet corner room'),
  ('201','Deluxe',          2, 2600,'Available','Spacious deluxe with balcony'),
  ('202','Deluxe',          2, 2600,'Occupied', 'Deluxe with city view'),
  ('301','Executive Suite', 3, 4200,'Available','Executive suite with lounge'),
  ('302','Family Suite',    4, 5000,'Available','Two-room family suite');

-- users
INSERT INTO users (full_name, email, phone, role) VALUES
  ('System Admin',  'admin@asni.et',      '+251471112233', 'admin'),
  ('Front Desk',    'reception@asni.et',  '+251471112234', 'receptionist'),
  ('Hanna Bekele',  'hanna@example.com',  '+251911223344', 'guest');

-- restaurant tables
INSERT INTO restaurant_tables (table_number, seating_capacity, zone, status) VALUES
  ('T1', 2, 'Indoor Main',   'Available'),
  ('T2', 4, 'Indoor Main',   'Available'),
  ('T3', 4, 'Garden Patio',  'Available'),
  ('T4', 6, 'Garden Patio',  'Reserved'),
  ('T5', 2, 'Rooftop Lounge','Available'),
  ('T6', 4, 'Rooftop Lounge','Occupied');

-- menu_items
INSERT INTO menu_items (name, category, price_etb, available, description) VALUES
  ('Doro Wat',        'Traditional Ethiopian', 320, 1, 'Spicy chicken stew with injera'),
  ('Kitfo',           'Traditional Ethiopian', 380, 1, 'Minced beef with mitmita and kocho'),
  ('Shiro',           'Traditional Ethiopian', 180, 1, 'Chickpea stew with injera'),
  ('Full English',    'Breakfast',             220, 1, 'Eggs, sausage, toast, beans'),
  ('Ful Medames',     'Breakfast',             150, 1, 'Slow-cooked fava beans with bread'),
  ('Grilled Tilapia', 'Main Course',           420, 1, 'Whole tilapia with rice and salad'),
  ('Beef Burger',     'Main Course',           280, 1, 'Served with fries and salad'),
  ('Macchiato',       'Beverages',              60, 1, 'Double shot espresso with milk'),
  ('Jimma Coffee',    'Beverages',              40, 1, 'Traditional Ethiopian coffee'),
  ('Baklava',         'Dessert',               140, 1, 'Layered pastry with honey');

-- ad_banners — title must match BANNER_I18N keys EXACTLY
INSERT INTO ad_banners (title, description, tag, badge_color, active) VALUES
  ('Jimma Coffee Tour',
   'Explore authentic coffee farms around Jimma. Book guided tours at reception.',
   'Special Experience', 'bg-amber-600', 1),
  ('Aba Jifar Palace Excursion',
   'Visit the historic King Aba Jifar II Palace located near Ferenj Arada.',
   'Cultural Heritage',  'bg-purple-600', 1),
  ('Free Airport Shuttle',
   'Complimentary shuttle service to and from Jimma Airport (JIM) for Executive guests.',
   'Guest Perk',         'bg-emerald-600', 1);