-- ==============================================================================
-- IK ELECTRONICS - SEED DATA
-- Run AFTER 20261010000000_init_ecommerce_schema.sql
-- Idempotent: safe to run more than once.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------------------------
insert into public.categories (name, slug, description) values
    ('Televisions', 'televisions', 'Smart TVs, LED, 4K, and display solutions for homes and offices.'),
    ('Kitchen Appliances', 'kitchen-appliances', 'Blenders, juicers, and everyday kitchen machines.'),
    ('Home Entertainment', 'home-entertainment', 'Home theaters, speakers, and audio systems.'),
    ('Gadgets & Accessories', 'gadgets-accessories', 'Phone accessories, audio gadgets, and everyday tech.'),
    ('Office Equipment', 'office-equipment', 'Printers, docking stations, and business essentials.')
on conflict (slug) do nothing;

-- ------------------------------------------------------------------------------
-- PRODUCTS
-- ------------------------------------------------------------------------------
insert into public.products (
    category_id, name, slug, description, price, compare_at_price, cost_price,
    sku, track_quantity, stock_quantity, low_stock_threshold,
    images, specs, tags, is_featured, is_published
)
select
    c.id, v.name, v.slug, v.description, v.price, v.compare_at_price, v.cost_price,
    v.sku, true, v.stock_quantity, 5,
    array[]::text[],
    v.specs::jsonb, v.tags, v.is_featured, true
from (values
    ('Televisions', 'Hisense 55" 4K UHD Smart TV', 'hisense-55-4k-uhd-smart-tv', 'Crisp 4K UHD smart TV with built-in apps, voice control, and multiple HDMI inputs.', 485000, 550000, 410000, 'IK-TV-55-4K', 12, '{"Screen Size":"55 inches","Resolution":"4K UHD","Smart OS":"VIDAA"}', array['tv','4k','hisense'], true),
    ('Televisions', 'Hisense 43" FHD Smart TV', 'hisense-43-fhd-smart-tv', 'Affordable Full HD smart TV, ideal for bedrooms and compact living rooms.', 265000, 295000, 220000, 'IK-TV-43-FHD', 18, '{"Screen Size":"43 inches","Resolution":"Full HD","Smart OS":"VIDAA"}', array['tv','full-hd','hisense'], false),
    ('Televisions', 'Samsung 65" Crystal UHD 4K Smart TV', 'samsung-65-crystal-uhd-4k-smart-tv', 'Large-format Crystal UHD display with vibrant colour and smart hub experience.', 890000, 980000, 760000, 'IK-TV-65-CRYSTAL', 6, '{"Brand":"Samsung","Screen Size":"65 inches","Resolution":"4K UHD"}', array['tv','4k','samsung'], true),
    ('Kitchen Appliances', '2-in-1 Standing Blender & Grinder', 'standing-blender-grinder', 'Powerful standing blender with grinding mill for pepper, spices, and smoothies.', 78500, 92000, 61000, 'IK-KA-BLENDER-2IN1', 25, '{"Power":"1000W","Capacity":"1.5L","Jars":"2"}', array['blender','kitchen','appliance'], true),
    ('Kitchen Appliances', 'Electric Citrus Juicer', 'electric-citrus-juicer', 'Quick electric juicer for oranges, lemons, and citrus fruits.', 42500, 50000, 32000, 'IK-KA-JUICER', 20, '{"Power":"40W","Type":"Citrus"}', array['juicer','kitchen'], false),
    ('Home Entertainment', '5.1 Channel Home Theater System', '5-1-home-theater-system', 'Immersive 5.1 surround sound system with subwoofer and Bluetooth playback.', 320000, 365000, 265000, 'IK-HE-HT51', 8, '{"Channels":"5.1","Power":"300W","Connectivity":"Bluetooth, HDMI, USB"}', array['home-theater','audio','5.1'], true),
    ('Home Entertainment', 'Portable Bluetooth Party Speaker', 'portable-bluetooth-party-speaker', 'Loud rechargeable speaker with deep bass, ideal for events and gatherings.', 96000, 115000, 74000, 'IK-HE-SPK-PARTY', 15, '{"Power":"80W","Battery":"Rechargeable","Connectivity":"Bluetooth, AUX"}', array['speaker','bluetooth','party'], false),
    ('Gadgets & Accessories', 'Wireless Noise-Cancelling Earbuds', 'wireless-noise-cancelling-earbuds', 'Bluetooth earbuds with active noise cancellation and long battery life.', 34500, 42000, 24000, 'IK-GA-EARBUD-ANC', 40, '{"Type":"In-ear","ANC":"Yes","Battery":"24h with case"}', array['earbuds','audio','gadget'], true),
    ('Gadgets & Accessories', '20000mAh Fast-Charge Power Bank', '20000mah-fast-charge-power-bank', 'High-capacity power bank with fast charging for phones and tablets.', 28000, 34000, 19000, 'IK-GA-PB-20000', 50, '{"Capacity":"20000mAh","Ports":"USB-C, USB-A","Fast Charge":"Yes"}', array['power-bank','gadget','charging'], false),
    ('Office Equipment', 'USB-C 8-in-1 Docking Station', 'usb-c-8-in-1-docking-station', 'Expand a laptop with HDMI, USB, card reader, ethernet, and charging ports.', 54000, 65000, 40000, 'IK-OE-DOCK-8IN1', 22, '{"Ports":"8","HDMI":"4K 60Hz","Ethernet":"Gigabit"}', array['dock','usb-c','office'], false),
    ('Office Equipment', 'All-in-One Office Printer', 'all-in-one-office-printer', 'Print, scan, and copy with wireless connectivity for home offices.', 210000, 240000, 172000, 'IK-OE-PRINTER-AIO', 10, '{"Type":"All-in-One","Connectivity":"WiFi, USB","Functions":"Print, Scan, Copy"}', array['printer','office','wireless'], false)
) as v(category_name, name, slug, description, price, compare_at_price, cost_price, sku, stock_quantity, specs, tags, is_featured)
join public.categories c on c.name = v.category_name
on conflict (slug) do nothing;

-- ------------------------------------------------------------------------------
-- ADMIN BOOTSTRAP
-- 1. Sign in once with Google at /login so a row is created in auth.users
--    and public.profiles.
-- 2. Replace the email below and run this line to grant admin access.
-- ------------------------------------------------------------------------------
-- update public.profiles set is_admin = true where email = 'YOUR_EMAIL_HERE';
