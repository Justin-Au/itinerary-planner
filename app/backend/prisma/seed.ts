import { PrismaClient } from '../src/generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.cost.deleteMany();
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding database...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Flights',
        icon: '✈️',
        color: '#4285F4',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Hotels',
        icon: '🏨',
        color: '#34A853',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Activities',
        icon: '🏄‍♂️',
        color: '#FBBC05',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Restaurants',
        icon: '🍽️',
        color: '#EA4335',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Transportation',
        icon: '🚕',
        color: '#9C27B0',
      },
    }),
  ]);

  console.log('Created categories');

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  });

  console.log('Created test user');

  // Create a sample itinerary
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 7); // Trip starts in a week
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 5); // 5-day trip

  const itinerary = await prisma.itinerary.create({
    data: {
      title: 'Tokyo Adventure',
      description: 'Exploring the vibrant city of Tokyo',
      startDate,
      endDate,
      userId: user.id,
    },
  });

  console.log('Created sample itinerary');

  // Create sample items
  const day1 = new Date(startDate);
  const day2 = new Date(startDate);
  day2.setDate(day1.getDate() + 1);
  const day3 = new Date(startDate);
  day3.setDate(day1.getDate() + 2);

  // Flight to Tokyo
  const flight = await prisma.item.create({
    data: {
      name: 'Flight to Tokyo',
      description: 'JL123 - Economy Class',
      date: day1,
      startTime: new Date(day1.setHours(10, 0, 0, 0)),
      endTime: new Date(day1.setHours(14, 30, 0, 0)),
      location: 'Narita International Airport',
      itineraryId: itinerary.id,
      categoryId: categories[0].id, // Flights
    },
  });

  // Add cost for the flight
  await prisma.cost.create({
    data: {
      amount: 850.00,
      currency: 'USD',
      itemId: flight.id,
    },
  });

  // Hotel in Tokyo
  const hotel = await prisma.item.create({
    data: {
      name: 'Shinjuku Grand Hotel',
      description: 'Deluxe Room - 2 Queen Beds',
      date: day1,
      startTime: new Date(day1.setHours(15, 0, 0, 0)),
      endTime: new Date(day3.setHours(11, 0, 0, 0)),
      location: '1-1-1 Shinjuku, Tokyo',
      notes: 'Confirmation #: ABC123',
      itineraryId: itinerary.id,
      categoryId: categories[1].id, // Hotels
    },
  });

  // Add cost for the hotel
  await prisma.cost.create({
    data: {
      amount: 450.00,
      currency: 'USD',
      itemId: hotel.id,
    },
  });

  // Tokyo Tower Visit
  const activity = await prisma.item.create({
    data: {
      name: 'Tokyo Tower Visit',
      description: 'Visit the iconic Tokyo Tower',
      date: day2,
      startTime: new Date(day2.setHours(13, 0, 0, 0)),
      endTime: new Date(day2.setHours(16, 0, 0, 0)),
      location: '4 Chome-2-8 Shibakoen, Minato City, Tokyo',
      itineraryId: itinerary.id,
      categoryId: categories[2].id, // Activities
    },
  });

  // Add cost for the activity
  await prisma.cost.create({
    data: {
      amount: 25.00,
      currency: 'USD',
      itemId: activity.id,
    },
  });

  // Dinner at a restaurant
  const restaurant = await prisma.item.create({
    data: {
      name: 'Sushi Saito',
      description: 'Michelin-starred sushi restaurant',
      date: day2,
      startTime: new Date(day2.setHours(19, 0, 0, 0)),
      endTime: new Date(day2.setHours(21, 0, 0, 0)),
      location: 'Ark Hills South Tower, Roppongi',
      notes: 'Reservation under Test User',
      itineraryId: itinerary.id,
      categoryId: categories[3].id, // Restaurants
    },
  });

  // Add cost for the restaurant
  await prisma.cost.create({
    data: {
      amount: 200.00,
      currency: 'USD',
      itemId: restaurant.id,
    },
  });

  // Transportation - Taxi
  const taxi = await prisma.item.create({
    data: {
      name: 'Taxi to Restaurant',
      description: 'Taxi from hotel to Sushi Saito',
      date: day2,
      startTime: new Date(day2.setHours(18, 30, 0, 0)),
      endTime: new Date(day2.setHours(19, 0, 0, 0)),
      location: 'Shinjuku to Roppongi',
      itineraryId: itinerary.id,
      categoryId: categories[4].id, // Transportation
    },
  });

  // Add cost for the taxi
  await prisma.cost.create({
    data: {
      amount: 30.00,
      currency: 'USD',
      itemId: taxi.id,
    },
  });

  console.log('Created sample items with costs');
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
