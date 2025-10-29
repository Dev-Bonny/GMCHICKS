require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

// Sample product data
const products = [
  // Chicks
  {
    name: 'Day-Old Chicks (0-3 days)',
    description: 'Healthy day-old chicks, vaccinated at hatchery. Perfect for starting your poultry farm.',
    category: 'chick',
    age: '0-3 days',
    ageInDays: 1,
    price: 100,
    quantity: 500,
    breed: 'Kenbro',
    images: [
      { url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400', alt: 'Day old chicks' }
    ],
    features: [
      'Vaccinated against Marek\'s Disease',
      'Healthy and active',
      'High survival rate',
      'Ready to raise'
    ]
  },
  {
    name: '1 Week Old Chicks',
    description: 'One week old chicks, already eating well and growing strong.',
    category: 'chick',
    age: '1 week',
    ageInDays: 7,
    price: 130,
    quantity: 400,
    breed: 'Kenbro',
    images: [
      { url: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=400', alt: '1 week chicks' }
    ],
    features: [
      'Received Newcastle vaccine',
      'Eating solid feed',
      'Very active',
      'Guaranteed health'
    ]
  },
  {
    name: '2 Weeks Old Chicks',
    description: 'Two weeks old chicks with completed first round of vaccinations.',
    category: 'chick',
    age: '2 weeks',
    ageInDays: 14,
    price: 160,
    quantity: 350,
    breed: 'Rainbow Rooster',
    images: [
      { url: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=400', alt: '2 week chicks' }
    ],
    features: [
      'First Gumboro vaccine done',
      'Strong and healthy',
      'Growing rapidly',
      'Low mortality rate'
    ]
  },
  {
    name: '3 Weeks Old Chicks',
    description: 'Three weeks old chicks, well-developed and hardy.',
    category: 'chick',
    age: '3 weeks',
    ageInDays: 21,
    price: 200,
    quantity: 300,
    breed: 'Kienyeji Improved',
    images: [
      { url: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=400', alt: '3 week chicks' }
    ],
    features: [
      'Multiple vaccinations completed',
      'Fully feathered',
      'Disease resistant',
      'Ready for outdoor coops'
    ]
  },
  {
    name: '4 Weeks Old Chicks',
    description: 'One month old chicks, ready to transition to grower feed.',
    category: 'chick',
    age: '4 weeks',
    ageInDays: 28,
    price: 250,
    quantity: 250,
    breed: 'Kenbro',
    images: [
      { url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400', alt: '4 week chicks' }
    ],
    features: [
      'Ready for grower feed',
      'Fully vaccinated for age',
      'Strong immune system',
      'Minimal care needed'
    ]
  },
  
  // Layers
  {
    name: 'Point of Lay Pullets (16-18 weeks)',
    description: 'Ready to start laying eggs. High-quality layer pullets about to reach maturity.',
    category: 'layer',
    age: '16-18 weeks',
    ageInDays: 119,
    price: 800,
    quantity: 150,
    breed: 'Bovans Brown',
    weight: '1.3-1.5kg',
    images: [
      { url: 'https://images.unsplash.com/photo-1596510915350-a25abf8f4f67?w=400', alt: 'Layer pullets' }
    ],
    features: [
      'About to start laying',
      'Fully vaccinated',
      'High egg production breed',
      'Disease resistant',
      'Peak production for 1 year'
    ]
  },
  {
    name: 'Active Layer Hens (20+ weeks)',
    description: 'Mature laying hens in peak production. Producing quality eggs daily.',
    category: 'layer',
    age: '20+ weeks',
    ageInDays: 140,
    price: 950,
    quantity: 100,
    breed: 'ISA Brown',
    weight: '1.5-1.8kg',
    images: [
      { url: 'https://images.unsplash.com/photo-1612169676339-0678e8247540?w=400', alt: 'Layer hens' }
    ],
    features: [
      'Currently laying eggs',
      '280-300 eggs per year',
      'Excellent egg quality',
      'Fully vaccinated',
      'Healthy and productive'
    ]
  },
  
  // Broilers
  {
    name: 'Ready-to-Harvest Broilers (6 weeks)',
    description: 'Market-ready broilers at optimal weight for meat production.',
    category: 'broiler',
    age: '6 weeks',
    ageInDays: 42,
    price: 700,
    quantity: 200,
    breed: 'Cobb 500',
    weight: '2.0-2.5kg',
    images: [
      { url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400', alt: 'Broiler chickens' }
    ],
    features: [
      'Ready for market',
      'Optimal meat-to-bone ratio',
      'Fed premium feed',
      'Disease-free',
      'Quick turnaround'
    ]
  },
  {
    name: 'Premium Broilers (8 weeks)',
    description: 'Extra-large broilers for premium market. Excellent meat quality.',
    category: 'broiler',
    age: '8 weeks',
    ageInDays: 56,
    price: 900,
    quantity: 150,
    breed: 'Ross 308',
    weight: '2.8-3.2kg',
    images: [
      { url: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=400', alt: 'Premium broilers' }
    ],
    features: [
      'Premium size',
      'Excellent meat quality',
      'Tender and juicy',
      'Fed organic supplements',
      'High-end market ready'
    ]
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert products
    await Product.insertMany(products);
    console.log('✅ Inserted sample products');

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@gmchicks.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@gmchicks.com',
        password: 'admin123456',
        phone: '254700000000',
        role: 'admin'
      });
      console.log('✅ Created admin user');
      console.log('   Email: admin@gmchicks.com');
      console.log('   Password: admin123456');
    }

    // Create test customer
    const customerExists = await User.findOne({ email: 'customer@test.com' });
    if (!customerExists) {
      await User.create({
        name: 'Test Customer',
        email: 'customer@test.com',
        password: 'test123456',
        phone: '254700123456',
        role: 'customer',
        address: {
          street: '123 Test Street',
          city: 'Nairobi',
          county: 'Nairobi',
          postalCode: '00100'
        }
      });
      console.log('✅ Created test customer');
      console.log('   Email: customer@test.com');
      console.log('   Password: test123456');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📊 Total products: ${products.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();