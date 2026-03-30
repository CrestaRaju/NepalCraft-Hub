/**
 * Database Seeder - Realistic Nepali Handicraft Data
 * Run: node src/seed.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Product, Order, OrderItem, Payment, Review, Shipment } = require('./models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected for seeding...');

    // Sync all models
    await sequelize.sync({ force: true }); // WARNING: drops and recreates tables
    console.log('✅ Tables synced');

    // --- Create Users ---
    const adminPwd = await bcrypt.hash('admin123', 10);
    const sellerPwd = await bcrypt.hash('seller123', 10);
    const buyerPwd = await bcrypt.hash('buyer123', 10);

    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@nepalcraft.com',
      password: adminPwd,
      role: 'admin',
      isVerified: true,
      isActive: true
    });

    const seller1 = await User.create({
      firstName: 'Sunita',
      lastName: 'Tamang',
      email: 'sunita@nepalcraft.com',
      password: sellerPwd,
      role: 'seller',
      phoneNumber: '+977-9801234567',
      address: 'Bhaktapur, Bagmati Province, Nepal',
      isVerified: true,
      isActive: true,
      provenanceStory: 'Sunita Tamang is a third-generation artisan from Bhaktapur, Nepal. She learned the art of Thangka painting from her grandmother at the age of 12. Each piece she creates is meticulously handcrafted using natural mineral pigments and gold leaf, following traditional techniques that have been passed down for over 200 years. Her work has been exhibited in galleries across Asia and Europe.'
    });

    const seller2 = await User.create({
      firstName: 'Ram',
      lastName: 'Shrestha',
      email: 'ram@nepalcraft.com',
      password: sellerPwd,
      role: 'seller',
      phoneNumber: '+977-9812345678',
      address: 'Patan, Lalitpur, Nepal',
      isVerified: true,
      isActive: true,
      provenanceStory: 'Ram Shrestha is a master craftsman specializing in Dhaka weaving and Pashmina production. Based in Patan - the city of artisans - his family workshop employs over 20 local artisans, providing fair wages and preserving ancient textile traditions. His Pashmina shawls are CRAFT-certified for authenticity and fair trade practices.'
    });

    const seller3 = await User.create({
      firstName: 'Maya',
      lastName: 'Gurung',
      email: 'maya@nepalcraft.com',
      password: sellerPwd,
      role: 'seller',
      phoneNumber: '+977-9823456789',
      address: 'Pokhara, Gandaki Province, Nepal',
      isVerified: false,
      isActive: true,
      provenanceStory: 'Maya Gurung is a young entrepreneur from Pokhara who creates handmade singing bowls and meditation instruments. Her bowls are made from the traditional seven-metal alloy (Panchadhatu) and are hand-hammered by skilled artisans in her village cooperative.'
    });

    const buyer1 = await User.create({
      firstName: 'James',
      lastName: 'Thompson',
      email: 'james@example.co.uk',
      password: buyerPwd,
      role: 'buyer',
      phoneNumber: '+44-7700900123',
      address: '42 Baker Street, London, W1U 6RT, United Kingdom',
      isActive: true
    });

    const buyer2 = await User.create({
      firstName: 'Emily',
      lastName: 'Watson',
      email: 'emily@example.co.uk',
      password: buyerPwd,
      role: 'buyer',
      phoneNumber: '+44-7700900456',
      address: '15 Royal Mile, Edinburgh, EH1 1SR, United Kingdom',
      isActive: true
    });

    console.log('✅ Users created');

    // --- Create Products ---
    const products = await Product.bulkCreate([
      {
        name: 'Hand-painted Thangka - Buddha of Compassion',
        description: 'An exquisitely hand-painted Tibetan Buddhist Thangka depicting Avalokiteshvara (Buddha of Compassion). Created using natural mineral pigments including lapis lazuli, malachite, and 24-karat gold leaf. The canvas is prepared with traditional chalk gesso on cotton cloth. This piece took over 3 months to complete and is perfect for meditation spaces, yoga studios, or as a statement piece in your home.',
        priceNPR: 45000,
        stock: 5,
        category: 'Paintings & Art',
        provenanceStory: 'Painted by Sunita Tamang in her Bhaktapur studio using techniques dating back to the 10th century. Each brushstroke follows sacred geometric proportions. Comes with certificate of authenticity.',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=600',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
        ]),
        isVerified: true,
        sellerId: seller1.id
      },
      {
        name: 'Pure Pashmina Shawl - Kashmir Weave',
        description: 'Luxuriously soft 100% Grade A Pashmina shawl, hand-woven in Patan, Nepal. The Pashmina wool is sourced from Himalayan Chyangra goats that graze above 14,000 feet elevation, producing the finest natural fiber in the world. Each shawl takes 3 days to weave on a traditional handloom. Machine-washable with proper care. Size: 200cm x 70cm. Available in natural ivory with intricate paisley border embroidery.',
        priceNPR: 12500,
        stock: 25,
        category: 'Textiles & Fabrics',
        provenanceStory: 'Woven in Ram Shrestha\'s family workshop in Patan. Fair Trade certified. Supports 20+ local weavers with living wages.',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600',
          'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600'
        ]),
        isVerified: true,
        sellerId: seller2.id
      },
      {
        name: 'Singing Bowl Set - 7-Metal Alloy',
        description: 'Handcrafted singing bowl made from traditional Panchadhatu (7-metal) alloy including gold, silver, copper, iron, tin, lead, and zinc. Hand-hammered by master craftsmen in Pokhara. Produces rich, resonant overtones perfect for sound healing, meditation, and yoga. Includes wooden striker and silk cushion. Diameter: 18cm. Weight: 680g approx. Each bowl is tuned to a specific chakra frequency.',
        priceNPR: 8500,
        stock: 15,
        category: 'Meditation & Wellness',
        provenanceStory: 'Handmade in Maya Gurung\'s village cooperative in Pokhara. Each bowl is energetically cleansed and blessed by a local Buddhist monk before shipping.',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600',
          'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=600'
        ]),
        isVerified: true,
        sellerId: seller3.id
      },
      {
        name: 'Dhaka Fabric Table Runner',
        description: 'Vibrant hand-woven Dhaka fabric table runner in traditional geometric patterns. Made on a traditional wooden handloom using premium cotton threads. The Dhaka weaving technique originated in Nepal and features intricate multi-colored patterns that require exceptional skill. Perfect for adding a touch of Himalayan culture to your dining table. Dimensions: 150cm x 30cm. Each one is unique with slight natural variations.',
        priceNPR: 3200,
        stock: 40,
        category: 'Textiles & Fabrics',
        provenanceStory: 'Woven by artisan women in the Tansen Dhaka Cooperative, Palpa district. Supports women\'s economic empowerment in rural Nepal.',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'
        ]),
        isVerified: true,
        sellerId: seller2.id
      },
      {
        name: 'Bronze Ganesh Statue - Lost Wax Method',
        description: 'Magnificent bronze statue of Lord Ganesha, the remover of obstacles, created using the ancient Patan lost-wax (Cire Perdue) casting method. This technique has been practiced in the Kathmandu Valley for over 1,500 years. The statue features incredible detail work including the elephant head, four arms, and traditional ornamentation. Height: 25cm. Patinated to an antique bronze finish. Perfect for home altars, yoga spaces, or as a gift.',
        priceNPR: 22000,
        stock: 8,
        category: 'Sculptures & Statues',
        provenanceStory: 'Cast and chased by master metal workers in Patan. Each piece is individually worked by hand to achieve fine surface detail. Signed by the artisan.',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1617040619263-41c5a9ca7521?w=600'
        ]),
        isVerified: true,
        sellerId: seller1.id
      },
      {
        name: 'Lokta Paper Journal - Handmade',
        description: 'Beautiful journal handcrafted from Lokta paper, made from the bark of the Lokta shrub that grows wild in the Himalayan forests of Nepal. Lokta paper is acid-free, durable, and resistant to insects and humidity. The journal features a hand-stitched spine with waxed linen thread and a cotton tie closure. Pages: 100 sheets (200 pages) of cream Lokta paper. Cover: Marbled Lokta paper in traditional Nepali patterns. Dimensions: 14cm x 20cm.',
        priceNPR: 1800,
        stock: 60,
        category: 'Stationery & Paper Crafts',
        provenanceStory: 'Made by artisans in Bhaktapur Paper Factory using traditional techniques. Eco-friendly and sustainable - no trees are harmed in production.',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=600'
        ]),
        isVerified: true,
        sellerId: seller1.id
      },
      {
        name: 'Mithila Painting - Tree of Life',
        description: 'Contemporary Mithila (Madhubani) painting depicting the traditional Tree of Life motif. Created by a skilled Mithila artist using natural pigments and fine brushes. This ancient art form originated in the Mithila region of Nepal and India, traditionally painted by women on walls and floors for special occasions. Medium: Acrylic on handmade Lokta paper. Dimensions: 50cm x 70cm. Unframed - suitable for framing. Each painting is an original artwork.',
        priceNPR: 6500,
        stock: 12,
        category: 'Paintings & Art',
        provenanceStory: 'Painted by artisans from the Janakpur Women\'s Development Center in the Terai region of Nepal. Proceeds support women artists.',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=600'
        ]),
        isVerified: false,
        sellerId: seller3.id
      },
      {
        name: 'Yak Wool Blanket - Hand Woven',
        description: 'Incredibly warm and soft blanket hand-woven from 100% Himalayan Yak wool. Yak wool is naturally odor-resistant, moisture-wicking, and three times warmer than sheep\'s wool. Each blanket takes 4-5 days to weave on a traditional handloom. Perfect for cold British winters! The natural colors range from dark brown to cream. Dimensions: 160cm x 200cm. Machine washable on wool cycle.',
        priceNPR: 18000,
        stock: 10,
        category: 'Textiles & Fabrics',
        provenanceStory: 'Woven by nomadic artisans in the Mustang region of Upper Nepal at altitudes of 3,000-4,000m. Supports traditional nomadic livelihoods.',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1565978771542-0db9d3b3e671?w=600'
        ]),
        isVerified: true,
        sellerId: seller2.id
      }
    ]);

    console.log('✅ Products created');

    // --- Create Reviews ---
    await Review.bulkCreate([
      {
        productId: products[0].id,
        userId: buyer1.id,
        rating: 5,
        comment: 'Absolutely stunning Thangka! The detail work is incredible, and it arrived beautifully packaged. Sunita\'s craftsmanship is extraordinary - this is now the centrepiece of my meditation room.'
      },
      {
        productId: products[0].id,
        userId: buyer2.id,
        rating: 5,
        comment: 'Worth every penny. The gold leaf work catches the light beautifully. Came with a certificate of authenticity. Shipping to Edinburgh took about 2 weeks which is reasonable.'
      },
      {
        productId: products[1].id,
        userId: buyer1.id,
        rating: 5,
        comment: 'The softest thing I\'ve ever owned. The weave is incredibly fine and the paisley border embroidery is exquisite. Exactly as described - genuinely 100% Pashmina, not a blend.'
      },
      {
        productId: products[2].id,
        userId: buyer2.id,
        rating: 4,
        comment: 'The sound quality is remarkable - very resonant and long-sustaining. The cushion and mallet are included which is great. Slightly smaller than I expected but still wonderful.'
      },
      {
        productId: products[4].id,
        userId: buyer1.id,
        rating: 5,
        comment: 'Museum-quality bronze work. The detailing on the jewellery and face is breathtaking. Has become the most talked-about item in my home!'
      }
    ]);

    console.log('✅ Reviews created');

    // --- Create a sample Order ---
    const order1 = await Order.create({
      buyerId: buyer1.id,
      totalAmountNPR: 57500,
      totalAmountGBP: 345.00,
      vatAmountGBP: 57.50,
      shippingFeeGBP: 12.99,
      status: 'delivered',
      shippingAddress: '42 Baker Street, London, W1U 6RT, United Kingdom',
      trackingNumber: 'DHL1234567890'
    });

    await OrderItem.bulkCreate([
      { orderId: order1.id, productId: products[0].id, quantity: 1, priceAtPurchaseNPR: 45000 },
      { orderId: order1.id, productId: products[1].id, quantity: 1, priceAtPurchaseNPR: 12500 }
    ]);

    await Payment.create({
      orderId: order1.id,
      paymentId: 'pi_mock_sample001',
      amount: 415.49,
      currency: 'GBP',
      status: 'succeeded'
    });

    await Shipment.create({
      orderId: order1.id,
      carrier: 'DHL',
      trackingNumber: 'DHL1234567890',
      status: 'delivered',
      estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    });

    const order2 = await Order.create({
      buyerId: buyer2.id,
      totalAmountNPR: 8500,
      totalAmountGBP: 51.00,
      vatAmountGBP: 8.50,
      shippingFeeGBP: 12.99,
      status: 'shipped',
      shippingAddress: '15 Royal Mile, Edinburgh, EH1 1SR, United Kingdom',
      trackingNumber: 'DHL9876543210'
    });

    await OrderItem.create({ orderId: order2.id, productId: products[2].id, quantity: 1, priceAtPurchaseNPR: 8500 });

    await Payment.create({
      orderId: order2.id,
      paymentId: 'pi_mock_sample002',
      amount: 72.49,
      currency: 'GBP',
      status: 'succeeded'
    });

    await Shipment.create({
      orderId: order2.id,
      carrier: 'DHL',
      trackingNumber: 'DHL9876543210',
      status: 'in_transit',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    });

    console.log('✅ Orders and Payments created');
    console.log('\n🎉 Seeding complete!\n');
    console.log('Test Credentials:');
    console.log('  Admin  → admin@nepalcraft.com   / admin123');
    console.log('  Seller → sunita@nepalcraft.com  / seller123');
    console.log('  Seller → ram@nepalcraft.com     / seller123');
    console.log('  Buyer  → james@example.co.uk    / buyer123');
    console.log('  Buyer  → emily@example.co.uk    / buyer123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
