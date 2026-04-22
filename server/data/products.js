const products = [];

const categories = ['Makeup', 'Skincare', 'Fragrance', 'Tools'];

// Local images available in client/public/images
const localImages = {
    Makeup: ['/images/lipstick.png', '/images/palette.png', '/images/highlighter.png', '/images/product-01.jpg', '/images/product-02.jpg', '/images/product-06.jpg', '/images/product-07.jpg', '/images/product-08.jpg', '/images/product-10.jpg'],
    Skincare: ['/images/cream.png', '/images/serum.png', '/images/product-03.jpg', '/images/product-04.jpg', '/images/product-09.jpg', '/images/product-11.jpg', '/images/product-17.jpg'],
    Fragrance: ['/images/perfume.png', '/images/product-15.jpg', '/images/product-16.jpg'],
    Tools: ['/images/haircare.png', '/images/product-05.jpg']
};

const rareBeautyProducts = [
    { name: 'Soft Pinch Liquid Blush', price: 2100, cat: 'Makeup' },
    { name: 'Positive Light Silky Touch Highlighter', price: 2200, cat: 'Makeup' },
    { name: 'Lip Soufflé Matte Lip Cream', price: 1800, cat: 'Makeup' },
    { name: 'Liquid Touch Weightless Foundation', price: 2600, cat: 'Makeup' },
    { name: 'Always An Optimist 4-in-1 Mist', price: 2400, cat: 'Skincare' },
    { name: 'Warm Wishes Effortless Bronzer Stick', price: 2300, cat: 'Makeup' },
    { name: 'Perfect Strokes Universal Volumizing Mascara', price: 1800, cat: 'Makeup' },
    { name: 'Liquid Touch Brightening Concealer', price: 1900, cat: 'Makeup' },
    { name: 'Stay Vulnerable Melting Blush', price: 1900, cat: 'Makeup' },
    { name: 'Kind Words Matte Lipstick', price: 1800, cat: 'Makeup' },
    { name: 'Kind Words Matte Lip Liner', price: 1300, cat: 'Makeup' },
    { name: 'Find Comfort Fragrance Mist', price: 2500, cat: 'Fragrance' },
    { name: 'Always An Optimist Illuminating Primer', price: 2500, cat: 'Skincare' },
    { name: 'Always An Optimist Pore Diffusing Primer', price: 2500, cat: 'Skincare' },
    { name: 'Find Comfort Hydrating Body Cream', price: 2500, cat: 'Skincare' },
    { name: 'Find Comfort Hydrating Hand Cream', price: 1600, cat: 'Skincare' },
    { name: 'Perfect Strokes Matte Liquid Liner', price: 1900, cat: 'Makeup' },
    { name: 'Brow Harmony Pencil & Gel', price: 1900, cat: 'Makeup' },
    { name: 'Positive Light Under Eye Brightener', price: 2100, cat: 'Makeup' },
    { name: 'Stay Vulnerable Glossy Lip Oil', price: 1800, cat: 'Makeup' },
    { name: 'Discovery Eyeshadow Palette', price: 2600, cat: 'Makeup' },
    { name: 'Liquid Touch Foundation Brush', price: 2400, cat: 'Tools' },
    { name: 'Liquid Touch Concealer Brush', price: 1400, cat: 'Tools' },
    { name: 'Always An Optimist Powder Brush', price: 2400, cat: 'Tools' },
    { name: 'Always An Optimist Blush Brush', price: 2000, cat: 'Tools' },
    { name: 'Always An Optimist Eye Brush', price: 1200, cat: 'Tools' },
    { name: 'Pore Diffusing Primer Travel Size', price: 1200, cat: 'Skincare' },
    { name: 'Soft Pinch Blush Travel Size', price: 1100, cat: 'Makeup' },
    { name: 'Lip Soufflé Travel Size', price: 900, cat: 'Makeup' },
    { name: 'Mascara Travel Size', price: 900, cat: 'Makeup' },
    { name: 'Find Comfort Body Wash', price: 2000, cat: 'Skincare' },
    { name: 'Find Comfort Aromatherapy Pen', price: 1800, cat: 'Skincare' },
    { name: 'Weightless Foundation Serum', price: 2800, cat: 'Makeup' },
    { name: 'Hydrating Essence Mist', price: 2200, cat: 'Skincare' },
    { name: 'Velvet Matte Lip Cream', price: 1900, cat: 'Makeup' },
    { name: 'Silk Touch Glow Powder', price: 2100, cat: 'Makeup' },
    { name: 'Radiant Face Mist', price: 2400, cat: 'Skincare' },
    { name: 'Purifying Cleansing Oil', price: 2200, cat: 'Skincare' },
    { name: 'Balancing Toner', price: 1800, cat: 'Skincare' },
    { name: 'Luminous Day Moisturizer', price: 2500, cat: 'Skincare' },
    { name: 'Nourishing Eye Gel', price: 1900, cat: 'Skincare' },
    { name: 'Renewing Night Cream', price: 2800, cat: 'Skincare' },
    { name: 'Botanical Hair Mist', price: 1800, cat: 'Skincare' },
    { name: 'Silk Smoothing Conditioner', price: 2000, cat: 'Skincare' },
    { name: 'Argan Hair Elixir', price: 2400, cat: 'Skincare' },
    { name: 'Intensive Hair Mask', price: 2500, cat: 'Skincare' },
    { name: 'Midnight Jasmine Perfume', price: 3500, cat: 'Fragrance' },
    { name: 'Golden Sun Eau de Parfum', price: 3800, cat: 'Fragrance' },
    { name: 'Velvet Musk Scent', price: 3200, cat: 'Fragrance' },
    { name: 'Secret Garden Body Mist', price: 2200, cat: 'Fragrance' }
];

const brands = ['Rare Beauty'];

for (let i = 0; i < rareBeautyProducts.length; i++) {
    const brand = brands[0];
    const selectedProduct = rareBeautyProducts[i];
    
    // Pick a local image from the corresponding category
    const catImages = localImages[selectedProduct.cat] || localImages['Makeup'];
    const image = catImages[i % catImages.length];
    
    const name = selectedProduct.name;
    const category = selectedProduct.cat;
    const price = selectedProduct.price;

    products.push({
        name,
        image,
        description: `Experience the iconic beauty of ${name} by Rare Beauty. This premium ${category.toLowerCase()} essential is designed to celebrate what makes you unique. Cruelty-free, vegan, and formulated with skin-loving ingredients.`,
        brand,
        category,
        price,
        countInStock: Math.floor(Math.random() * 30) + 5,
        rating: parseFloat((Math.random() * 0.8 + 4.2).toFixed(1)),
        numReviews: Math.floor(Math.random() * 500) + 100,
        ingredients: 'Aqua (Purified Water), Botanical Extracts, Vitamin E, Hyaluronic Acid, Essential Oils, Fragrance.'
    });
}

module.exports = products;
