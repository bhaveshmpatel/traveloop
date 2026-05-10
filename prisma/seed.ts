import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌍 Seeding cities...");

  const cities = await Promise.all([
    // Asia
    prisma.city.upsert({ where: { name_country: { name: "Tokyo", country: "Japan" } }, update: {}, create: { name: "Tokyo", country: "Japan", region: "Asia", costIndex: 4, popularity: 95, description: "A dazzling metropolis blending ultramodern and traditional culture.", imageUrl: "/images/destination-tokyo.png" } }),
    prisma.city.upsert({ where: { name_country: { name: "Bali", country: "Indonesia" } }, update: {}, create: { name: "Bali", country: "Indonesia", region: "Asia", costIndex: 2, popularity: 92, description: "Island of the Gods with lush terraces, temples, and beaches.", imageUrl: "/images/destination-bali.png" } }),
    prisma.city.upsert({ where: { name_country: { name: "Bangkok", country: "Thailand" } }, update: {}, create: { name: "Bangkok", country: "Thailand", region: "Asia", costIndex: 2, popularity: 88, description: "Vibrant street life, ornate temples, and legendary food scene." } }),
    prisma.city.upsert({ where: { name_country: { name: "Singapore", country: "Singapore" } }, update: {}, create: { name: "Singapore", country: "Singapore", region: "Asia", costIndex: 4, popularity: 85, description: "A futuristic city-state with world-class dining and gardens." } }),
    prisma.city.upsert({ where: { name_country: { name: "Mumbai", country: "India" } }, update: {}, create: { name: "Mumbai", country: "India", region: "Asia", costIndex: 2, popularity: 78, description: "The city of dreams — Bollywood, street food, and colonial architecture." } }),
    prisma.city.upsert({ where: { name_country: { name: "Kyoto", country: "Japan" } }, update: {}, create: { name: "Kyoto", country: "Japan", region: "Asia", costIndex: 4, popularity: 88, description: "Ancient capital with thousands of temples and traditional gardens." } }),
    prisma.city.upsert({ where: { name_country: { name: "Seoul", country: "South Korea" } }, update: {}, create: { name: "Seoul", country: "South Korea", region: "Asia", costIndex: 3, popularity: 84, description: "K-pop capital with palaces, nightlife, and incredible street food." } }),
    prisma.city.upsert({ where: { name_country: { name: "Hanoi", country: "Vietnam" } }, update: {}, create: { name: "Hanoi", country: "Vietnam", region: "Asia", costIndex: 1, popularity: 76, description: "Charming old quarter, pho kitchens, and French colonial elegance." } }),
    // Europe
    prisma.city.upsert({ where: { name_country: { name: "Santorini", country: "Greece" } }, update: {}, create: { name: "Santorini", country: "Greece", region: "Europe", costIndex: 4, popularity: 94, description: "Iconic white-washed buildings and breathtaking Aegean sunsets.", imageUrl: "/images/hero-santorini.png" } }),
    prisma.city.upsert({ where: { name_country: { name: "Paris", country: "France" } }, update: {}, create: { name: "Paris", country: "France", region: "Europe", costIndex: 5, popularity: 97, description: "The City of Light — art, fashion, cuisine, and the Eiffel Tower." } }),
    prisma.city.upsert({ where: { name_country: { name: "Barcelona", country: "Spain" } }, update: {}, create: { name: "Barcelona", country: "Spain", region: "Europe", costIndex: 3, popularity: 91, description: "Gaudí's masterpieces, tapas bars, and Mediterranean beaches." } }),
    prisma.city.upsert({ where: { name_country: { name: "Rome", country: "Italy" } }, update: {}, create: { name: "Rome", country: "Italy", region: "Europe", costIndex: 3, popularity: 93, description: "The Eternal City — Colosseum, Vatican, and the best pasta on earth." } }),
    prisma.city.upsert({ where: { name_country: { name: "Amsterdam", country: "Netherlands" } }, update: {}, create: { name: "Amsterdam", country: "Netherlands", region: "Europe", costIndex: 4, popularity: 86, description: "Canals, museums, cycling culture, and vibrant nightlife." } }),
    prisma.city.upsert({ where: { name_country: { name: "London", country: "United Kingdom" } }, update: {}, create: { name: "London", country: "United Kingdom", region: "Europe", costIndex: 5, popularity: 96, description: "Historic landmarks, world-class museums, and multicultural energy." } }),
    prisma.city.upsert({ where: { name_country: { name: "Zurich", country: "Switzerland" } }, update: {}, create: { name: "Zurich", country: "Switzerland", region: "Europe", costIndex: 5, popularity: 80, description: "Alpine beauty, pristine lakes, and luxury shopping.", imageUrl: "/images/destination-swiss.png" } }),
    prisma.city.upsert({ where: { name_country: { name: "Prague", country: "Czech Republic" } }, update: {}, create: { name: "Prague", country: "Czech Republic", region: "Europe", costIndex: 2, popularity: 84, description: "Fairy-tale architecture, beer culture, and affordable charm." } }),
    prisma.city.upsert({ where: { name_country: { name: "Istanbul", country: "Turkey" } }, update: {}, create: { name: "Istanbul", country: "Turkey", region: "Europe", costIndex: 2, popularity: 87, description: "Where East meets West — bazaars, mosques, and Bosphorus views." } }),
    // Americas
    prisma.city.upsert({ where: { name_country: { name: "New York", country: "United States" } }, update: {}, create: { name: "New York", country: "United States", region: "Americas", costIndex: 5, popularity: 98, description: "The city that never sleeps — Broadway, Central Park, and pizza." } }),
    prisma.city.upsert({ where: { name_country: { name: "Cancún", country: "Mexico" } }, update: {}, create: { name: "Cancún", country: "Mexico", region: "Americas", costIndex: 3, popularity: 85, description: "Crystal-clear Caribbean waters and ancient Mayan ruins." } }),
    prisma.city.upsert({ where: { name_country: { name: "Rio de Janeiro", country: "Brazil" } }, update: {}, create: { name: "Rio de Janeiro", country: "Brazil", region: "Americas", costIndex: 3, popularity: 89, description: "Carnival, Christ the Redeemer, and Copacabana Beach." } }),
    prisma.city.upsert({ where: { name_country: { name: "Buenos Aires", country: "Argentina" } }, update: {}, create: { name: "Buenos Aires", country: "Argentina", region: "Americas", costIndex: 2, popularity: 82, description: "Tango, steak, colorful La Boca, and European-style architecture." } }),
    prisma.city.upsert({ where: { name_country: { name: "San Francisco", country: "United States" } }, update: {}, create: { name: "San Francisco", country: "United States", region: "Americas", costIndex: 5, popularity: 83, description: "Golden Gate, tech culture, Alcatraz, and fog-wrapped hills." } }),
    // Africa
    prisma.city.upsert({ where: { name_country: { name: "Cape Town", country: "South Africa" } }, update: {}, create: { name: "Cape Town", country: "South Africa", region: "Africa", costIndex: 2, popularity: 86, description: "Table Mountain, stunning coastline, and world-class vineyards." } }),
    prisma.city.upsert({ where: { name_country: { name: "Marrakech", country: "Morocco" } }, update: {}, create: { name: "Marrakech", country: "Morocco", region: "Africa", costIndex: 2, popularity: 83, description: "Vibrant souks, riad stays, and Sahara desert gateway." } }),
    prisma.city.upsert({ where: { name_country: { name: "Nairobi", country: "Kenya" } }, update: {}, create: { name: "Nairobi", country: "Kenya", region: "Africa", costIndex: 2, popularity: 74, description: "Safari gateway with vibrant culture and national parks." } }),
    // Oceania
    prisma.city.upsert({ where: { name_country: { name: "Sydney", country: "Australia" } }, update: {}, create: { name: "Sydney", country: "Australia", region: "Oceania", costIndex: 4, popularity: 90, description: "Opera House, harbour bridges, and golden beaches." } }),
    prisma.city.upsert({ where: { name_country: { name: "Queenstown", country: "New Zealand" } }, update: {}, create: { name: "Queenstown", country: "New Zealand", region: "Oceania", costIndex: 4, popularity: 81, description: "Adventure capital with bungee jumping and Lord of the Rings scenery." } }),
    // Middle East
    prisma.city.upsert({ where: { name_country: { name: "Dubai", country: "UAE" } }, update: {}, create: { name: "Dubai", country: "UAE", region: "Middle East", costIndex: 4, popularity: 93, description: "Futuristic skyline, luxury shopping, and desert adventures." } }),
    prisma.city.upsert({ where: { name_country: { name: "Petra", country: "Jordan" } }, update: {}, create: { name: "Petra", country: "Jordan", region: "Middle East", costIndex: 2, popularity: 79, description: "Ancient rose-red city carved into cliff faces — a world wonder." } }),
  ]);

  console.log(`✅ Seeded ${cities.length} cities`);

  // Seed activities for key cities
  console.log("🎯 Seeding activities...");

  const cityMap = new Map(cities.map((c) => [c.name, c.id]));

  const activitiesData = [
    // Tokyo
    { cityName: "Tokyo", name: "Visit Senso-ji Temple", type: "CULTURE" as const, description: "Tokyo's oldest temple in Asakusa with iconic Thunder Gate.", cost: 0, duration: 2 },
    { cityName: "Tokyo", name: "Tsukiji Outer Market Food Tour", type: "FOOD" as const, description: "Fresh sushi, tamagoyaki, and street food paradise.", cost: 30, duration: 3 },
    { cityName: "Tokyo", name: "Shibuya Crossing & Harajuku", type: "SIGHTSEEING" as const, description: "World's busiest crossing and quirky fashion district.", cost: 0, duration: 3 },
    { cityName: "Tokyo", name: "Tokyo Skytree Observation", type: "SIGHTSEEING" as const, description: "Panoramic views from the world's tallest tower.", cost: 25, duration: 2 },
    // Bali
    { cityName: "Bali", name: "Tegallalang Rice Terraces", type: "NATURE" as const, description: "Iconic cascading green rice paddies in Ubud.", cost: 5, duration: 3 },
    { cityName: "Bali", name: "Uluwatu Temple Sunset", type: "CULTURE" as const, description: "Cliff-top temple with Kecak fire dance at sunset.", cost: 10, duration: 3 },
    { cityName: "Bali", name: "Surfing at Kuta Beach", type: "ADVENTURE" as const, description: "Catch waves at Bali's most famous surf beach.", cost: 20, duration: 3 },
    { cityName: "Bali", name: "Balinese Cooking Class", type: "FOOD" as const, description: "Learn to make authentic Balinese dishes with local ingredients.", cost: 35, duration: 4 },
    // Paris
    { cityName: "Paris", name: "Eiffel Tower Visit", type: "SIGHTSEEING" as const, description: "Ascend the iconic iron tower for stunning city views.", cost: 30, duration: 3 },
    { cityName: "Paris", name: "Louvre Museum", type: "CULTURE" as const, description: "Home to the Mona Lisa and 380,000 artworks.", cost: 20, duration: 4 },
    { cityName: "Paris", name: "Seine River Cruise", type: "SIGHTSEEING" as const, description: "Glide past Notre-Dame, bridges, and riverside landmarks.", cost: 15, duration: 1.5 },
    { cityName: "Paris", name: "Montmartre & Sacré-Cœur", type: "CULTURE" as const, description: "Bohemian hilltop neighbourhood with stunning basilica.", cost: 0, duration: 3 },
    // Santorini
    { cityName: "Santorini", name: "Oia Sunset Watch", type: "SIGHTSEEING" as const, description: "The world's most famous sunset spot.", cost: 0, duration: 2 },
    { cityName: "Santorini", name: "Catamaran Sailing Trip", type: "ADVENTURE" as const, description: "Sail the caldera with swimming and BBQ on board.", cost: 120, duration: 5 },
    { cityName: "Santorini", name: "Wine Tasting Tour", type: "FOOD" as const, description: "Sample volcanic wines at hillside vineyards.", cost: 45, duration: 3 },
    // New York
    { cityName: "New York", name: "Statue of Liberty & Ellis Island", type: "SIGHTSEEING" as const, description: "Visit America's most iconic landmark.", cost: 25, duration: 4 },
    { cityName: "New York", name: "Broadway Show", type: "CULTURE" as const, description: "World-class theater in the heart of Manhattan.", cost: 120, duration: 3 },
    { cityName: "New York", name: "Central Park Walk", type: "NATURE" as const, description: "843 acres of green oasis in the middle of Manhattan.", cost: 0, duration: 3 },
    { cityName: "New York", name: "Pizza Walking Tour", type: "FOOD" as const, description: "Sample the best slices across Brooklyn and Manhattan.", cost: 45, duration: 3 },
    // Dubai
    { cityName: "Dubai", name: "Burj Khalifa At The Top", type: "SIGHTSEEING" as const, description: "Views from the world's tallest building.", cost: 45, duration: 2 },
    { cityName: "Dubai", name: "Desert Safari", type: "ADVENTURE" as const, description: "Dune bashing, camel riding, and BBQ under the stars.", cost: 65, duration: 6 },
    { cityName: "Dubai", name: "Dubai Mall & Aquarium", type: "SHOPPING" as const, description: "World's largest mall with an indoor aquarium.", cost: 35, duration: 4 },
    // Sydney
    { cityName: "Sydney", name: "Sydney Opera House Tour", type: "CULTURE" as const, description: "Guided tour of the iconic architectural masterpiece.", cost: 40, duration: 2 },
    { cityName: "Sydney", name: "Bondi to Coogee Walk", type: "NATURE" as const, description: "Stunning coastal walk past beaches and cliffs.", cost: 0, duration: 3 },
    { cityName: "Sydney", name: "Harbour Bridge Climb", type: "ADVENTURE" as const, description: "Climb to the top of the bridge for panoramic views.", cost: 180, duration: 3.5 },
    // Rome
    { cityName: "Rome", name: "Colosseum & Roman Forum", type: "CULTURE" as const, description: "Walk through 2,000 years of ancient Roman history.", cost: 18, duration: 3 },
    { cityName: "Rome", name: "Vatican Museums & Sistine Chapel", type: "CULTURE" as const, description: "Michelangelo's masterpiece and papal art collection.", cost: 20, duration: 4 },
    { cityName: "Rome", name: "Trastevere Food Walk", type: "FOOD" as const, description: "Authentic Roman cuisine in the charming old quarter.", cost: 50, duration: 3 },
    // Barcelona
    { cityName: "Barcelona", name: "Sagrada Família", type: "CULTURE" as const, description: "Gaudí's unfinished masterpiece basilica.", cost: 26, duration: 2 },
    { cityName: "Barcelona", name: "La Boqueria Market", type: "FOOD" as const, description: "Vibrant food market on Las Ramblas.", cost: 15, duration: 2 },
    { cityName: "Barcelona", name: "Park Güell", type: "SIGHTSEEING" as const, description: "Colorful mosaic park by Gaudí with city views.", cost: 10, duration: 2 },
    // Cape Town
    { cityName: "Cape Town", name: "Table Mountain Hike", type: "ADVENTURE" as const, description: "Hike or cable car to the iconic flat-topped mountain.", cost: 20, duration: 4 },
    { cityName: "Cape Town", name: "Cape Winelands Tour", type: "FOOD" as const, description: "Visit Stellenbosch and Franschhoek wine estates.", cost: 60, duration: 6 },
    // Bangkok
    { cityName: "Bangkok", name: "Grand Palace & Wat Phra Kaew", type: "CULTURE" as const, description: "Thailand's most sacred Buddhist temple.", cost: 15, duration: 3 },
    { cityName: "Bangkok", name: "Chatuchak Weekend Market", type: "SHOPPING" as const, description: "One of the world's largest outdoor markets.", cost: 0, duration: 4 },
    { cityName: "Bangkok", name: "Street Food Tour in Chinatown", type: "FOOD" as const, description: "Pad thai, mango sticky rice, and more.", cost: 20, duration: 3 },
    // Marrakech
    { cityName: "Marrakech", name: "Jemaa el-Fnaa Square", type: "CULTURE" as const, description: "Bustling main square with performers and food stalls.", cost: 0, duration: 3 },
    { cityName: "Marrakech", name: "Sahara Desert Excursion", type: "ADVENTURE" as const, description: "Overnight camel trek into the Sahara dunes.", cost: 80, duration: 24 },
  ];

  let activityCount = 0;
  for (const act of activitiesData) {
    const cityId = cityMap.get(act.cityName);
    if (cityId) {
      await prisma.activity.create({
        data: {
          cityId,
          name: act.name,
          type: act.type,
          description: act.description,
          cost: act.cost,
          duration: act.duration,
        },
      });
      activityCount++;
    }
  }

  console.log(`✅ Seeded ${activityCount} activities`);
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
