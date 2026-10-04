/* ============================================================
   Help Center — i18n module
   Dictionary, t() lookup, and applyLang() DOM walker.
   Exposes: Help.I18n
   ============================================================ */
window.Help = window.Help || {};

(function (H) {
  'use strict';

  const KEYS = H.Keys;
  let currentLang = localStorage.getItem(KEYS.lang) || 'en';

  const T = {
    en: {
      // Header
      menu: 'Menu', theme_toggle: 'Toggle theme', lang_toggle: 'Change language',
      help_title: 'Help & Support',
      help_sub: 'Everything you need to use Asni Guest House',
      back_to_app: 'Back to App',
      search_placeholder: 'Search help…',
      version: 'Version',
      footer_version: 'Help Center v3.0',
      footer_back: 'Return to app',

      // Hero
      hero_kicker: 'User Guide',
      hero_title: 'Welcome to Asni Guest House',
      hero_sub: 'A complete guide to using the Asni Guest House management system. Learn how to manage rooms, bookings, restaurant orders, staff accounts, and financial reports — for admins, receptionists, and guests.',
      btn_get_started: 'Get Started',
      btn_view_faq: 'View FAQ',

      // Sidebar labels + TOC
      toc_getting_started: 'Getting Started',
      toc_features: 'Features',
      toc_settings: 'Settings',
      toc_trouble: 'Troubleshooting',
      toc_intro: 'Introduction',
      toc_start: 'Getting Started',
      toc_roles: 'Roles & Permissions',
      toc_dashboard: 'Dashboard',
      toc_rooms: 'Managing Rooms',
      toc_bookings: 'Bookings',
      toc_restaurant: 'Restaurant & Orders',
      toc_tables: 'Restaurant Tables',
      toc_users: 'Users & Staff',
      toc_reports: 'Financial Reports',
      toc_banners: 'Ad Banners',
      toc_sql: 'SQL Console',
      toc_theme: 'Themes',
      toc_lang: 'Languages',
      toc_shortcuts: 'Keyboard Shortcuts',
      toc_faq: 'FAQ',
      toc_troubleshoot: 'Common Issues',
      toc_contact: 'Contact Support',

      // Quick stats
      qs_modules: 'Modules', qs_roles: 'User Roles',
      qs_shortcuts: 'Shortcuts', qs_support: 'Support',

      // Getting Started
      gs_title: 'Getting Started', gs_sub: 'Your first 5 minutes with the app',
      gs_step1_title: 'Open the app', gs_step1_body: 'Visit asni-guest-house.vercel.app in any modern browser (Chrome, Edge, Firefox, or Safari). The app loads instantly — no installation required.',
      gs_step2_title: 'Choose your role', gs_step2_body: 'Use the role dropdown in the top-right of the header to switch between Admin, Receptionist, and Guest views. The colour of the top bar and the visible menu items change instantly.',
      gs_step3_title: 'Explore the sidebar', gs_step3_body: 'The left sidebar is your main navigation. Click any item to jump to that module. On mobile, tap the menu icon to reveal it.',
      gs_step4_title: 'Try adding a record', gs_step4_body: 'Start with Rooms → click Add Room. Fill in the form and press Save Room. A green toast confirms the save and the new room appears in the table instantly.',
      gs_tip: 'Tip:', gs_tip_body: 'The app works offline. If the network is down, you\'ll see "D1 Offline — Local Cache" in the header and everything still works with cached data.',

      // Roles
      roles_title: 'Roles & Permissions', roles_sub: 'What each user type can see and do',
      role_admin_full: 'Admin', role_recept_full: 'Receptionist', role_guest_full: 'Guest',
      rp_admin_dash: 'Full dashboard access', rp_admin_rooms: 'Manage rooms, pricing, availability',
      rp_admin_users: 'Create & edit staff accounts', rp_admin_bookings: 'Full booking control',
      rp_admin_finance: 'Financial reports & CSV export', rp_admin_sql: 'SQL console & schema reset',
      rp_recept_dash: 'Dashboard (no revenue details)', rp_recept_rooms: 'View & update room status',
      rp_recept_users: 'View users (no delete)', rp_recept_bookings: 'Create & manage bookings',
      rp_recept_orders: 'Restaurant & kitchen orders', rp_recept_finance: 'No financial reports',
      rp_recept_sql: 'No SQL console access',
      rp_guest_dash: 'Dashboard overview', rp_guest_rooms: 'View room availability',
      rp_guest_bookings: 'View own bookings', rp_guest_menu: 'Browse menu & place orders',
      rp_guest_users: 'No user management', rp_guest_finance: 'No financial data',
      roles_switch: 'Switching roles:', roles_switch_body: 'Use the dropdown in the header. Your choice is remembered across sessions. If you switch to Guest while viewing a restricted page, you\'ll be automatically redirected to the Dashboard.',

      // Dashboard
      dash_help_title: 'Dashboard Overview', dash_help_sub: 'Your at-a-glance command centre',
      dh_kpi: 'The four KPI cards', dh_kpi_body: 'The top row shows real-time metrics: Total Revenue (rooms + dining), Occupancy Rate (percentage of rooms currently occupied), Active Bookings, and Available Menu Items. These update automatically whenever you add, edit, or delete data.',
      dh_charts: 'Charts', dh_charts_body: 'The Revenue Trend line chart shows the last six months of combined income from bookings and orders. The Room Categories doughnut chart shows how your inventory splits across Standard, Deluxe, Executive Suite, and Family Suite room types.',
      dh_banner: 'Promotional banner', dh_banner_body: 'The coloured banner at the top of the dashboard rotates through your active promotional slides. Manage them under Ad Banners in the sidebar.',

      // Rooms
      rh_title: 'Managing Rooms', rh_sub: 'Add, edit, and track room inventory',
      rh_add: 'Adding a new room',
      rh_add_1: 'Click Rooms in the sidebar.', rh_add_2: 'Click the Add Room button (top right).',
      rh_add_3: 'Fill in: Room Number, Capacity, Room Type, Price per Night, Status, and an optional Description.',
      rh_add_4: 'Press Save Room. The room appears in the table immediately.',
      rh_edit: 'Editing a room', rh_edit_body: 'Click the blue edit button on any room row. The form opens with all current values pre-filled. Modify anything and press Save Room.',
      rh_delete: 'Deleting a room', rh_delete_body: 'Click the red trash button. A confirmation dialog appears — because deleting a room also removes any bookings linked to it. Only Admin can delete.',
      rh_status: 'Room statuses', rh_status_body: 'Every room has one of four statuses, each with its own colour:',
      rh_status_available: 'ready for a new guest', rh_status_occupied: 'currently has a checked-in guest',
      rh_status_cleaning: 'being serviced after checkout', rh_status_maintenance: 'temporarily out of service',

      // Bookings
      bh_title: 'Bookings & Reservations', bh_sub: 'The heart of daily operations',
      bh_create: 'Creating a booking',
      bh_create_1: 'Open the Bookings module.', bh_create_2: 'Click New Booking.',
      bh_create_3: 'Choose a room from the dropdown. The price per night is shown.',
      bh_create_4: 'Enter the guest\'s name and phone number.',
      bh_create_5: 'Pick check-in and check-out dates. The total is auto-calculated.',
      bh_create_6: 'Set status and press Save Booking.',
      bh_grid: 'Live room status grid', bh_grid_body: 'Above the bookings table is a coloured grid showing every room\'s current status. Green = Available, red = Occupied, amber = Cleaning, purple = Maintenance. Use it as a quick visual overview.',
      bh_autosync: 'Automatic room status updates', bh_autosync_body: 'When you set a booking\'s status to CheckedIn, the linked room automatically becomes Occupied. When you set it to CheckedOut or Cancelled, the room becomes Cleaning. This keeps room inventory in sync without manual updates.',
      bh_tip: 'Time-saver:', bh_tip_body: 'Pick the check-in date first, then the check-out date. The total ETB is recalculated every time either date changes.',

      // Restaurant
      rest_title: 'Restaurant & Orders', rest_sub: 'Menu management and kitchen workflow',
      rest_menu: 'The menu catalog', rest_menu_body: 'Every dish appears as a card showing its category, availability status, name, description, and price. Available dishes have a green badge; hidden dishes have a red badge and don\'t appear in the order cart.',
      rest_add: 'Adding a dish',
      rest_add_1: 'In the Restaurant module, click Add Dish.', rest_add_2: 'Enter the name, category, and price in ETB.',
      rest_add_3: 'Tick Available on menu if it should be visible to guests.', rest_add_4: 'Add a short description and press Save Menu Item.',
      rest_order: 'Placing an order',
      rest_order_1: 'Click the pink plus on any dish card. It\'s added to the cart.',
      rest_order_2: 'The cart badge in the header shows the current item count.',
      rest_order_3: 'Click the Cart button (top right).', rest_order_4: 'Choose Room Service or Restaurant Table.',
      rest_order_5: 'Pick the target room or table from the dropdown.', rest_order_6: 'Review the cart, then press Submit Order.',
      rest_kitchen: 'Kitchen orders queue', rest_kitchen_body: 'Below the menu is the live orders queue. Every submitted order appears here with its type, target, items summary, total, and status. Statuses progress: Pending → Preparing → Served. Use the edit button to advance an order\'s status, or the trash button to delete it.',
      rest_dup: 'Duplicate items:', rest_dup_body: 'Adding the same dish twice increments its quantity in the cart instead of creating a duplicate line — much cleaner when ordering large tables.',

      // Tables
      th_title: 'Restaurant Tables', th_sub: 'Seating inventory for the dining room',
      th_zones: 'Three zones', th_zones_body: 'Every table belongs to one of three zones: Indoor Main, Garden Patio, or Rooftop Lounge. Each has its own capacity and status (Available, Reserved, Occupied).',
      th_add: 'Adding a table',
      th_add_1: 'Open the Restaurant Tables module.', th_add_2: 'Click Add Table.',
      th_add_3: 'Enter the table number (e.g. T-01), capacity, zone, and initial status.',
      th_add_4: 'Press Save Table.',
      th_integration: 'Integration:', th_integration_body: 'Every table you add here becomes a selectable target in the order cart dropdown. Add all your tables first, then place orders against them directly.',

      // Users
      uh_title: 'Users & Staff', uh_sub: 'Manage who can access the system',
      uh_add: 'Registering a new user',
      uh_add_1: 'Open the Users & Staff module.', uh_add_2: 'Click Add User.',
      uh_add_3: 'Fill in Full Name, Email (must be unique), Phone, and Role.', uh_add_4: 'Press Save User.',
      uh_roles: 'The three roles', uh_roles_body: 'Choose admin for owners/managers, receptionist for front-desk staff, and guest for visitor accounts. See the Roles & Permissions section above for the exact capabilities of each.',
      uh_unique: 'Unique emails:', uh_unique_body: 'Every user must have a distinct email address. If you try to save a duplicate, D1 rejects the insert and you\'ll see a red error toast.',

      // Reports
      rep_title: 'Financial Reports', rep_sub: 'Live revenue ledger & CSV export',
      rep_kpi: 'Revenue breakdown', rep_kpi_body: 'Three summary cards at the top show Room Revenue, Restaurant Revenue, and the Grand Total. These are computed live from the bookings and orders tables — there is no separate ledger to maintain.',
      rep_ledger: 'Transaction ledger', rep_ledger_body: 'Below the summary, every transaction appears as a row with its reference number (B<id> for bookings, O<id> for orders), date, type, description, payer, and amount. Rows are sorted by date, most recent first.',
      rep_csv: 'CSV export', rep_csv_body: 'Click Export CSV to download the entire ledger as a spreadsheet-ready file. Open it in Excel, Google Sheets, or Numbers for further analysis.',
      rep_receipt: 'Printing receipts', rep_receipt_body: 'Click the print button on any row to open a branded receipt in a printable format. Press Ctrl+P (or Cmd+P on Mac) or click the Print button.',

      // Banners
      ban_title: 'Ad Banners', ban_sub: 'Promotional slides for the dashboard',
      ban_add: 'Creating a banner',
      ban_add_1: 'Open the Ad Banners module.', ban_add_2: 'Click Create Banner.',
      ban_add_3: 'Enter a short title, a description, and an offer tag.',
      ban_add_4: 'Choose a badge colour for the tag.', ban_add_5: 'Tick Active to make it visible on the dashboard.',
      ban_add_6: 'Press Save Banner.',
      ban_rotate: 'Rotation:', ban_rotate_body: 'Only active banners appear on the dashboard. Currently the most recent active banner is featured in the hero area; you can hide a banner at any time by unticking the Active checkbox.',

      // SQL
      sql_title_help: 'Cloudflare D1 SQL Console', sql_sub_help: 'Advanced database access — Admin only',
      sql_danger: 'Admin only.', sql_danger_body: 'This module runs raw SQL against your production database. There is no undo. Only use it if you understand SQL.',
      sql_run: 'Running a query',
      sql_run_1: 'Open the D1 SQL Console.', sql_run_2: 'Type your SQL into the editor (e.g. SELECT * FROM rooms;).',
      sql_run_3: 'Click Run Query. Results appear as formatted JSON below.',
      sql_examples: 'Useful query examples',
      sql_reset: 'Resetting the schema', sql_reset_body: 'The Reset Schema button wipes all tables and re-creates them with the original column definitions. All data is lost. Use this only when you want to start fresh — for example, after a demo or test session.',

      // Themes
      theme_title: 'Themes: Dark & Light', theme_sub: 'Comfort for day and night shifts',
      theme_how: 'How to toggle', theme_how_body: 'Click the moon / sun icon in the header. The entire app — panels, tables, modals, forms, charts, and toasts — flips instantly between dark and light.',
      theme_persist: 'Remembered across visits', theme_persist_body: 'Your theme preference is saved in your browser. When you return to the app, the same theme loads automatically before the first paint — no flash.',
      theme_when: 'When to use each', theme_when_body: 'Dark theme is the default and best for evening or night shifts — it reduces eye strain in dim lighting. Light theme works best during daytime and for printing or screenshots.',

      // Languages
      lang_title: 'Languages: English & አማርኛ', lang_sub: 'Switch the entire interface instantly',
      lang_how: 'How to switch', lang_how_body: 'Click the language button in the header. It cycles between EN (English) and አማ (Amharic). Every label, table header, form field, toast, and modal is translated.',
      lang_what: 'What gets translated',
      lang_what_1: 'All navigation and page titles', lang_what_2: 'Buttons, table headers, form labels',
      lang_what_3: 'Room types, statuses, categories, zones', lang_what_4: 'Toast notifications and error messages',
      lang_what_5: 'Receipts and printed documents', lang_what_6: 'Chart legends and month names',
      lang_db: 'Database stays English:', lang_db_body: 'The values stored in the database (room statuses, categories, etc.) remain in English. Translation happens only at display time, so your data stays consistent regardless of the interface language.',

      // Shortcuts
      sc_title: 'Keyboard Shortcuts', sc_sub: 'Work faster without the mouse',
      sc_col_action: 'Action', sc_col_keys: 'Shortcut',
      sc_open_search: 'Focus search field', sc_close_modal: 'Close any open modal',
      sc_close_modal_2: 'Click outside a modal', sc_submit_form: 'Submit the current form',
      sc_print: 'Print the current page or receipt', sc_tab: 'Move between form fields',

      // FAQ
      faq_title: 'Frequently Asked Questions', faq_sub: 'Answers to the most common questions',
      faq_q1: 'Is my data saved automatically?', faq_a1: 'Yes. Every time you save a form (room, booking, dish, etc.), the change is sent immediately to the Cloudflare D1 database. There is no separate "Save" step or draft state.',
      faq_q2: 'Can I use the app offline?', faq_a2: 'Partially. If the network is down, the header badge changes to "D1 Offline — Local Cache" and the app loads your last cached data. You can still view everything. However, changes you make while offline won\'t sync back to the server — they stay only in your browser.',
      faq_q3: 'Why can\'t I see the SQL Console?', faq_a3: 'The SQL Console is restricted to the Admin role. If you\'re viewing as Receptionist or Guest, the menu item is hidden. Switch roles via the dropdown in the header to access it.',
      faq_q4: 'Can I undo a delete?', faq_a4: 'No. Deletions are permanent. The confirmation dialog exists to prevent accidents, but once you confirm, the record is gone from the D1 database. If you\'ve made a mistake, you\'ll need to re-enter the data manually.',
      faq_q5: 'How do I know if a save worked?', faq_a5: 'A green toast appears in the bottom-right corner with a checkmark icon and a message like "Added Room 105". If something fails, you\'ll see a red toast with the error message instead.',
      faq_q6: 'Can I add a third language?', faq_a6: 'Yes — this is a developer task. The app\'s translation dictionary lives in app.js under T.en and T.am. To add a new language (e.g. Afaan Oromoo), add a T.om key with all the same translation keys. The language button would then cycle EN → አማ → OM.',
      faq_q7: 'What happens if the internet drops mid-save?', faq_a7: 'The save will fail and you\'ll see a red error toast. The form stays open so you can retry once the connection is restored. Nothing is half-saved — D1 transactions are atomic.',
      faq_q8: 'Who can see the financial reports?', faq_a8: 'Only Admins. The Financial Reports module is completely hidden from Receptionists and Guests. In a production system this would also be enforced at the API level.',

      // Troubleshooting
      ts_title: 'Common Issues', ts_sub: 'Quick fixes for frequent problems',
      ts_offline: 'Header says "D1 Offline"', ts_offline_body: 'Cause: The Cloudflare Worker API is unreachable. Fix: Check your internet connection. Try clicking the refresh button in the header. If it persists, the API might be temporarily down — wait a few minutes and try again.',
      ts_error: 'Red error toast after saving', ts_error_body: 'Cause: The database rejected the save — usually a duplicate value (room number, email) or a missing required field. Fix: Read the error message in the toast. Common issues: room numbers must be unique; email addresses must be unique; guest names, phone numbers, and dates are required for bookings.',
      ts_mobile: 'Sidebar won\'t open on mobile', ts_mobile_body: 'Fix: Tap the menu icon in the top-left corner of the header. If it still won\'t open, refresh the page. On very small screens, the sidebar slides in from the left as an overlay — tap outside it to close.',
      ts_charts: 'Charts are blank', ts_charts_body: 'Cause: Usually a browser issue — Chart.js failed to load from the CDN. Fix: Hard-refresh the page (Ctrl+Shift+R). If it persists, check that your network isn\'t blocking cdn.jsdelivr.net.',
      ts_403: '"D1 must be online" message', ts_403_body: 'Cause: You tried to run a SQL query or reset the schema while the app was in offline mode. Fix: Reconnect to the internet and refresh. Only online mode can execute raw SQL or reset the schema.',
      ts_theme: 'Theme won\'t stick', ts_theme_body: 'Cause: Your browser may be blocking localStorage (private browsing mode or strict cookie settings). Fix: Allow site data for the app\'s domain in your browser settings, or exit private browsing.',

      // Contact
      contact_title: 'Contact Support', contact_sub: 'Still stuck? Reach out',
      contact_phone_label: 'Front Desk Phone', contact_phone_desc: 'Available 24 / 7',
      contact_email_label: 'Support Email', contact_email_desc: 'Response within 24 hours',
      contact_address_label: 'Address', contact_address_desc: 'Walk-ins welcome',
      contact_hours_label: 'Reception Hours', contact_hours_value: '24 hours · 7 days', contact_hours_desc: 'Always open',
      contact_thanks: 'Thank you for using Asni Guest House.',
      contact_thanks_body: 'We hope this guide helps you get the most out of the system. For technical issues specific to the software, contact the developer directly.',

      // No results
      no_results_title: 'No matching results', no_results_body: 'Try a different search term, or browse the sidebar categories.'
    },

    am: {
      menu: 'ዝርዝር', theme_toggle: 'ገጽታ ቀይር', lang_toggle: 'ቋንቋ ቀይር',
      help_title: 'እርዳታና ድጋፍ',
      help_sub: 'Asni Guest House ን ለመጠቀም የሚያስፈልግዎ ሁሉ',
      back_to_app: 'ወደ መተግበሪያ ተመለስ',
      search_placeholder: 'እርዳታ ፈልግ…',
      version: 'ቅጂ',
      footer_version: 'የእርዳታ ማዕከል v3.0',
      footer_back: 'ወደ መተግበሪያ ተመለስ',

      hero_kicker: 'የተጠቃሚ መመሪያ',
      hero_title: 'እንኳን ወደ Asni Guest House በደህና መጡ',
      hero_sub: 'የ Asni Guest House አስተዳደር ስርዓትን ለመጠቀም የተሟላ መመሪያ። ክፍሎችን፣ ቦታ ማስያዞችን፣ የምግብ ቤት ትዕዛዞችን፣ የሰራተኛ መዝገቦችንና የፋይናንስ ሪፖርቶችን እንዴት ማስተዳደር እንደሚችሉ ይማሩ።',
      btn_get_started: 'ይጀምሩ',
      btn_view_faq: 'ተደጋጋሚ ጥያቄዎችን ይመልከቱ',

      toc_getting_started: 'መጀመር',
      toc_features: 'ባህሪያት',
      toc_settings: 'ቅንብሮች',
      toc_trouble: 'ችግር መፍታት',
      toc_intro: 'መግቢያ',
      toc_start: 'መጀመር',
      toc_roles: 'ሚናዎችና ፈቃዶች',
      toc_dashboard: 'ዳሽቦርድ',
      toc_rooms: 'ክፍሎችን ማስተዳደር',
      toc_bookings: 'ቦታ ማስያዝ',
      toc_restaurant: 'ምግብ ቤትና ትዕዛዞች',
      toc_tables: 'የምግብ ቤት ጠረጴዛዎች',
      toc_users: 'ተጠቃሚዎችና ሰራተኞች',
      toc_reports: 'የፋይናንስ ሪፖርቶች',
      toc_banners: 'ማስታወቂያዎች',
      toc_sql: 'SQL ኮንሶል',
      toc_theme: 'ገጽታዎች',
      toc_lang: 'ቋንቋዎች',
      toc_shortcuts: 'የቁልፍ ሰሌዳ አቋራጮች',
      toc_faq: 'ተደጋጋሚ ጥያቄዎች',
      toc_troubleshoot: 'የተለመዱ ችግሮች',
      toc_contact: 'ድጋፍ ያግኙ',

      qs_modules: 'ሞጁሎች', qs_roles: 'የተጠቃሚ ሚናዎች',
      qs_shortcuts: 'አቋራጮች', qs_support: 'ድጋፍ',

      gs_title: 'መጀመር', gs_sub: 'የመጀመሪያ 5 ደቂቃዎችዎ',
      gs_step1_title: 'መተግበሪያውን ይክፈቱ', gs_step1_body: 'asni-guest-house.vercel.app ን በማንኛውም ዘመናዊ አሳሽ (Chrome, Edge, Firefox ወይም Safari) ይጎብኙ። መተግበሪያው ወዲያውኑ ይጫናል — ምንም ጭነት አያስፈልግም።',
      gs_step2_title: 'ሚናዎን ይምረጡ', gs_step2_body: 'በራስጌ በላይኛው ቀኝ በኩል ያለውን የሚና ተቆልቋይ በመጠቀም በ Admin, Receptionist እና Guest እይታዎች መካከል ይቀያይሩ። የላይኛው አሞሌ ቀለምና የሚታዩ የምናሌ ዕቃዎች ወዲያውኑ ይቀየራሉ።',
      gs_step3_title: 'የጎን አሞሌውን ያስሱ', gs_step3_body: 'የግራ ጎን አሞሌ ዋና የማውጫ መንገድዎ ነው። ወደዚያ ሞጁል ለመዝለል ማንኛውንም ዕቃ ይጫኑ። በሞባይል ላይ ለማሳየት የምናሌ አዶውን ይንኩ።',
      gs_step4_title: 'መዝገብ ማከል ይሞክሩ', gs_step4_body: 'በክፍሎች ይጀምሩ → ክፍል ጨምር ን ይጫኑ። ቅጹን ይሙሉና ክፍል አስቀምጥ ን ይጫኑ። አረንጓዴ ማሳወቂያ ማስቀመጡን ያረጋግጣል እና አዲሱ ክፍል ወዲያውኑ በሠንጠረዡ ውስጥ ይታያል።',
      gs_tip: 'ጠቃሚ ምክር:', gs_tip_body: 'መተግበሪያው ከመስመር ውጪም ይሰራል። ኔትወርኩ ከተቋረጠ "D1 Offline — Local Cache" በራስጌ ውስጥ ያያሉ እና ሁሉም ነገር በተቀመጠ ውሂብ ይሰራል።',

      roles_title: 'ሚናዎችና ፈቃዶች', roles_sub: 'እያንዳንዱ የተጠቃሚ ዓይነት ምን ማየትና ማድረግ እንደሚችል',
      role_admin_full: 'አስተዳዳሪ', role_recept_full: 'ተቀባይ', role_guest_full: 'እንግዳ',
      rp_admin_dash: 'ሙሉ ዳሽቦርድ መዳረሻ', rp_admin_rooms: 'ክፍሎችን፣ ዋጋን፣ ተገኝነትን ማስተዳደር',
      rp_admin_users: 'የሰራተኛ መዝገቦችን መፍጠርና ማሻሻል', rp_admin_bookings: 'ሙሉ የቦታ ማስያዝ ቁጥጥር',
      rp_admin_finance: 'የፋይናንስ ሪፖርቶችና CSV ማውጣት', rp_admin_sql: 'SQL ኮንሶልና ስኪማ ማደስ',
      rp_recept_dash: 'ዳሽቦርድ (የገቢ ዝርዝር የለም)', rp_recept_rooms: 'የክፍል ሁኔታ ማየትና ማዘመን',
      rp_recept_users: 'ተጠቃሚዎችን ማየት (መሰረዝ የለም)', rp_recept_bookings: 'ቦታ ማስያዞችን መፍጠርና ማስተዳደር',
      rp_recept_orders: 'የምግብ ቤትና የወጥ ቤት ትዕዛዞች', rp_recept_finance: 'የፋይናንስ ሪፖርቶች የሉም',
      rp_recept_sql: 'የ SQL ኮንሶል መዳረሻ የለም',
      rp_guest_dash: 'የዳሽቦርድ አጠቃላይ እይታ', rp_guest_rooms: 'የክፍል ተገኝነት ማየት',
      rp_guest_bookings: 'የራስ ቦታ ማስያዞችን ማየት', rp_guest_menu: 'ምናሌ ማሰስና ትዕዛዝ ማስገባት',
      rp_guest_users: 'የተጠቃሚ አስተዳደር የለም', rp_guest_finance: 'የፋይናንስ ውሂብ የለም',
      roles_switch: 'ሚና መቀየር:', roles_switch_body: 'በራስጌ ውስጥ ያለውን ተቆልቋይ ይጠቀሙ። ምርጫዎ በክፍለ ጊዜዎች ይታወሳል። በተከለከለ ገጽ ላይ ሳለዎት ወደ Guest ከተቀየሩ በራስ-ሰር ወደ ዳሽቦርድ ይመራሉ።',

      dash_help_title: 'የዳሽቦርድ አጠቃላይ እይታ', dash_help_sub: 'የእርስዎ በአንድ እይታ የትዕዛዝ ማዕከል',
      dh_kpi: 'አራቱ የ KPI ካርዶች', dh_kpi_body: 'የላይኛው ረድፍ የቀጥታ መለኪያዎችን ያሳያል፡ ጠቅላላ ገቢ (ክፍል + ምግብ)፣ የተያዘ መጠን (በአሁኑ ጊዜ የተያዙ ክፍሎች መቶኛ)፣ ንቁ ቦታ ማስያዞች እና ያሉ የምናሌ ዕቃዎች። ውሂብ ሲጨምሩ፣ ሲያስተካክሉ ወይም ሲሰርዙ እነዚህ በራስ-ሰር ይዘመናሉ።',
      dh_charts: 'ግራፎች', dh_charts_body: 'የገቢ አዝማሚያ መስመራዊ ግራፍ ላለፉት ስድስት ወራት ከቦታ ማስያዞችና ከትዕዛዞች የተገኘውን ገቢ ያሳያል። የክፍል ምድቦች ዶናት ግራፍ ክምችትዎ በ Standard, Deluxe, Executive Suite እና Family Suite ክፍሎች እንዴት እንደሚከፋፈል ያሳያል።',
      dh_banner: 'የማስተዋወቂያ ባነር', dh_banner_body: 'በዳሽቦርድ ላይኛው ክፍል ያለው ባለቀለም ባነር ንቁ የማስተዋወቂያ ስላይዶችዎን ያሳያል። በጎን አሞሌ በኩል ባለው "ማስታወቂያዎች" ውስጥ ያስተዳድሩ።',

      rh_title: 'ክፍሎችን ማስተዳደር', rh_sub: 'የክፍል ክምችት ማከል፣ ማሻሻልና መከታተል',
      rh_add: 'አዲስ ክፍል ማከል',
      rh_add_1: 'በጎን አሞሌ "ክፍሎች" ን ይጫኑ።', rh_add_2: '"ክፍል ጨምር" ቁልፍን (በላይኛው ቀኝ) ይጫኑ።',
      rh_add_3: 'ይሙሉ፡ የክፍል ቁጥር፣ አቅም፣ የክፍል ዓይነት፣ ዋጋ በሌሊት፣ ሁኔታ እና አማራጭ መግለጫ።',
      rh_add_4: '"ክፍል አስቀምጥ" ን ይጫኑ። ክፍሉ ወዲያውኑ በሠንጠረዡ ውስጥ ይታያል።',
      rh_edit: 'ክፍል ማስተካከል', rh_edit_body: 'በማንኛውም የክፍል ረድፍ ላይ ሰማያዊውን የማስተካከያ ቁልፍ ይጫኑ። ቅጹ አሁን ባሉት እሴቶች ተሞልቶ ይከፈታል። ማንኛውንም ያስተካክሉና "ክፍል አስቀምጥ" ን ይጫኑ።',
      rh_delete: 'ክፍል መሰረዝ', rh_delete_body: 'ቀዩን የመሰረዣ ቁልፍ ይጫኑ። የማረጋገጫ መልእክት ይታያል — ክፍል መሰረዝ ከእሱ ጋር የተያያዙ ቦታ ማስያዞችንም ያስወግዳል። ማስወገድ የሚችለው አስተዳዳሪ ብቻ ነው።',
      rh_status: 'የክፍል ሁኔታዎች', rh_status_body: 'እያንዳንዱ ክፍል ከአራቱ ሁኔታዎች አንዱ አለው፣ እያንዳንዱም የራሱ ቀለም አለው፡',
      rh_status_available: 'ለአዲስ እንግዳ ዝግጁ', rh_status_occupied: 'በአሁኑ ጊዜ የገባ እንግዳ አለው',
      rh_status_cleaning: 'ከመውጣት በኋላ በጽዳት ላይ', rh_status_maintenance: 'በጊዜያዊነት ከአገልግሎት ውጪ',

      bh_title: 'ቦታ ማስያዝና ቦታ ማስያዝ', bh_sub: 'የዕለት ተዕለት ስራዎች ልብ',
      bh_create: 'ቦታ ማስያዝ መፍጠር',
      bh_create_1: 'የቦታ ማስያዝ ሞጁሉን ይክፈቱ።', bh_create_2: '"አዲስ ቦታ ማስያዝ" ን ይጫኑ።',
      bh_create_3: 'ከተቆልቋዩ ክፍል ይምረጡ። ዋጋ በሌሊት ይታያል።',
      bh_create_4: 'የእንግዳውን ስምና ስልክ ቁጥር ያስገቡ።',
      bh_create_5: 'የመግቢያና የመውጫ ቀኖችን ይምረጡ። ጠቅላላው በራስ-ሰር ይሰላል።',
      bh_create_6: 'ሁኔታ ያዘጋጁና "ቦታ ማስያዝ አስቀምጥ" ን ይጫኑ።',
      bh_grid: 'የክፍሎች ሁኔታ ፍርግርግ', bh_grid_body: 'ከቦታ ማስያዝ ሠንጠረዥ በላይ የእያንዳንዱን ክፍል ሁኔታ የሚያሳይ ባለቀለም ፍርግርግ አለ። አረንጓዴ = ነፃ፣ ቀይ = ተይዟል፣ ወርቃማ = በጽዳት ላይ፣ ወይን ጠጅ = ጥገና። እንደ ፈጣን እይታ ይጠቀሙበት።',
      bh_autosync: 'ራስ-ሰር የክፍል ሁኔታ ዝማኔዎች', bh_autosync_body: 'የቦታ ማስያዝን ሁኔታ ወደ "ገብቷል" ሲያዘጋጁ፣ የተያያዘው ክፍል በራስ-ሰር "ተይዟል" ይሆናል። ወደ "ወጥቷል" ወይም "ተሰርዟል" ሲያዘጋጁ፣ ክፍሉ "በጽዳት ላይ" ይሆናል። ይህ የክፍል ክምችትን ያለ በእጅ ዝማኔ በተመሳሳይ ሁኔታ ያቆያል።',
      bh_tip: 'የጊዜ ቆጣቢ:', bh_tip_body: 'በመጀመሪያ የመግቢያ ቀን፣ ከዚያም የመውጫ ቀን ይምረጡ። ከሁለቱም ቀኖች አንዱ ሲቀየር ጠቅላላው ብር እንደገና ይሰላል።',

      rest_title: 'ምግብ ቤትና ትዕዛዞች', rest_sub: 'የምናሌ አስተዳደርና የወጥ ቤት ሂደት',
      rest_menu: 'የምናሌ ካታሎግ', rest_menu_body: 'እያንዳንዱ ምግብ ምድቡን፣ የተገኝነት ሁኔታውን፣ ስሙን፣ መግለጫውንና ዋጋውን የሚያሳይ ካርድ ሆኖ ይታያል። ያሉ ምግቦች አረንጓዴ ባጅ አላቸው፤ የተደበቁ ምግቦች ቀይ ባጅ አላቸው እና በትዕዛዝ ጋሪ ውስጥ አይታዩም።',
      rest_add: 'ምግብ ማከል',
      rest_add_1: 'በምግብ ቤት ሞጁል ውስጥ "ምግብ ጨምር" ን ይጫኑ።', rest_add_2: 'ስሙን፣ ምድቡንና ዋጋውን በብር ያስገቡ።',
      rest_add_3: 'ለእንግዶች መታየት ካለበት "በምናሌ ላይ አለ" ን ምልክት ያድርጉ።', rest_add_4: 'አጭር መግለጫ ያክሉና "ምግብ አስቀምጥ" ን ይጫኑ።',
      rest_order: 'ትዕዛዝ ማስገባት',
      rest_order_1: 'በማንኛውም የምግብ ካርድ ላይ ሮዝ ፕላስ ን ይጫኑ። ወደ ጋሪ ይታከላል።',
      rest_order_2: 'በራስጌ ውስጥ ያለው የጋሪ ባጅ የአሁኑን የዕቃ ብዛት ያሳያል።',
      rest_order_3: '"ጋሪ" ቁልፍን (በላይኛው ቀኝ) ይጫኑ።', rest_order_4: '"የክፍል አገልግሎት" ወይም "የምግብ ቤት ጠረጴዛ" ን ይምረጡ።',
      rest_order_5: 'ከተቆልቋዩ ዒላማውን ክፍል ወይም ጠረጴዛ ይምረጡ።', rest_order_6: 'ጋሪውን ይገምግሙና "ትዕዛዝ አስገባ" ን ይጫኑ።',
      rest_kitchen: 'የወጥ ቤት ትዕዛዞች ወረፋ', rest_kitchen_body: 'ከምናሌው በታች የቀጥታ ትዕዛዞች ወረፋ አለ። እያንዳንዱ የቀረበ ትዕዛዝ ዓይነቱን፣ ዒላማውን፣ የዕቃ ማጠቃለያውን፣ ጠቅላላውንና ሁኔታውን ይዞ እዚህ ይታያል። ሁኔታዎች ይራመዳሉ፡ በመጠባበቅ ላይ → በዝግጅት ላይ → ቀርቧል። ሁኔታን ለማራመድ የማስተካከያ ቁልፍን፣ ለመሰረዝ የመሰረዣ ቁልፍን ይጠቀሙ።',
      rest_dup: 'የተደጋገሙ ዕቃዎች:', rest_dup_body: 'ተመሳሳይ ምግብ ሁለት ጊዜ መጨመር የተደጋገመ መስመር ከመፍጠር ይልቅ በጋሪ ውስጥ ብዛቱን ይጨምራል — ትላልቅ ጠረጴዛዎችን ሲያዙ በጣም ንጹህ ነው።',

      th_title: 'የምግብ ቤት ጠረጴዛዎች', th_sub: 'የመመገቢያ ክፍል መቀመጫ ክምችት',
      th_zones: 'ሦስት አካባቢዎች', th_zones_body: 'እያንዳንዱ ጠረጴዛ ከሦስቱ አካባቢዎች አንዱ ነው፡ ውስጣዊ ዋና፣ የአትክልት ቦታ ወይም የጣሪያ ማረፊያ። እያንዳንዱ የራሱ አቅምና ሁኔታ (ነፃ፣ ተይዟል፣ ተይዟል) አለው።',
      th_add: 'ጠረጴዛ ማከል',
      th_add_1: 'የምግብ ቤት ጠረጴዛዎች ሞጁሉን ይክፈቱ።', th_add_2: '"ጠረጴዛ ጨምር" ን ይጫኑ።',
      th_add_3: 'የጠረጴዛ ቁጥሩን (ለምሳሌ T-01)፣ አቅም፣ አካባቢና የመጀመሪያ ሁኔታ ያስገቡ።',
      th_add_4: '"ጠረጴዛ አስቀምጥ" ን ይጫኑ።',
      th_integration: 'ውህደት:', th_integration_body: 'እዚህ የሚጨምሩት እያንዳንዱ ጠረጴዛ በትዕዛዝ ጋሪ ተቆልቋይ ውስጥ የሚመረጥ ዒላማ ይሆናል። በመጀመሪያ ሁሉንም ጠረጴዛዎችዎን ያክሉ፣ ከዚያ በቀጥታ ትዕዛዞችን ያስገቡ።',

      uh_title: 'ተጠቃሚዎችና ሰራተኞች', uh_sub: 'ስርዓቱን ማን ማግኘት እንደሚችል ያስተዳድሩ',
      uh_add: 'አዲስ ተጠቃሚ መመዝገብ',
      uh_add_1: 'ተጠቃሚዎችና ሰራተኞች ሞጁሉን ይክፈቱ።', uh_add_2: '"ተጠቃሚ ጨምር" ን ይጫኑ።',
      uh_add_3: 'ሙሉ ስም፣ ኢሜይል (ልዩ መሆን አለበት)፣ ስልክና ሚና ይሙሉ።', uh_add_4: '"ተጠቃሚ አስቀምጥ" ን ይጫኑ።',
      uh_roles: 'ሦስቱ ሚናዎች', uh_roles_body: 'ለባለቤቶች/አስተዳዳሪዎች admin፣ ለፊት ዴስክ ሰራተኞች receptionist፣ ለጎብኚ መዝገቦች guest ይምረጡ። የእያንዳንዱን ትክክለኛ ችሎታዎች ከላይ ባለው "ሚናዎችና ፈቃዶች" ክፍል ይመልከቱ።',
      uh_unique: 'ልዩ ኢሜይሎች:', uh_unique_body: 'እያንዳንዱ ተጠቃሚ የተለየ የኢሜይል አድራሻ ሊኖረው ይገባል። ተደጋጋሚ ለማስቀመጥ ከሞከሩ D1 ማስገባቱን ውድቅ ያደርጋል እና ቀይ የስህተት ማሳወቂያ ያያሉ።',

      rep_title: 'የፋይናንስ ሪፖርቶች', rep_sub: 'የቀጥታ የገቢ ደብተርና CSV ማውጣት',
      rep_kpi: 'የገቢ ክፍፍል', rep_kpi_body: 'በላይኛው ክፍል ሦስት የማጠቃለያ ካርዶች የክፍል ገቢን፣ የምግብ ቤት ገቢንና ጠቅላላ ድምርን ያሳያሉ። እነዚህ ከቦታ ማስያዞችና ከትዕዛዞች ሠንጠረዦች በቀጥታ ይሰላሉ — ለማስተዳደር የተለየ ደብተር የለም።',
      rep_ledger: 'የግብይት ደብተር', rep_ledger_body: 'ከማጠቃለያው በታች እያንዳንዱ ግብይት በማጣቀሻ ቁጥሩ (B<id> ለቦታ ማስያዞች፣ O<id> ለትዕዛዞች)፣ ቀን፣ ዓይነት፣ መግለጫ፣ ከፋይና መጠን ሆኖ ይታያል። ረድፎች በቀን ተለይተው ይቀመጣሉ፣ በጣም አዲሱ መጀመሪያ።',
      rep_csv: 'CSV ማውጣት', rep_csv_body: 'ሙሉ ደብተሩን ለተመን ሉህ ዝግጁ የሆነ ፋይል አድርጎ ለማውረድ "CSV አውጣ" ን ይጫኑ። ለተጨማሪ ትንተና በ Excel, Google Sheets ወይም Numbers ይክፈቱት።',
      rep_receipt: 'ደረሰኞችን ማተም', rep_receipt_body: 'በማንኛውም ረድፍ ላይ የህትመት ቁልፍን በመጫን በምርት ስም ያለውን ደረሰኝ በሚታተም ቅርጸት ይክፈቱ። Ctrl+P (ወይም በ Mac Cmd+P) ን ይጫኑ ወይም "አትም" ቁልፍን ይጫኑ።',

      ban_title: 'ማስታወቂያዎች', ban_sub: 'ለዳሽቦርድ የማስተዋወቂያ ስላይዶች',
      ban_add: 'ማስታወቂያ መፍጠር',
      ban_add_1: 'ማስታወቂያዎች ሞጁሉን ይክፈቱ።', ban_add_2: '"ማስታወቂያ ፍጠር" ን ይጫኑ።',
      ban_add_3: 'አጭር ርዕስ፣ መግለጫና የቅናሽ መለያ ያስገቡ።',
      ban_add_4: 'ለመለያው የባጅ ቀለም ይምረጡ።', ban_add_5: 'በዳሽቦርድ ላይ እንዲታይ "ንቁ" ን ምልክት ያድርጉ።',
      ban_add_6: '"ማስታወቂያ አስቀምጥ" ን ይጫኑ።',
      ban_rotate: 'ማሽከርከር:', ban_rotate_body: 'በዳሽቦርድ ላይ የሚታዩት ንቁ ማስታወቂያዎች ብቻ ናቸው። በአሁኑ ጊዜ በጣም አዲሱ ንቁ ማስታወቂያ በሄሮ አካባቢ ይታያል፤ "ንቁ" ሳጥኑን በማንሳት በማንኛውም ጊዜ ማስታወቂያን መደበቅ ይችላሉ።',

      sql_title_help: 'Cloudflare D1 SQL ኮንሶል', sql_sub_help: 'የላቀ የውሂብ ቤዝ መዳረሻ — ለአስተዳዳሪ ብቻ',
      sql_danger: 'ለአስተዳዳሪ ብቻ።', sql_danger_body: 'ይህ ሞጁል በምርት ውሂብ ቤዝዎ ላይ ጥሬ SQL ያሂዳል። መመለሻ የለም። SQL ካልተረዱት ብቻ ይጠቀሙበት።',
      sql_run: 'ጥያቄ ማሂድ',
      sql_run_1: 'D1 SQL ኮንሶሉን ይክፈቱ።', sql_run_2: 'SQL ዎን ወደ አርታዒው ይተይቡ (ለምሳሌ SELECT * FROM rooms;)።',
      sql_run_3: '"ጥያቄ አሂድ" ን ይጫኑ። ውጤቶች ከታች እንደ ተቀረጸ JSON ይታያሉ።',
      sql_examples: 'ጠቃሚ የጥያቄ ምሳሌዎች',
      sql_reset: 'ስኪማ ማደስ', sql_reset_body: '"ስኪማ አድስ" ቁልፍ ሁሉንም ሠንጠረዦች ያጠፋልና በመጀመሪያዎቹ የአምድ ትርጓሜዎች እንደገና ይፈጥራል። ሁሉም ውሂብ ይጠፋል። ከሙከራ ወይም ከማሳያ ክፍለ ጊዜ በኋላ አዲስ ለመጀመር ሲፈልጉ ብቻ ይጠቀሙበት።',

      theme_title: 'ገጽታዎች፡ ጨለማና ብሩህ', theme_sub: 'ለቀንና ለሌሊት ፈረቃዎች ምቾት',
      theme_how: 'እንዴት መቀየር እንደሚቻል', theme_how_body: 'በራስጌ ውስጥ ያለውን የጨረቃ / ፀሐይ አዶ ይጫኑ። መተግበሪያው በሙሉ — ፓነሎች፣ ሠንጠረዦች፣ ሞዳሎች፣ ቅጾች፣ ግራፎችና ማሳወቂያዎች — ወዲያውኑ በጨለማና በብሩህ መካከል ይቀያየራል።',
      theme_persist: 'በጉብኝቶች መካከል ይታወሳል', theme_persist_body: 'የገጽታ ምርጫዎ በአሳሽዎ ውስጥ ይቀመጣል። ወደ መተግበሪያው ሲመለሱ ተመሳሳይ ገጽታ ከመጀመሪያው ቀለም በፊት በራስ-ሰር ይጫናል — ብልጭታ የለም።',
      theme_when: 'እያንዳንዱን መቼ መጠቀም እንዳለበት', theme_when_body: 'ጨለማ ገጽታ ነባሪ ነው እና ለምሽት ወይም ለሌሊት ፈረቃዎች በጣም ጥሩ ነው — በደካማ ብርሃን ውስጥ የዓይን ጫናን ይቀንሳል። ብሩህ ገጽታ በቀን ጊዜና ለህትመት ወይም ለስክሪን ፎቶዎች በጣም ጥሩ ነው።',

      lang_title: 'ቋንቋዎች፡ እንግሊዝኛና አማርኛ', lang_sub: 'ሙሉ በይነገጹን ወዲያውኑ ይቀያይሩ',
      lang_how: 'እንዴት መቀየር እንደሚቻል', lang_how_body: 'በራስጌ ውስጥ ያለውን የቋንቋ ቁልፍ ይጫኑ። በ EN (እንግሊዝኛ) እና በ አማ (አማርኛ) መካከል ይሽከረከራል። እያንዳንዱ መለያ፣ የሠንጠረዥ ራስጌ፣ የቅጽ መስክ፣ ማሳወቂያና ሞዳል ይተረጎማል።',
      lang_what: 'ምን ይተረጎማል',
      lang_what_1: 'ሁሉም የማውጫ መንገድና የገጽ ርዕሶች', lang_what_2: 'ቁልፎች፣ የሠንጠረዥ ራስጌዎች፣ የቅጽ መለያዎች',
      lang_what_3: 'የክፍል ዓይነቶች፣ ሁኔታዎች፣ ምድቦች፣ አካባቢዎች', lang_what_4: 'የማሳወቂያ መልእክቶችና የስህተት መልእክቶች',
      lang_what_5: 'ደረሰኞችና የታተሙ ሰነዶች', lang_what_6: 'የግራፍ አፈ ታሪኮችና የወር ስሞች',
      lang_db: 'ውሂብ ቤዙ እንግሊዝኛ ሆኖ ይቆያል:', lang_db_body: 'በውሂብ ቤዙ ውስጥ የተከማቹ እሴቶች (የክፍል ሁኔታዎች፣ ምድቦች ወዘተ) በእንግሊዝኛ ሆነው ይቆያሉ። ትርጉም የሚከናወነው በማሳያ ጊዜ ብቻ ነው፣ ስለዚህ ውሂብዎ ከበይነገጽ ቋንቋ ጋር ተመሳሳይ ሆኖ ይቆያል።',

      sc_title: 'የቁልፍ ሰሌዳ አቋራጮች', sc_sub: 'ያለ አይጥ በፍጥነት ይስሩ',
      sc_col_action: 'ተግባር', sc_col_keys: 'አቋራጭ',
      sc_open_search: 'የፍለጋ መስክን አተኩር', sc_close_modal: 'ማንኛውንም ክፍት ሞዳል ዝጋ',
      sc_close_modal_2: 'ከሞዳል ውጪ ይጫኑ', sc_submit_form: 'የአሁኑን ቅጽ አስገባ',
      sc_print: 'የአሁኑን ገጽ ወይም ደረሰኝ አትም', sc_tab: 'በቅጽ መስኮች መካከል ይንቀሳቀሱ',

      faq_title: 'ተደጋጋሚ ጥያቄዎች', faq_sub: 'ለበጣም የተለመዱ ጥያቄዎች መልሶች',
      faq_q1: 'ውሂቤ በራስ-ሰር ይቀመጣል?', faq_a1: 'አዎ። ቅጽ በሚያስቀምጡ ቁጥር (ክፍል፣ ቦታ ማስያዝ፣ ምግብ ወዘተ) ለውጡ ወዲያውኑ ወደ Cloudflare D1 ውሂብ ቤዝ ይላካል። የተለየ "አስቀምጥ" ደረጃ ወይም ረቂቅ ሁኔታ የለም።',
      faq_q2: 'መተግበሪያውን ከመስመር ውጪ መጠቀም እችላለሁ?', faq_a2: 'በከፊል። ኔትወርኩ ከተቋረጠ የራስጌ ባጅ ወደ "D1 Offline — Local Cache" ይቀየራል እና መተግበሪያው የመጨረሻውን የተቀመጠ ውሂብ ይጭናል። ሁሉንም ማየት ይችላሉ። ሆኖም ከመስመር ውጪ ሳለ የሚያደርጉት ለውጦች ወደ አገልጋይ አይመለሱም — በአሳሽዎ ውስጥ ብቻ ይቆያሉ።',
      faq_q3: 'የ SQL ኮንሶል ለምን አላየሁም?', faq_a3: 'የ SQL ኮንሶል ለአስተዳዳሪ ሚና ብቻ የተከለከለ ነው። እንደ ተቀባይ ወይም እንግዳ እያዩ ከሆነ የምናሌ ዕቃው ተደብቋል። ለመድረስ በራስጌ ውስጥ ባለው ተቆልቋይ ሚና ይቀያይሩ።',
      faq_q4: 'መሰረዝን መመለስ እችላለሁ?', faq_a4: 'አይ። መሰረዞች ቋሚ ናቸው። የማረጋገጫ መልእክቱ አደጋዎችን ለመከላከል ነው፣ ግን አንዴ ካረጋገጡ መዝገቡ ከ D1 ውሂብ ቤዝ ጠፍቷል። ስህተት ከሠሩ ውሂቡን በእጅ እንደገና ማስገባት ይኖርብዎታል።',
      faq_q5: 'ማስቀመጥ መሳካቱን እንዴት አውቃለሁ?', faq_a5: 'አረንጓዴ ማሳወቂያ በታችኛው ቀኝ ጥግ ላይ የማረጋገጫ አዶና እንደ "Added Room 105" ያለ መልእክት ይዞ ይታያል። የሆነ ነገር ካልተሳካ በምትኩ ቀይ ማሳወቂያ ከስህተት መልእክቱ ጋር ያያሉ።',
      faq_q6: 'ሦስተኛ ቋንቋ ማከል እችላለሁ?', faq_a6: 'አዎ — ይህ የገንቢ ተግባር ነው። የመተግበሪያው የትርጉም መዝገብ በ app.js ውስጥ በ T.en እና T.am ስር ይገኛል። አዲስ ቋንቋ ለማከል (ለምሳሌ ኦሮምኛ) ተመሳሳይ የትርጉም ቁልፎች ያሉት T.om ቁልፍ ያክሉ። የቋንቋ ቁልፉ ከዚያ EN → አማ → OM ይሽከረከራል።',
      faq_q7: 'በማስቀመጥ መሃል ኢንተርኔት ከወደቀ ምን ይሆናል?', faq_a7: 'ማስቀመጡ አይሳካም እና ቀይ የስህተት ማሳወቂያ ያያሉ። ግንኙነቱ እንደገና ሲመለስ እንደገና እንዲሞክሩ ቅጹ ክፍት ሆኖ ይቆያል። ምንም ነገር በግማሽ አይቀመጥም — የ D1 ግብይቶች አቶማዊ ናቸው።',
      faq_q8: 'የፋይናንስ ሪፖርቶችን ማን ማየት ይችላል?', faq_a8: 'አስተዳዳሪዎች ብቻ። የፋይናንስ ሪፖርቶች ሞጁል ከተቀባዮችና ከእንግዶች ሙሉ በሙሉ ተደብቋል። በምርት ስርዓት ውስጥ ይህ በ API ደረጃም ይተገበራል።',

      ts_title: 'የተለመዱ ችግሮች', ts_sub: 'ለተደጋጋሚ ችግሮች ፈጣን መፍትሄዎች',
      ts_offline: 'ራስጌው "D1 Offline" ይላል', ts_offline_body: 'ምክንያት፡ የ Cloudflare Worker API ሊደረስበት አይችልም። መፍትሄ፡ የኢንተርኔት ግንኙነትዎን ያረጋግጡ። በራስጌ ውስጥ ያለውን የማደሻ ቁልፍ ለመጫን ይሞክሩ። ከቀጠለ API ለጊዜው ወድቆ ሊሆን ይችላል — ጥቂት ደቂቃዎች ይጠብቁና እንደገና ይሞክሩ።',
      ts_error: 'ከማስቀመጥ በኋላ ቀይ የስህተት ማሳወቂያ', ts_error_body: 'ምክንያት፡ ውሂብ ቤዙ ማስቀመጡን ውድቅ አድርጓል — አብዛኛውን ጊዜ ተደጋጋሚ እሴት (የክፍል ቁጥር፣ ኢሜይል) ወይም የጎደለ አስፈላጊ መስክ። መፍትሄ፡ በማሳወቂያው ውስጥ ያለውን የስህተት መልእክት ያንብቡ።',
      ts_mobile: 'በሞባይል ላይ የጎን አሞሌው አይከፈትም', ts_mobile_body: 'መፍትሄ፡ በራስጌ በላይኛው ግራ ጥግ ያለውን የምናሌ አዶ ይንኩ። አሁንም ካልተከፈተ ገጹን ያድሱ። በጣም ትንንሽ ስክሪኖች ላይ የጎን አሞሌው ከግራ በኩል እንደ ተደራቢ ሆኖ ይንሸራተታል — ለመዝጋት ከእሱ ውጪ ይንኩ።',
      ts_charts: 'ግራፎች ባዶ ናቸው', ts_charts_body: 'ምክንያት፡ አብዛኛውን ጊዜ የአሳሽ ችግር — Chart.js ከ CDN መጫን አልቻለም። መፍትሄ፡ ገጹን በግዳጅ ያድሱ (Ctrl+Shift+R)። ከቀጠለ ኔትወርክዎ cdn.jsdelivr.net ን እያገደ እንደሆነ ያረጋግጡ።',
      ts_403: '"D1 መስመር ላይ መሆን አለበት" መልእክት', ts_403_body: 'ምክንያት፡ መተግበሪያው ከመስመር ውጪ ሁኔታ ላይ ሳለ SQL ጥያቄ ለማሂድ ወይም ስኪማ ለማደስ ሞክረዋል። መፍትሄ፡ ወደ ኢንተርኔት እንደገና ይገናኙና ያድሱ።',
      ts_theme: 'ገጽታው አይቆይም', ts_theme_body: 'ምክንያት፡ አሳሽዎ localStorage ን እያገደ ሊሆን ይችላል (የግላዊ አሰሳ ሁኔታ ወይም ጥብቅ የኩኪ ቅንብሮች)። መፍትሄ፡ በአሳሽ ቅንብሮችዎ ውስጥ ለመተግበሪያው ጎራ የጣቢያ ውሂብ ይፍቀዱ፣ ወይም ከግላዊ አሰሳ ይውጡ።',

      contact_title: 'ድጋፍ ያግኙ', contact_sub: 'አሁንም ተጣብቀዋል? ያግኙን',
      contact_phone_label: 'የፊት ዴስክ ስልክ', contact_phone_desc: 'በ24/7 ይገኛል',
      contact_email_label: 'የድጋፍ ኢሜይል', contact_email_desc: 'በ24 ሰዓት ውስጥ ምላሽ',
      contact_address_label: 'አድራሻ', contact_address_desc: 'ያለ ቀጠሮ እንኳን ደህና መጡ',
      contact_hours_label: 'የመቀበያ ሰዓቶች', contact_hours_value: '24 ሰዓት · 7 ቀናት', contact_hours_desc: 'ሁልጊዜ ክፍት',
      contact_thanks: 'Asni Guest House ን ስለተጠቀሙ እናመሰግናለን።',
      contact_thanks_body: 'ይህ መመሪያ ስርዓቱን በተቻለ መጠን ለመጠቀም እንደሚረዳዎት ተስፋ እናደርጋለን። ከሶፍትዌሩ ጋር ለተያያዙ ቴክኒካዊ ችግሮች በቀጥታ ገንቢውን ያግኙ።',

      no_results_title: 'ተመሳሳይ ውጤቶች የሉም',
      no_results_body: 'ሌላ የፍለጋ ቃል ይሞክሩ ወይም የጎን አሞሌ ምድቦችን ያስሱ።'
    }
  };

  function t(key) {
    const v = (T[currentLang] && T[currentLang][key]);
    if (v !== undefined && v !== null) return v;
    if (T.en[key] !== undefined) return T.en[key];
    return key;
  }

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem(KEYS.lang, lang);
    document.documentElement.setAttribute('lang', lang === 'am' ? 'am' : 'en');
    document.body.classList.toggle('lang-am', lang === 'am');

    const label = document.getElementById('langLabel');
    if (label) label.textContent = lang === 'am' ? 'አማ' : 'EN';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = t(key);
      if (val) el.setAttribute('placeholder', val);
    });

    document.dispatchEvent(new CustomEvent('help:lang-changed', { detail: { lang } }));
  }

  H.I18n = {
    T, t, applyLang,
    get currentLang() { return currentLang; }
  };
})(window.Help);