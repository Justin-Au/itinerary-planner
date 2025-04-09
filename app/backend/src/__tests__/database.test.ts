import { PrismaClient } from '../../src/generated/prisma';
import dotenv from 'dotenv';

dotenv.config();

// Use an in-memory SQLite database for testing
process.env.DATABASE_URL = 'file:./test.db';
process.env.NODE_ENV = 'test';

describe('Database Connectivity Tests', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    // Ensure we're connected
    await prisma.$connect();
  });

  afterAll(async () => {
    // Clean up test data and disconnect
    await prisma.$disconnect();
  });

  it('should connect to the database', async () => {
    // If this test runs without throwing an error, the connection is successful
    expect(prisma).toBeDefined();
  });

  it('should be able to query the database', async () => {
    // Try to query the database
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    expect(result).toBeDefined();
  });

  it('should be able to create and retrieve a user', async () => {
    const email = `test-${Date.now()}@example.com`;
    
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email,
        name: 'Test User',
        password: 'password123',
      },
    });

    // Retrieve the user
    const retrievedUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    expect(retrievedUser).toBeDefined();
    expect(retrievedUser?.email).toBe(email);
    
    // Clean up
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  });

  it('should be able to create and retrieve an itinerary with items', async () => {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: `itinerary-test-${Date.now()}@example.com`,
        name: 'Itinerary Test User',
        password: 'password123',
      },
    });

    // Create a test category
    const category = await prisma.category.create({
      data: {
        name: `Test Category ${Date.now()}`,
        icon: '🧪',
        color: '#FF5733',
      },
    });

    // Create a test itinerary
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 3);

    const itinerary = await prisma.itinerary.create({
      data: {
        title: 'Test Itinerary',
        description: 'Test Description',
        startDate,
        endDate,
        userId: user.id,
      },
    });

    // Create a test item
    const item = await prisma.item.create({
      data: {
        name: 'Test Item',
        description: 'Test Item Description',
        date: startDate,
        location: 'Test Location',
        itineraryId: itinerary.id,
        categoryId: category.id,
      },
    });

    // Create a test cost
    const cost = await prisma.cost.create({
      data: {
        amount: 100.0,
        currency: 'USD',
        itemId: item.id,
      },
    });

    // Retrieve the itinerary with items and costs
    const retrievedItinerary = await prisma.itinerary.findUnique({
      where: {
        id: itinerary.id,
      },
      include: {
        items: {
          include: {
            cost: true,
            category: true,
          },
        },
      },
    });

    // Assertions
    expect(retrievedItinerary).toBeDefined();
    expect(retrievedItinerary?.title).toBe('Test Itinerary');
    expect(retrievedItinerary?.items).toHaveLength(1);
    expect(retrievedItinerary?.items[0].name).toBe('Test Item');
    expect(retrievedItinerary?.items[0].cost?.amount).toBe(100.0);
    expect(retrievedItinerary?.items[0].category.name).toBe(category.name);

    // Clean up
    await prisma.cost.delete({
      where: {
        id: cost.id,
      },
    });
    
    await prisma.item.delete({
      where: {
        id: item.id,
      },
    });
    
    await prisma.itinerary.delete({
      where: {
        id: itinerary.id,
      },
    });
    
    await prisma.category.delete({
      where: {
        id: category.id,
      },
    });
    
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  });
});
