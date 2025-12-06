import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function inspectDatabase() {
  console.log('🔍 Inspecting current database structure...');
  
  try {
    // Get a single product to see current fields
    const products = await prisma.product.findMany({
      take: 1,
    });

    console.log('✅ Product query successful');
    console.log('📊 Available fields:', Object.keys(products[0] || {}));
    console.log('📦 Sample product data:', JSON.stringify(products[0], null, 2));
    
  } catch (error: any) {
    console.log('❌ Error querying products:', error.message);
    
    // Try a simpler query to see what fields work
    try {
      const simpleProducts = await prisma.product.findMany({
        take: 1,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          imageUrl: true,
          sellerId: true,
          isActive: true,
        }
      });
      console.log('✅ Simple query successful');
      console.log('📊 Available fields:', Object.keys(simpleProducts[0] || {}));
    } catch (simpleError: any) {
      console.log('❌ Simple query also failed:', simpleError.message);
    }
  }

  // Check if Cart and CartItem tables exist
  try {
    const cartCount = await prisma.cart.count();
    console.log(`✅ Cart table exists with ${cartCount} records`);
  } catch (error: any) {
    console.log('❌ Cart table query failed:', error.message);
  }

  try {
    const cartItemCount = await prisma.cartItem.count();
    console.log(`✅ CartItem table exists with ${cartItemCount} records`);
  } catch (error: any) {
    console.log('❌ CartItem table query failed:', error.message);
  }

  await prisma.$disconnect();
}

inspectDatabase();