import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test data...');

  // Create categories (matching frontend dropdown values)
  const electronics = await prisma.category.create({
    data: { name: 'Electronics', description: 'Electronic devices and gadgets' },
  });

  const clothing = await prisma.category.create({
    data: { name: 'Clothing', description: 'Fashion and apparel' },
  });

  const homeGarden = await prisma.category.create({
    data: { name: 'Home & Garden', description: 'Home improvement and gardening supplies' },
  });

  const sportsOutdoors = await prisma.category.create({
    data: { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear' },
  });

  const booksMedia = await prisma.category.create({
    data: { name: 'Books & Media', description: 'Books, movies, music and digital media' },
  });

  console.log('📂 Created categories');

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

  // Create products for seller1
  const product1 = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'iPhone 15 Pro Max',
      description: 'The latest iPhone with advanced camera system, A17 Pro chip, and titanium design. Features include 48MP camera, Action Button, and USB-C connectivity.',
      price: 1199.99,
      sellerId: seller1.id,
      categoryId: electronics.id,
      isApproved: true,
      images: {
        create: [
          { url: 'https://via.placeholder.com/500x500?text=iPhone+15+Pro+Max' },
          { url: 'https://via.placeholder.com/500x500?text=iPhone+15+Back' },
        ],
      },
    },
  });

  const product2 = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'MacBook Air M3',
      description: 'Supercharged by the M3 chip, MacBook Air is up to 60% faster than the fastest Intel-based MacBook Air and up to 13x faster than the fastest 12-inch MacBook.',
      price: 1099.99,
      sellerId: seller1.id,
      categoryId: electronics.id,
      isApproved: true,
      images: {
        create: [
          { url: 'https://via.placeholder.com/500x500?text=MacBook+Air+M3' },
        ],
      },
    },
  });

  const product3 = await prisma.product.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.',
      price: 39.99,
      sellerId: seller2.id,
      categoryId: booksMedia.id,
      isApproved: true,
      images: {
        create: [
          { url: 'https://via.placeholder.com/500x500?text=Clean+Code+Book' },
        ],
      },
    },
  });

  const product4 = await prisma.product.upsert({
    where: { id: 4 },
    update: {},
    create: {
      title: 'Wireless Bluetooth Headphones',
      description: 'Premium noise-cancelling wireless headphones with 30-hour battery life, comfortable over-ear design, and crystal-clear audio quality.',
      price: 199.99,
      sellerId: seller2.id,
      categoryId: electronics.id,
      isApproved: true,
      images: {
        create: [
          { url: 'https://via.placeholder.com/500x500?text=Bluetooth+Headphones' },
        ],
      },
    },
  });

  const product5 = await prisma.product.upsert({
    where: { id: 5 },
    update: {},
    create: {
      title: 'Organic Cotton T-Shirt',
      description: 'Comfortable organic cotton t-shirt in multiple colors. Made from 100% GOTS certified organic cotton, pre-shrunk and tagless for maximum comfort.',
      price: 29.99,
      sellerId: seller2.id,
      categoryId: clothing.id,
      isApproved: true,
      images: {
        create: [
          { url: 'https://via.placeholder.com/500x500?text=Organic+Cotton+T-Shirt' },
        ],
      },
    },
  });

  console.log('📦 Created products');

  // Create some reviews
  await prisma.review.upsert({
    where: { userId_productId: { userId: buyer1.id, productId: product1.id } },
    update: {},
    create: {
      userId: buyer1.id,
      productId: product1.id,
      rating: 5,
      comment: 'Amazing phone! The camera quality is incredible and the titanium build feels premium.',
      isApproved: true,
    },
  });

  await prisma.review.upsert({
    where: { userId_productId: { userId: buyer2.id, productId: product1.id } },
    update: {},
    create: {
      userId: buyer2.id,
      productId: product1.id,
      rating: 4,
      comment: 'Great phone, but battery life could be better. Still very satisfied with the purchase.',
      isApproved: true,
    },
  });

  await prisma.review.upsert({
    where: { userId_productId: { userId: buyer1.id, productId: product3.id } },
    update: {},
    create: {
      userId: buyer1.id,
      productId: product3.id,
      rating: 5,
      comment: 'Essential reading for any software developer. Changed how I think about code quality.',
      isApproved: true,
    },
  });

  console.log('⭐ Created reviews');

  console.log('\n🎉 Test data seeded successfully!');
  console.log('\n📊 Summary:');
  console.log('- Categories: 3');
  console.log('- Sellers: 2');
  console.log('- Buyers: 2');
  console.log('- Products: 5');
  console.log('- Reviews: 3');

  console.log('\n🔑 Test Accounts:');
  console.log('Seller 1: john.seller@example.com / password123');
  console.log('Seller 2: sarah.seller@example.com / password123');
  console.log('Buyer 1: alice.buyer@example.com / password123');
  console.log('Buyer 2: bob.buyer@example.com / password123');

  console.log('\n📦 Products Available:');
  console.log(`- ${product1.title} (ID: ${product1.id})`);
  console.log(`- ${product2.title} (ID: ${product2.id})`);
  console.log(`- ${product3.title} (ID: ${product3.id})`);
  console.log(`- ${product4.title} (ID: ${product4.id})`);
  console.log(`- ${product5.title} (ID: ${product5.id})`);

  console.log('\n🌐 Test URLs:');
  console.log('http://localhost:3000/products/1');
  console.log('http://localhost:3000/products/2');
  console.log('http://localhost:3000/products/3');
  console.log('http://localhost:3000/products/4');
  console.log('http://localhost:3000/products/5');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });