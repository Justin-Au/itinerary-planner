import { prisma } from '../src';

const prismaClient = prisma;

async function main() {
  // Clean up existing data
  await prismaClient.cost.deleteMany();
  await prismaClient.item.deleteMany();
  await prismaClient.category.deleteMany();
  await prismaClient.itinerary.deleteMany();
  await prismaClient.user.deleteMany();

  console.log('Seeding database...');

  // Create categories
  const categories = await Promise.all([
    prismaClient.category.create({
      data: {
        name: 'Flights',
        icon: '✈️',
        color: '#4285F4',
      },
    }),
    prismaClient.category.create({
      data: {
        name: 'Hotels',
        icon: '🏨',
        color: '#34A853',
      },
    }),
    prismaClient.category.create({
      data: {
        name: 'Activities',
        icon: '🏄‍♂️',
        color: '#FBBC05',
      },
    }),
    prismaClient.category.create({
      data: {
        name: 'Restaurants',
        icon: '🍽️',
        color: '#EA4335',
      },
    }),
    prismaClient.category.create({
      data: {
        name: 'Transportation',
        icon: '🚕',
        color: '#9C27B0',
      },
    }),
  ]);

  console.log('Created categories');

  // Create a test user
  // Use a simple hashed password for seeding instead of bcrypt
  const hashedPassword = 'password123_hashed'; // In production, you would use bcrypt
  const user = await prismaClient.user.create({
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

  const itinerary = await prismaClient.itinerary.create({
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
  const flight = await prismaClient.item.create({
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
  await prismaClient.cost.create({
    data: {
      amount: 850.00,
      currency: 'USD',
      itemId: flight.id,
    },
  });

  // Hotel in Tokyo
  const hotel = await prismaClient.item.create({
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
  await prismaClient.cost.create({
    data: {
      amount: 450.00,
      currency: 'USD',
      itemId: hotel.id,
    },
  });

  // Tokyo Tower Visit
  const activity = await prismaClient.item.create({
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
  await prismaClient.cost.create({
    data: {
      amount: 25.00,
      currency: 'USD',
      itemId: activity.id,
    },
  });

  // Dinner at a restaurant
  const restaurant = await prismaClient.item.create({
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
  await prismaClient.cost.create({
    data: {
      amount: 200.00,
      currency: 'USD',
      itemId: restaurant.id,
    },
  });

  // Transportation - Taxi
  const taxi = await prismaClient.item.create({
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
  await prismaClient.cost.create({
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
    await prismaClient.$disconnect();
  });
