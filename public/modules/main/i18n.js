/* ============================================================
   Asni Guest House — i18n module
   Owns the translation dictionary, the t() lookup, and
   applyLang() which walks the DOM and applies translations.
   Exposes: AsniApp.I18n
   ============================================================ */
window.AsniApp = window.AsniApp || {};

(function (App) {
  'use strict';

  const KEYS = App.Keys;

  /* ------------------------------------------------------------
     Dictionary — both languages
     ------------------------------------------------------------ */
  const T = {
    en: {
      // Header / shell
      app_title: 'Asni Guest House', app_chip: 'Jimma',
      app_location: 'Ferenj Arada, Jimma',
      connecting: 'Connecting…', online: 'Cloudflare D1 Online', offline: 'D1 Offline — Local Cache',
      refresh_title: 'Refresh data', theme_toggle: 'Toggle theme', lang_toggle: 'Change language',
      currency: 'Currency', nav_label: 'Menu',

      // Nav
      nav_dashboard: 'Dashboard', nav_rooms: 'Rooms', nav_users: 'Users & Staff',
      nav_bookings: 'Bookings', nav_restaurant: 'Restaurant', nav_tables: 'Restaurant Tables',
      nav_reports: 'Financial Reports', nav_banners: 'Ad Banners', nav_sql: 'D1 SQL Console',

      // Dashboard
      dash_kpi_revenue: 'Total Revenue', dash_kpi_revenue_sub: 'Rooms + Dining',
      dash_kpi_occupancy: 'Occupancy', dash_kpi_bookings: 'Active Bookings',
      dash_kpi_bookings_sub: 'Confirmed / Checked-In', dash_kpi_menu: 'Menu Items',
      dash_kpi_menu_sub: 'Available dishes',
      dash_revenue_chart: 'Revenue Trend (ETB)', dash_category_chart: 'Room Categories',
      dash_rooms_count: 'rooms', dash_no_banners: 'No active banners.',

      // Pages
      rooms_title: 'Rooms Inventory', rooms_sub: 'Manage room types, pricing, and availability.',
      users_title: 'Users & Staff', users_sub: 'Manage admins, receptionists, and guest accounts.',
      bookings_title: 'Bookings & Reservations', bookings_sub: 'Track check-ins, extensions, and cancellations.',
      restaurant_title: 'Restaurant & Menu', restaurant_sub: 'Manage dishes and live kitchen orders.',
      tables_title: 'Restaurant Tables', tables_sub: 'Manage indoor, garden, and rooftop seating.',
      reports_title: 'Financial Reports', reports_sub: 'Live totals computed from bookings and orders.',
      banners_title: 'Ad Banners', banners_sub: 'Promotional slides shown on the dashboard.',
      sql_title: 'Cloudflare D1 SQL Console', sql_sub: 'Run raw SQL against your live database.',

      // Buttons
      btn_add_room: 'Add Room', btn_add_user: 'Add User', btn_new_booking: 'New Booking',
      btn_add_dish: 'Add Dish', btn_cart: 'Cart', btn_add_table: 'Add Table',
      btn_create_banner: 'Create Banner', btn_export_csv: 'Export CSV', btn_reset_schema: 'Reset Schema',
      btn_reconnect: 'Reconnect', btn_test: 'Test', btn_run_query: 'Run Query',
      btn_cancel: 'Cancel', btn_close: 'Close', btn_print: 'Print',
      btn_clear: 'Clear', btn_submit_order: 'Submit Order',
      btn_save_room: 'Save Room', btn_save_user: 'Save User', btn_save_booking: 'Save Booking',
      btn_save_item: 'Save Menu Item', btn_save_table: 'Save Table',
      btn_save_order: 'Save Order', btn_save_banner: 'Save Banner',

      // Table headers
      th_room_num: 'Room #', th_type: 'Type', th_capacity: 'Capacity',
      th_price_night: 'Price / Night', th_status: 'Status', th_description: 'Description',
      th_actions: 'Actions', th_full_name: 'Full Name', th_email: 'Email', th_phone: 'Phone',
      th_role: 'Role', th_created: 'Created', th_id: 'ID', th_guest: 'Guest', th_room: 'Room',
      th_checkin: 'Check-In', th_checkout: 'Check-Out', th_total: 'Total', th_items: 'Items',
      th_target: 'Target', th_payer: 'Payer / Target', th_amount: 'Amount', th_receipt: 'Receipt',
      th_ref: 'Ref', th_date: 'Date', th_order_type: 'Type', th_table_num: 'Table #', th_zone: 'Zone',

      // Forms
      lbl_room_number: 'Room Number', lbl_capacity: 'Capacity', lbl_room_type: 'Room Type',
      lbl_price_night: 'Price / Night (ETB)', lbl_status: 'Status', lbl_description: 'Description',
      lbl_full_name: 'Full Name', lbl_email: 'Email', lbl_phone: 'Phone', lbl_role: 'Role',
      lbl_room: 'Room', lbl_guest_name: 'Guest Name', lbl_guest_phone: 'Guest Phone',
      lbl_checkin: 'Check-In', lbl_checkout: 'Check-Out', lbl_total: 'Total (ETB)',
      lbl_order_type: 'Order Type', lbl_target: 'Target', lbl_name: 'Name', lbl_category: 'Category',
      lbl_price: 'Price (ETB)', lbl_available: 'Available on menu', lbl_title: 'Title',
      lbl_tag: 'Tag', lbl_badge_color: 'Badge Color', lbl_active: 'Active (visible on dashboard)',
      lbl_worker_url: 'Worker API URL', lbl_execute_sql: 'Execute SQL', lbl_output: 'Output',
      lbl_table_num: 'Table #', lbl_zone: 'Zone',

      // Enum display
      status_Available: 'Available', status_Occupied: 'Occupied',
      status_Cleaning: 'Cleaning', status_Maintenance: 'Maintenance',
      status_Pending: 'Pending', status_Confirmed: 'Confirmed',
      status_CheckedIn: 'CheckedIn', status_CheckedOut: 'CheckedOut',
      status_Cancelled: 'Cancelled', status_Preparing: 'Preparing',
      status_Served: 'Served', status_Reserved: 'Reserved',
      status_Active: 'Active', status_Hidden: 'Hidden',

      rt_Standard: 'Standard', rt_Deluxe: 'Deluxe',
      rt_ExecutiveSuite: 'Executive Suite', rt_FamilySuite: 'Family Suite',

      role_admin: 'admin', role_receptionist: 'receptionist', role_guest: 'guest',

      cat_TraditionalEthiopian: 'Traditional Ethiopian', cat_Breakfast: 'Breakfast',
      cat_MainCourse: 'Main Course', cat_Beverages: 'Beverages', cat_Dessert: 'Dessert',

      zone_IndoorMain: 'Indoor Main', zone_GardenPatio: 'Garden Patio', zone_RooftopLounge: 'Rooftop Lounge',

      ot_RoomService: 'Room Service', ot_RestaurantTable: 'Restaurant Table',

      color_amber: 'Amber', color_blue: 'Blue', color_emerald: 'Emerald',
      color_purple: 'Purple', color_rose: 'Rose',

      room_grid_title: 'Live Room Status Grid',
      menu_catalog_title: 'Menu Catalog', orders_queue_title: 'Kitchen Orders Queue',
      schema_explorer: 'Schema Explorer',

      rep_room_rev: 'Room Revenue', rep_rest_rev: 'Restaurant Revenue', rep_total: 'Grand Total',

      cart_total: 'Order Total:', cart_empty: 'Cart is empty. Add items from the menu.',

      rcpt_number: 'Receipt #', rcpt_date: 'Date:', rcpt_payer: 'Payer:', rcpt_type: 'Type:',
      rcpt_details: 'Details', rcpt_total_paid: 'Total Paid:',
      rcpt_thanks: 'Thank you! Ameseginalehu!', rcpt_completed: 'Completed',

      modal_room_new: 'New Room', modal_room_edit: 'Edit Room',
      modal_user_new: 'New User', modal_user_edit: 'Edit User',
      modal_booking_new: 'New Booking', modal_booking_edit: 'Edit Booking',
      modal_menu_new: 'New Menu Item', modal_menu_edit: 'Edit Menu Item',
      modal_table_new: 'New Table', modal_table_edit: 'Edit Table',
      modal_cart_title: 'New Order', modal_order_edit: 'Edit Order',
      modal_banner_new: 'New Banner', modal_banner_edit: 'Edit Banner',
      modal_edit_generic: 'Edit',

      toast_connected: 'Connected to Cloudflare D1',
      toast_offline: 'D1 offline — using local cache',
      toast_refresh_start: 'Refreshing…', toast_refresh_done: 'Data refreshed.',
      toast_room_added: 'Added Room', toast_room_updated: 'Updated Room',
      toast_room_deleted: 'Room deleted.',
      toast_user_added: 'Added', toast_user_updated: 'Updated',
      toast_user_deleted: 'User removed.',
      toast_booking_added: 'New booking created.', toast_booking_updated: 'Booking updated.',
      toast_booking_deleted: 'Booking deleted.',
      toast_menu_added: 'Added', toast_menu_updated: 'Updated',
      toast_menu_deleted: 'Menu item removed.',
      toast_table_added: 'Added', toast_table_updated: 'Updated',
      toast_table_deleted: 'Table removed.',
      toast_order_submitted: 'Order placed for', toast_order_updated: 'Order updated.',
      toast_order_deleted: 'Order deleted.',
      toast_banner_added: 'Banner created.', toast_banner_updated: 'Banner updated.',
      toast_banner_deleted: 'Banner removed.',
      toast_cart_added: 'Added to cart.', toast_cart_empty: 'Cart is empty!',
      toast_reset_done: 'Schema reset. All data cleared.',
      toast_exported: 'Exported CSV report.',
      toast_role_switched: 'Switched to', toast_theme_switched: 'Theme switched to',
      toast_lang_switched: 'Language switched to',
      toast_d1_required: 'D1 must be online for this action.',
      toast_worker_online: 'Worker online.', toast_worker_failed: 'Worker test failed',
      toast_confirm_delete: 'Delete this record?',
      toast_confirm_delete_room: 'Delete this room? Related bookings will be removed.',
      toast_confirm_delete_user: 'Delete this user?',
      toast_confirm_delete_booking: 'Delete this booking?',
      toast_confirm_delete_item: 'Remove this menu item?',
      toast_confirm_delete_table: 'Delete this table?',
      toast_confirm_delete_order: 'Delete this order?',
      toast_confirm_delete_banner: 'Delete this banner?',
      toast_confirm_reset: 'WIPE all tables and re-create schema? Data will be lost.',

      misc_select_target: 'Select a target!', misc_enter_url: 'Enter a valid URL',
      misc_no_banners: 'No active banners.', misc_enter_sql: 'Enter a SQL query first.',
      misc_offline_sql: 'D1 is offline — SQL console requires an active connection.',
      misc_total: 'Total', misc_seats: 'seats'
    },
    am: {
      app_title: 'አስኒ የእንግዳ ማረፊያ', app_chip: 'ጅማ',
      app_location: 'ፈረንጅ አራዳ፣ ጅማ',
      connecting: 'በመገናኘት ላይ…', online: 'Cloudflare D1 ተገናኝቷል', offline: 'D1 ከመስመር ውጪ — የአካባቢ ቅዳ',
      refresh_title: 'ውሂብ አድስ', theme_toggle: 'ገጽታ ቀይር', lang_toggle: 'ቋንቋ ቀይር',
      currency: 'ምንዛሪ', nav_label: 'ዝርዝር',

      nav_dashboard: 'ዳሽቦርድ', nav_rooms: 'ክፍሎች', nav_users: 'ተጠቃሚዎችና ሰራተኞች',
      nav_bookings: 'ቦታ ማስያዝ', nav_restaurant: 'ምግብ ቤት', nav_tables: 'የምግብ ቤት ጠረጴዛዎች',
      nav_reports: 'የፋይናንስ ሪፖርቶች', nav_banners: 'ማስታወቂያዎች', nav_sql: 'D1 SQL ኮንሶል',

      dash_kpi_revenue: 'ጠቅላላ ገቢ', dash_kpi_revenue_sub: 'ክፍል + ምግብ',
      dash_kpi_occupancy: 'የተያዘ መጠን', dash_kpi_bookings: 'ንቁ ቦታ ማስያዞች',
      dash_kpi_bookings_sub: 'የተረጋገጡ / የገቡ', dash_kpi_menu: 'የምናሌ ዕቃዎች',
      dash_kpi_menu_sub: 'ያሉ ምግቦች',
      dash_revenue_chart: 'የገቢ አዝማሚያ (ብር)', dash_category_chart: 'የክፍል ምድቦች',
      dash_rooms_count: 'ክፍሎች', dash_no_banners: 'ንቁ ማስታወቂያ የለም።',

      rooms_title: 'የክፍሎች ክምችት', rooms_sub: 'የክፍል ዓይነቶችን፣ ዋጋና ተገኝነትን ያስተዳድሩ።',
      users_title: 'ተጠቃሚዎችና ሰራተኞች', users_sub: 'አስተዳዳሪዎችን፣ ተቀባዮችንና የእንግዳ መዝገቦችን ያስተዳድሩ።',
      bookings_title: 'ቦታ ማስያዝና ቦታ ማስያዝ', bookings_sub: 'መግቢያዎችን፣ ቅርንጫፎችንና ስረዛዎችን ይከታተሉ።',
      restaurant_title: 'ምግብ ቤትና ምናሌ', restaurant_sub: 'ምግቦችንና የወቅቱን የወጥ ቤት ትዕዛዞች ያስተዳድሩ።',
      tables_title: 'የምግብ ቤት ጠረጴዛዎች', tables_sub: 'የውስጥ፣ የአትክልት ቦታና የጣሪያ መቀመጫዎችን ያስተዳድሩ።',
      reports_title: 'የፋይናንስ ሪፖርቶች', reports_sub: 'ከቦታ ማስያዝና ከትዕዛዞች የተሰሉ የቀጥታ ድምሮች።',
      banners_title: 'ማስታወቂያዎች', banners_sub: 'በዳሽቦርድ ላይ የሚታዩ የማስተዋወቂያ ስላይዶች።',
      sql_title: 'Cloudflare D1 SQL ኮንሶል', sql_sub: 'በቀጥታ ላይ ባለው ዳታቤዝ ላይ SQL ያሂዱ።',

      btn_add_room: 'ክፍል ጨምር', btn_add_user: 'ተጠቃሚ ጨምር', btn_new_booking: 'አዲስ ቦታ ማስያዝ',
      btn_add_dish: 'ምግብ ጨምር', btn_cart: 'ጋሪ', btn_add_table: 'ጠረጴዛ ጨምር',
      btn_create_banner: 'ማስታወቂያ ፍጠር', btn_export_csv: 'CSV አውጣ', btn_reset_schema: 'ስኪማ አድስ',
      btn_reconnect: 'እንደገና አገናኝ', btn_test: 'ፈትን', btn_run_query: 'ጥያቄ አሂድ',
      btn_cancel: 'ሰርዝ', btn_close: 'ዝጋ', btn_print: 'አትም',
      btn_clear: 'አጽዳ', btn_submit_order: 'ትዕዛዝ አስገባ',
      btn_save_room: 'ክፍል አስቀምጥ', btn_save_user: 'ተጠቃሚ አስቀምጥ', btn_save_booking: 'ቦታ ማስያዝ አስቀምጥ',
      btn_save_item: 'ምግብ አስቀምጥ', btn_save_table: 'ጠረጴዛ አስቀምጥ',
      btn_save_order: 'ትዕዛዝ አስቀምጥ', btn_save_banner: 'ማስታወቂያ አስቀምጥ',

      th_room_num: 'የክፍል ቁጥር', th_type: 'ዓይነት', th_capacity: 'አቅም',
      th_price_night: 'ዋጋ / ሌሊት', th_status: 'ሁኔታ', th_description: 'መግለጫ',
      th_actions: 'ተግባራት', th_full_name: 'ሙሉ ስም', th_email: 'ኢሜይል', th_phone: 'ስልክ',
      th_role: 'ሚና', th_created: 'የተፈጠረ', th_id: 'መለያ', th_guest: 'እንግዳ', th_room: 'ክፍል',
      th_checkin: 'የገባበት', th_checkout: 'የወጣበት', th_total: 'ጠቅላላ', th_items: 'ዕቃዎች',
      th_target: 'ዒላማ', th_payer: 'ከፋይ / ዒላማ', th_amount: 'መጠን', th_receipt: 'ደረሰኝ',
      th_ref: 'ማጣቀሻ', th_date: 'ቀን', th_order_type: 'ዓይነት', th_table_num: 'የጠረጴዛ ቁጥር', th_zone: 'አካባቢ',

      lbl_room_number: 'የክፍል ቁጥር', lbl_capacity: 'አቅም', lbl_room_type: 'የክፍል ዓይነት',
      lbl_price_night: 'ዋጋ / ሌሊት (ብር)', lbl_status: 'ሁኔታ', lbl_description: 'መግለጫ',
      lbl_full_name: 'ሙሉ ስም', lbl_email: 'ኢሜይል', lbl_phone: 'ስልክ', lbl_role: 'ሚና',
      lbl_room: 'ክፍል', lbl_guest_name: 'የእንግዳ ስም', lbl_guest_phone: 'የእንግዳ ስልክ',
      lbl_checkin: 'የገባበት ቀን', lbl_checkout: 'የወጣበት ቀን', lbl_total: 'ጠቅላላ (ብር)',
      lbl_order_type: 'የትዕዛዝ ዓይነት', lbl_target: 'ዒላማ', lbl_name: 'ስም', lbl_category: 'ምድብ',
      lbl_price: 'ዋጋ (ብር)', lbl_available: 'በምናሌ ላይ አለ', lbl_title: 'ርዕስ',
      lbl_tag: 'መለያ', lbl_badge_color: 'የባጅ ቀለም', lbl_active: 'ንቁ (በዳሽቦርድ ይታያል)',
      lbl_worker_url: 'የሰራተኛ API አድራሻ', lbl_execute_sql: 'SQL አሂድ', lbl_output: 'ውጤት',
      lbl_table_num: 'የጠረጴዛ ቁጥር', lbl_zone: 'አካባቢ',

      status_Available: 'ነፃ', status_Occupied: 'ተይዟል',
      status_Cleaning: 'በጽዳት ላይ', status_Maintenance: 'ጥገና',
      status_Pending: 'በመጠባበቅ ላይ', status_Confirmed: 'ተረጋግጧል',
      status_CheckedIn: 'ገብቷል', status_CheckedOut: 'ወጥቷል',
      status_Cancelled: 'ተሰርዟል', status_Preparing: 'በዝግጅት ላይ',
      status_Served: 'ቀርቧል', status_Reserved: 'ተይዟል',
      status_Active: 'ንቁ', status_Hidden: 'ተደብቋል',

      rt_Standard: 'መደበኛ', rt_Deluxe: 'ዴሉክስ',
      rt_ExecutiveSuite: 'ኤግዘኪዩቲቭ ስዊት', rt_FamilySuite: 'ፋሚሊ ስዊት',

      role_admin: 'አስተዳዳሪ', role_receptionist: 'ተቀባይ', role_guest: 'እንግዳ',

      cat_TraditionalEthiopian: 'ባህላዊ ኢትዮጵያዊ', cat_Breakfast: 'ቁርስ',
      cat_MainCourse: 'ዋና ምግብ', cat_Beverages: 'መጠጦች', cat_Dessert: 'ጣፋጭ',

      zone_IndoorMain: 'ውስጣዊ ዋና', zone_GardenPatio: 'የአትክልት ቦታ', zone_RooftopLounge: 'የጣሪያ ማረፊያ',

      ot_RoomService: 'የክፍል አገልግሎት', ot_RestaurantTable: 'የምግብ ቤት ጠረጴዛ',

      color_amber: 'ወርቃማ', color_blue: 'ሰማያዊ', color_emerald: 'አረንጓዴ',
      color_purple: 'ወይን ጠጅ', color_rose: 'ሮዝ',

      room_grid_title: 'የክፍሎች ሁኔታ ፍርግርግ',
      menu_catalog_title: 'የምናሌ ካታሎግ', orders_queue_title: 'የወጥ ቤት ትዕዛዞች ወረፋ',
      schema_explorer: 'የስኪማ አሳሽ',

      rep_room_rev: 'የክፍል ገቢ', rep_rest_rev: 'የምግብ ቤት ገቢ', rep_total: 'ጠቅላላ ድምር',

      cart_total: 'የትዕዛዝ ጠቅላላ:', cart_empty: 'ጋሪ ባዶ ነው። ከምናሌ ዕቃዎችን ይጨምሩ።',

      rcpt_number: 'ደረሰኝ ቁጥር', rcpt_date: 'ቀን:', rcpt_payer: 'ከፋይ:', rcpt_type: 'ዓይነት:',
      rcpt_details: 'ዝርዝሮች', rcpt_total_paid: 'የተከፈለ ጠቅላላ:',
      rcpt_thanks: 'አመሰግናለሁ!', rcpt_completed: 'ተጠናቅቋል',

      modal_room_new: 'አዲስ ክፍል', modal_room_edit: 'ክፍል አስተካክል',
      modal_user_new: 'አዲስ ተጠቃሚ', modal_user_edit: 'ተጠቃሚ አስተካክል',
      modal_booking_new: 'አዲስ ቦታ ማስያዝ', modal_booking_edit: 'ቦታ ማስያዝ አስተካክል',
      modal_menu_new: 'አዲስ የምናሌ ዕቃ', modal_menu_edit: 'የምናሌ ዕቃ አስተካክል',
      modal_table_new: 'አዲስ ጠረጴዛ', modal_table_edit: 'ጠረጴዛ አስተካክል',
      modal_cart_title: 'አዲስ ትዕዛዝ', modal_order_edit: 'ትዕዛዝ አስተካክል',
      modal_banner_new: 'አዲስ ማስታወቂያ', modal_banner_edit: 'ማስታወቂያ አስተካክል',
      modal_edit_generic: 'አስተካክል',

      toast_connected: 'ከ Cloudflare D1 ጋር ተገናኝቷል',
      toast_offline: 'D1 ከመስመር ውጪ — የአካባቢ ቅዳ በመጠቀም ላይ',
      toast_refresh_start: 'በማደስ ላይ…', toast_refresh_done: 'ውሂብ ተጠናቅቋል።',
      toast_room_added: 'ተጨምሯል፡ ክፍል', toast_room_updated: 'ተሻሽሏል፡ ክፍል',
      toast_room_deleted: 'ክፍል ተሰርዟል።',
      toast_user_added: 'ተጨምሯል', toast_user_updated: 'ተሻሽሏል',
      toast_user_deleted: 'ተጠቃሚ ተወግዷል።',
      toast_booking_added: 'አዲስ ቦታ ማስያዝ ተፈጥሯል።', toast_booking_updated: 'ቦታ ማስያዝ ተሻሽሏል።',
      toast_booking_deleted: 'ቦታ ማስያዝ ተሰርዟል።',
      toast_menu_added: 'ተጨምሯል', toast_menu_updated: 'ተሻሽሏል',
      toast_menu_deleted: 'የምናሌ ዕቃ ተወግዷል።',
      toast_table_added: 'ተጨምሯል', toast_table_updated: 'ተሻሽሏል',
      toast_table_deleted: 'ጠረጴዛ ተወግዷል።',
      toast_order_submitted: 'ትዕዛዝ ተልኳል ለ', toast_order_updated: 'ትዕዛዝ ተሻሽሏል።',
      toast_order_deleted: 'ትዕዛዝ ተሰርዟል።',
      toast_banner_added: 'ማስታወቂያ ተፈጥሯል።', toast_banner_updated: 'ማስታወቂያ ተሻሽሏል።',
      toast_banner_deleted: 'ማስታወቂያ ተወግዷል።',
      toast_cart_added: 'ወደ ጋሪ ተጨምሯል።', toast_cart_empty: 'ጋሪ ባዶ ነው!',
      toast_reset_done: 'ስኪማ ተመልሷል። ሁሉም ውሂብ ጠፍቷል።',
      toast_exported: 'CSV ሪፖርት ተልኳል።',
      toast_role_switched: 'ተቀይሯል ወደ', toast_theme_switched: 'ገጽታ ተቀይሯል ወደ',
      toast_lang_switched: 'ቋንቋ ተቀይሯል ወደ',
      toast_d1_required: 'D1 መስመር ላይ መሆን አለበት።',
      toast_worker_online: 'ሰራተኛ በመስመር ላይ ነው።', toast_worker_failed: 'የሰራተኛ ፈተና አልተሳካም',
      toast_confirm_delete: 'ይህን መዝገብ ይሰርዙ?',
      toast_confirm_delete_room: 'ይህን ክፍል ይሰርዙ? ተዛማጅ ቦታ ማስያዞች ይወገዳሉ።',
      toast_confirm_delete_user: 'ይህን ተጠቃሚ ይሰርዙ?',
      toast_confirm_delete_booking: 'ይህን ቦታ ማስያዝ ይሰርዙ?',
      toast_confirm_delete_item: 'ይህን የምናሌ ዕቃ ያስወግዱ?',
      toast_confirm_delete_table: 'ይህን ጠረጴዛ ይሰርዙ?',
      toast_confirm_delete_order: 'ይህን ትዕዛዝ ይሰርዙ?',
      toast_confirm_delete_banner: 'ይህን ማስታወቂያ ይሰርዙ?',
      toast_confirm_reset: 'ሁሉንም ሰንጠረዦች አጥፍተው እንደገና ይፍጠሩ? ውሂብ ይጠፋል።',

      misc_select_target: 'ዒላማ ይምረጡ!', misc_enter_url: 'ትክክለኛ አድራሻ ያስገቡ',
      misc_no_banners: 'ንቁ ማስታወቂያ የለም።', misc_enter_sql: 'መጀመሪያ SQL ጥያቄ ያስገቡ።',
      misc_offline_sql: 'D1 ከመስመር ውጪ ነው — የ SQL ኮንሶል ንቁ ግንኙነት ይፈልጋል።',
      misc_total: 'ጠቅላላ', misc_seats: 'መቀመጫ'
    }
  };

  /* ------------------------------------------------------------
     Banner localisation — keyed by English title from D1
     ------------------------------------------------------------ */
  const BANNER_I18N = {
    en: {
      'Jimma Coffee Tour': {
        title: 'Jimma Coffee Tour',
        description: 'Explore authentic coffee farms around Jimma. Book guided tours at reception.',
        tag: 'Special Experience'
      },
      'Aba Jifar Palace Excursion': {
        title: 'Aba Jifar Palace Excursion',
        description: 'Visit the historic King Aba Jifar II Palace located near Ferenj Arada.',
        tag: 'Cultural Heritage'
      },
      'Free Airport Shuttle': {
        title: 'Free Airport Shuttle',
        description: 'Complimentary shuttle service to and from Jimma Airport (JIM) for Executive guests.',
        tag: 'Guest Perk'
      }
    },
    am: {
      'Jimma Coffee Tour': {
        title: 'የጅማ ቡና ጉብኝት',
        description: 'በጅማ ዙሪያ ያሉ እውነተኛ የቡና እርሻዎችን ያስሱ። በመቀበያ ቦታ የተመራ ጉብኝት ያስይዙ።',
        tag: 'ልዩ ተሞክሮ'
      },
      'Aba Jifar Palace Excursion': {
        title: 'የአባ ጅፋር ቤተ መንግስት ጉዞ',
        description: 'በፈረንጅ አራዳ አቅራቢያ የሚገኘውን ታሪካዊውን የንጉስ አባ ጅፋር ዳግማዊ ቤተ መንግስት ይጎብኙ።',
        tag: 'የባህል ቅርስ'
      },
      'Free Airport Shuttle': {
        title: 'ነፃ የአውሮፕላን ማስተላለፊያ',
        description: 'ለኤግዘኪዩቲቭ እንግዶች ከጅማ አውሮፕላን ማረፊያ (JIM) ና ወደ እሱ ነፃ የማስተላለፊያ አገልግሎት።',
        tag: 'የእንግዳ ጥቅም'
      }
    }
  };

  /* ------------------------------------------------------------
     Public API
     ------------------------------------------------------------ */
  let currentLang = localStorage.getItem(KEYS.lang) || 'am';

  function t(key) {
    const v = (T[currentLang] && T[currentLang][key]);
    if (v !== undefined && v !== null) return v;
    if (T.en[key] !== undefined) return T.en[key];
    return key;
  }

  function getBannerTranslation(lang, englishTitle) {
    const map = BANNER_I18N[lang] || {};
    return map[englishTitle] || null;
  }

  function applyLang(lang, silent) {
    currentLang = lang;
    localStorage.setItem(KEYS.lang, lang);
    document.documentElement.setAttribute('lang', lang === 'am' ? 'am' : 'en');
    document.body.classList.toggle('lang-am', lang === 'am');

    const label = document.getElementById('langLabel');
    if (label) label.textContent = lang === 'am' ? 'አማ' : 'EN';

    // Static elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = t(key);
      if (val) el.setAttribute('title', val);
    });

    // Let other modules know so they can re-render
    document.dispatchEvent(new CustomEvent('asni:lang-changed', { detail: { lang } }));

    if (!silent) {
      App.Toast.show(`${t('toast_lang_switched')} ${lang === 'am' ? 'አማርኛ' : 'English'}`);
    }
  }

  App.I18n = {
    T,
    t,
    applyLang,
    getBannerTranslation,
    get currentLang() { return currentLang; }
  };
})(window.AsniApp);