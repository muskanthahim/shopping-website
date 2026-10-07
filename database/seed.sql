-- Seed Data for Muskan The Label

USE muskan_the_label;

-- 1. Insert Categories
INSERT INTO categories (id, name, slug) VALUES
(1, 'Lawn', 'lawn'),
(2, 'Festive Wear', 'festive-wear'),
(3, 'Kurta Sets', 'kurta-sets'),
(4, 'Velvet', 'velvet'),
(5, 'Essentials', 'essentials'),
(6, 'Luxury Pret', 'luxury-pret'),
(7, 'Casual Wear', 'casual-wear')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Collections
INSERT INTO collections (id, name, description, image) VALUES
(1, "Autumn Edit '26", "A collection inspired by warm evenings, timeless silhouettes and understated elegance.", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"),
(2, 'Royal Silk', 'Regal silhouettes crafted from lustrous raw silks and organza.', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop'),
(3, 'Modern Heritage', 'Artisanal embroideries reimagined for contemporary celebrations.', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop'),
(4, 'Daily Luxe', 'Effortless high-thread lawn and linen ensembles tailored for daily refinement.', 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000&auto=format&fit=crop')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Insert Sample User (Password: "password123", bcrypt hash: "$2b$10$wT8m9sH5nQ1uG7/X.8rB9eM4mR5Y1Y7/X.8rB9eM4mR5Y1Y7/X.8r")
INSERT INTO users (id, name, email, password, phone) VALUES
(1, 'Ayesha Khan', 'customer@muskanthelabel.com', '$2b$10$eD5vjV8Lq6U/Z5k1v0h0e.qO7rB9eM4mR5Y1Y7/X.8rB9eM4mR5Y1', '+92 300 1234567')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Insert 20 Products
INSERT INTO products (id, name, slug, description, price, sale_price, category_id, collection_id, fabric, rating, review_count, stock_quantity, is_new, is_best_seller) VALUES
(1, 'Ivory Bloom Set', 'ivory-bloom-set', 'An effortless 3-piece lawn suit adorned with delicate floral needlework along the neckline, paired with straight cotton trousers and a lightweight silk-chiffon dupatta.', 5499.00, 4899.00, 1, 1, 'Premium Swiss Lawn with Silk Chiffon Dupatta', 4.90, 28, 45, 1, 1),
(2, 'Noir Garden', 'noir-garden', 'Deep charcoal jet-black cambric shirt featuring gold tilla embroidery on the sleeves, accompanied by wide-leg culottes and a contrasting zari organza dupatta.', 7999.00, NULL, 2, 2, 'Luxury Pure Cambric & Zari Organza', 5.00, 42, 30, 1, 1),
(3, 'Rose Dusk', 'rose-dusk', 'Subtle muted dusty rose shirt crafted from hand-woven slub cotton with tonal threadwork, finished with lace-trimmed trousers.', 6499.00, 5799.00, 7, 4, 'Hand-woven Slub Cotton & Pure Cotton Trousers', 4.80, 19, 50, 0, 0),
(4, 'Pearl Garden', 'pearl-garden', 'Opulent off-white raw silk ensemble adorned with intricate mirror motif work, hand-embellished pearl tassels, and a diaphanous organza veil.', 9999.00, NULL, 2, 3, 'Raw Silk & Organza Veil with Pearl Accents', 4.90, 35, 25, 1, 1),
(5, 'Midnight Muse', 'midnight-muse', 'Plush micro-velvet tunic in deep sapphire navy featuring vintage marori stitching on cuffs and hem line.', 8499.00, 7999.00, 4, 1, 'Micro Velvet with Silk Viscose Lining', 4.70, 14, 40, 1, 0),
(6, 'Zaria Emerald Kurta', 'zaria-emerald-kurta', 'Contemporary straight-cut jewel emerald linen-silk shirt with boat neck styling and organza pleated border.', 6899.00, NULL, 3, 4, 'Linen Silk Blend', 4.80, 22, 35, 0, 1),
(7, 'Safina Printed Lawn 3-Piece', 'safina-printed-lawn-3-piece', 'Bohemian geometric prints inspired by Mughal architecture printed on breathable high-thread lawn fabric.', 5999.00, 5299.00, 1, 4, 'High-Count Swiss Lawn', 4.60, 17, 60, 0, 0),
(8, 'Amber Gold Silk Suit', 'amber-gold-silk-suit', 'Regal warm golden raw silk jacket style shirt paired with tulip trousers and hand-embellished sequins dupatta.', 14500.00, NULL, 2, 2, 'Raw Silk & Hand-Embellished Net', 5.00, 53, 20, 1, 1),
(9, 'Dust Rose Chiffon Suit', 'dust-rose-chiffon-suit', 'Graceful relaxed silhouette in dusty rose chiffon with fine cotton lining and flared scalloped hem.', 8999.00, 7999.00, 3, 1, 'Pure Chiffon & Soft Cotton Lining', 4.90, 26, 30, 1, 0),
(10, 'Crimson Heritage Velvet Anarkali', 'crimson-heritage-velvet-anarkali', 'Floor-length deep garnet velvet Anarkali with artisanal zardozi embroidery across bodice and hemline.', 18999.00, NULL, 4, 3, 'Micro Velvet & Embroidered Organza', 5.00, 61, 15, 0, 1),
(11, 'Cypress Organza Ensemble', 'cypress-organza-ensemble', 'Ethereal cypress green sheer organza tunic styled over a coordinating silk camisole and sleek trousers.', 11499.00, 10299.00, 2, 2, 'Sheer Organza & Raw Silk Under-slip', 4.70, 18, 25, 1, 0),
(12, 'Sahara Taupe Linen Set', 'sahara-taupe-linen-set', 'Minimalist taupe linen 2-piece set featuring high mandarin collar, mother-of-pearl buttons, and wide trousers.', 4999.00, NULL, 5, 4, '100% Breathable Pure Linen', 4.80, 31, 55, 0, 1),
(13, 'Moonlit Silver Raw Silk Set', 'moonlit-silver-raw-silk-set', 'Luminous silver-grey raw silk short tunic with metallic thread wire-work and silver embroidered pallu dupatta.', 13999.00, 12499.00, 2, 2, 'Raw Silk & Metallic Thread Work', 4.90, 29, 22, 1, 0),
(14, 'Blossom Chanderi Kurta', 'blossom-chanderi-kurta', 'Classic A-line Chanderi silk kurta featuring fine chikankari inspired embroidery across the front panel.', 7299.00, NULL, 3, 4, 'Chanderi Silk Blend', 4.70, 15, 40, 0, 0),
(15, 'Olive Grove Lawn 3-Piece', 'olive-grove-lawn-3-piece', 'Modern botanical digital print on high-density lawn fabric with a embroidered organza patch neckline.', 5799.00, 4999.00, 1, 1, 'Digital Print Swiss Lawn', 4.80, 24, 45, 1, 1),
(16, 'Saffron Velvet Pheroza', 'saffron-velvet-pheroza', 'Luxe deep saffron mustard velvet kaftan with heavy dabka hand work along V-neckline and sleeve borders.', 16499.00, NULL, 4, 3, 'Rich Silk Velvet', 5.00, 38, 18, 0, 1),
(17, 'Nude Taupe Cashmere Suit', 'nude-taupe-cashmere-suit', 'Ultra-soft woven wool-blend winter suit with embroidered shawl pallu designed for cozy elegance.', 12999.00, 11499.00, 5, 1, 'Wool Blend Cashmere Touch', 4.90, 21, 30, 1, 0),
(18, 'Azure Breeze Lawn Suit', 'azure-breeze-lawn-suit', 'Crisp pastel powder blue lawn ensemble featuring hand-worked mirror work details and printed crinkle chiffon dupatta.', 6299.00, NULL, 1, 4, 'Lawn & Crinkle Chiffon', 4.70, 19, 50, 0, 0),
(19, 'Opal White Cotton Staple', 'opal-white-cotton-staple', 'Essential crisp white chicken-kari cotton shirt paired with tailored cigarette pants for timeless daily wear.', 4799.00, 4199.00, 5, 4, '100% Pure Egyptian Cotton', 4.90, 47, 65, 0, 1),
(20, 'Royal Garnet Jacquard Set', 'royal-garnet-jacquard-set', 'Textured self-patterned jacquard shirt in rich garnet burgundy with antique brass embellishments.', 10899.00, NULL, 2, 2, 'Self Jacquard & Silk Trousers', 4.80, 33, 28, 1, 0)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 5. Insert Product Images
INSERT INTO product_images (product_id, image_url, is_primary) VALUES
(1, "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop", 1),
(1, "https://images.unsplash.com/photo-1583391733975-47b2c589634e?q=80&w=1000&auto=format&fit=crop", 0),
(2, "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop", 1),
(2, "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop", 0),
(3, "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop", 1),
(3, "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop", 0),
(4, "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop", 1),
(4, "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop", 0),
(5, "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop", 1),
(5, "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop", 0),
(6, "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop", 1),
(6, "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000&auto=format&fit=crop", 0),
(7, "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1000&auto=format&fit=crop", 1),
(7, "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1000&auto=format&fit=crop", 0),
(8, "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop", 1),
(8, "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop", 0),
(9, "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop", 1),
(9, "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop", 0),
(10, "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop", 1),
(10, "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop", 0),
(11, "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop", 1),
(11, "https://images.unsplash.com/photo-1583391733975-47b2c589634e?q=80&w=1000&auto=format&fit=crop", 0),
(12, "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000&auto=format&fit=crop", 1),
(12, "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop", 0),
(13, "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop", 1),
(14, "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop", 1),
(15, "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1000&auto=format&fit=crop", 1),
(16, "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop", 1),
(17, "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000&auto=format&fit=crop", 1),
(18, "https://images.unsplash.com/photo-1583391733975-47b2c589634e?q=80&w=1000&auto=format&fit=crop", 1),
(19, "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop", 1),
(20, "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop", 1);

-- 6. Insert Product Variants (Sizes & Colors)
INSERT INTO product_variants (product_id, size, color, stock_quantity) VALUES
(1, 'XS', 'Ivory', 10), (1, 'S', 'Ivory', 15), (1, 'M', 'Ivory', 12), (1, 'L', 'Ivory', 8), (1, 'XL', 'Ivory', 5),
(2, 'S', 'Onyx Black', 10), (2, 'M', 'Onyx Black', 10), (2, 'L', 'Onyx Black', 10),
(3, 'S', 'Dusty Rose', 15), (3, 'M', 'Dusty Rose', 20), (3, 'L', 'Dusty Rose', 15),
(4, 'S', 'Pearl White', 10), (4, 'M', 'Pearl White', 10), (4, 'L', 'Pearl White', 5),
(5, 'S', 'Sapphire Navy', 15), (5, 'M', 'Sapphire Navy', 15), (5, 'L', 'Sapphire Navy', 10),
(6, 'S', 'Deep Emerald', 10), (6, 'M', 'Deep Emerald', 15), (6, 'L', 'Deep Emerald', 10),
(7, 'S', 'Terracotta', 20), (7, 'M', 'Terracotta', 20), (7, 'L', 'Terracotta', 20),
(8, 'S', 'Antique Gold', 5), (8, 'M', 'Antique Gold', 10), (8, 'L', 'Antique Gold', 5),
(9, 'S', 'Dust Rose', 10), (9, 'M', 'Dust Rose', 12), (9, 'L', 'Dust Rose', 8),
(10, 'S', 'Garnet Crimson', 5), (10, 'M', 'Garnet Crimson', 5), (10, 'L', 'Garnet Crimson', 5);

-- 7. Insert Sample Reviews
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
(1, 1, 5, "Breathtaking quality lawn! The embroidery is subtle, feminine and very soft on the skin."),
(1, 2, 5, "Noir Garden is an absolute head-turner. Wore it to a dinner and received so many compliments!"),
(1, 4, 5, "Pure luxury raw silk. The pearl tassels on the veil add such a graceful touch.");
