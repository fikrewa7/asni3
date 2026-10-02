-- ============================================================
-- Asni Guest House — Cloudflare D1 schema
-- ============================================================

PRAGMA foreign_keys = ON;

-- ------------------------------------------------------------
-- rooms
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rooms (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  room_number         TEXT    NOT NULL UNIQUE,
  room_type           TEXT    NOT NULL DEFAULT 'Standard'
                      CHECK (room_type IN ('Standard','Deluxe','Executive Suite','Family Suite')),
  capacity            INTEGER NOT NULL DEFAULT 2 CHECK (capacity > 0),
  price_per_night_etb REAL    NOT NULL DEFAULT 0 CHECK (price_per_night_etb >= 0),
  status              TEXT    NOT NULL DEFAULT 'Available'
                      CHECK (status IN ('Available','Occupied','Cleaning','Maintenance')),
  description         TEXT    DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_type   ON rooms(room_type);

-- ------------------------------------------------------------
-- users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name  TEXT    NOT NULL,
  email      TEXT    NOT NULL UNIQUE,
  phone      TEXT    DEFAULT '',
  role       TEXT    NOT NULL DEFAULT 'guest'
             CHECK (role IN ('admin','receptionist','guest')),
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ------------------------------------------------------------
-- bookings
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id          INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  guest_name       TEXT    NOT NULL,
  guest_phone      TEXT    NOT NULL DEFAULT '',
  check_in_date    TEXT    NOT NULL,               -- ISO 8601: YYYY-MM-DD
  check_out_date   TEXT    NOT NULL,
  total_amount_etb REAL    NOT NULL DEFAULT 0 CHECK (total_amount_etb >= 0),
  status           TEXT    NOT NULL DEFAULT 'Pending'
                   CHECK (status IN ('Pending','Confirmed','CheckedIn','CheckedOut','Cancelled')),
  created_at       TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookings_room   ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates  ON bookings(check_in_date, check_out_date);

-- ------------------------------------------------------------
-- menu_items
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menu_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  category    TEXT    NOT NULL DEFAULT 'Main Course'
              CHECK (category IN ('Traditional Ethiopian','Breakfast','Main Course','Beverages','Dessert')),
  price_etb   REAL    NOT NULL DEFAULT 0 CHECK (price_etb >= 0),
  available   INTEGER NOT NULL DEFAULT 1 CHECK (available IN (0,1)),
  description TEXT    DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category  ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);

-- ------------------------------------------------------------
-- orders
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  order_type        TEXT    NOT NULL DEFAULT 'Room Service'
                    CHECK (order_type IN ('Room Service','Restaurant Table')),
  target_identifier TEXT    NOT NULL,              -- room number or table number
  items_json        TEXT    NOT NULL DEFAULT '[]', -- [{id,name,price,qty}, …]
  total_amount_etb  REAL    NOT NULL DEFAULT 0 CHECK (total_amount_etb >= 0),
  status            TEXT    NOT NULL DEFAULT 'Pending'
                    CHECK (status IN ('Pending','Preparing','Served','Cancelled')),
  created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_target ON orders(target_identifier);

-- ------------------------------------------------------------
-- restaurant_tables
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  table_number     TEXT    NOT NULL UNIQUE,
  seating_capacity INTEGER NOT NULL DEFAULT 2 CHECK (seating_capacity > 0),
  zone             TEXT    NOT NULL DEFAULT 'Indoor Main'
                   CHECK (zone IN ('Indoor Main','Garden Patio','Rooftop Lounge')),
  status           TEXT    NOT NULL DEFAULT 'Available'
                   CHECK (status IN ('Available','Reserved','Occupied'))
);

CREATE INDEX IF NOT EXISTS idx_tables_zone   ON restaurant_tables(zone);
CREATE INDEX IF NOT EXISTS idx_tables_status ON restaurant_tables(status);

-- ------------------------------------------------------------
-- ad_banners
-- Note: `title` is the i18n lookup key. It MUST exactly match
-- a key in BANNER_I18N in modules/main/i18n.js (case-sensitive,
-- no trailing space). Otherwise EN text shows in AM mode.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ad_banners (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  description TEXT    NOT NULL DEFAULT '',
  tag         TEXT    NOT NULL DEFAULT '',
  badge_color TEXT    NOT NULL DEFAULT 'bg-amber-600'
              CHECK (badge_color IN ('bg-amber-600','bg-blue-600','bg-emerald-600','bg-purple-600','bg-rose-600')),
  active      INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1))
);

CREATE INDEX IF NOT EXISTS idx_banners_active ON ad_banners(active);