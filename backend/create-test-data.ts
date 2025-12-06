import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test data...');

  // Categories not implemented in MVP schema
  console.log('📂 Skipping categories for MVP');

  try {
    // Create sellers
    const seller1Password = await bcrypt.hash('password123', 10);
    const seller1 = await prisma.user.upsert({
      where: { email: 'john.seller@example.com' },
      update: {},
      create: {
        name: 'John Seller',
        email: 'john.seller@example.com',
        password: seller1Password,
        role: 'SELLER',
      },
    });

    const seller2Password = await bcrypt.hash('password123', 10);
    const seller2 = await prisma.user.upsert({
      where: { email: 'sarah.seller@example.com' },
      update: {},
      create: {
        name: 'Sarah Seller',
        email: 'sarah.seller@example.com',
        password: seller2Password,
        role: 'SELLER',
      },
    });

    // Create buyers
    const buyer1Password = await bcrypt.hash('password123', 10);
    const buyer1 = await prisma.user.upsert({
      where: { email: 'alice.buyer@example.com' },
      update: {},
      create: {
        name: 'Alice Buyer',
        email: 'alice.buyer@example.com',
        password: buyer1Password,
        role: 'BUYER',
      },
    });

    const buyer2Password = await bcrypt.hash('password123', 10);
    const buyer2 = await prisma.user.upsert({
      where: { email: 'bob.buyer@example.com' },
      update: {},
      create: {
        name: 'Bob Buyer',
        email: 'bob.buyer@example.com',
        password: buyer2Password,
        role: 'BUYER',
      },
    });

    // Create admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    console.log('👥 Created users');

    // Create products for seller1 (compatible with current schema)
    const product1 = await prisma.product.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: 'iPhone 15 Pro Max',
        description: 'The latest iPhone with advanced camera system, A17 Pro chip, and titanium design. Features include 48MP camera, Action Button, and USB-C connectivity.',
        price: 1199.99,
        imageUrl: '/placeholder.jpg',
        sellerId: seller1.id,
        isActive: true,
        // stock field not included for compatibility
      },
    });

    const product2 = await prisma.product.upsert({
      where: { id: 2 },
      update: {},
      create: {
        title: 'MacBook Air M3',
        description: 'Supercharged by the M3 chip, MacBook Air is up to 60% faster than the fastest Intel-based MacBook Air and up to 13x faster than the fastest 12-inch MacBook.',
        price: 1099.99,
        imageUrl: '/placeholder.jpg',
        sellerId: seller1.id,
        isActive: true,
        // stock field not included for compatibility
      },
    });

    const product3 = await prisma.product.upsert({
      where: { id: 3 },
      update: {},
      create: {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.',
        price: 39.99,
        imageUrl: '/placeholder.jpg',
        sellerId: seller2.id,
        isActive: true,
        // stock field not included for compatibility
      },
    });

    const product4 = await prisma.product.upsert({
      where: { id: 4 },
      update: {},
      create: {
        title: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life, comfortable over-ear design, and crystal-clear audio quality.',
        price: 199.99,
        imageUrl: '/placeholder.jpg',
        sellerId: seller2.id,
        isActive: true,
        // stock field not included for compatibility
      },
    });

    const product5 = await prisma.product.upsert({
      where: { id: 5 },
      update: {},
      create: {
        title: 'Organic Cotton T-Shirt',
        description: 'Comfortable organic cotton t-shirt in multiple colors. Made from 100% GOTS certified organic cotton, pre-shrunk and tagless for maximum comfort.',
        price: 29.99,
        imageUrl: '/placeholder.jpg',
        sellerId: seller2.id,
        isActive: true,
        // stock field not included for compatibility
      },
    });

    console.log('📦 Created products');

    // Reviews not implemented in MVP schema
    console.log('⭐ Skipping reviews for MVP');

    console.log('\n🎉 Test data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('- Categories: 0 (MVP)');
    console.log('- Sellers: 2');
    console.log('- Buyers: 2');
    console.log('- Admin: 1');
    console.log('- Products: 5');
    console.log('- Reviews: 0 (MVP)');

    console.log('\n🔑 Test Accounts:');
    console.log('Seller 1: john.seller@example.com / password123');
    console.log('Seller 2: sarah.seller@example.com / password123');
    console.log('Buyer 1: alice.buyer@example.com / password123');
    console.log('Buyer 2: bob.buyer@example.com / password123');
    console.log('Admin: admin@example.com / admin123');

    console.log('\n📦 Products Available:');
    console.log(`- ${product1.title} (ID: ${product1.id}) - $${product1.price}`);
    console.log(`- ${product2.title} (ID: ${product2.id}) - $${product2.price}`);
    console.log(`- ${product3.title} (ID: ${product3.id}) - $${product3.price}`);
    console.log(`- ${product4.title} (ID: ${product4.id}) - $${product4.price}`);
    console.log(`- ${product5.title} (ID: ${product5.id}) - $${product5.price}`);

    console.log('\n🌐 Test URLs:');
    console.log('http://localhost:3000/products/1');
    console.log('http://localhost:3000/products/2');
    console.log('http://localhost:3000/products/3');
    console.log('http://localhost:3000/products/4');
    console.log('http://localhost:3000/products/5');

    console.log('\n🧪 Ready for User Acceptance Testing!');
    console.log('\n💡 Next Steps:');
    console.log('1. Test login with any of the above accounts');
    console.log('2. Browse products as a buyer');
    console.log('3. Add items to cart and test checkout');
    console.log('4. Test seller dashboard functionality');
    console.log('5. Test admin panel features');

  } catch (error: any) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });