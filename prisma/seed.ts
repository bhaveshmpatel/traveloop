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
    prisma.city.upsert({ where: { name_country: { name: "Tokyo", country: "Japan" } }, update: {}, create: { name: "Tokyo", country: "Japan", region: "Asia", costIndex: 4, popularity: 95, description: "A dazzling metropolis blending ultramodern and traditional culture.", imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Bali", country: "Indonesia" } }, update: {}, create: { name: "Bali", country: "Indonesia", region: "Asia", costIndex: 2, popularity: 92, description: "Island of the Gods with lush terraces, temples, and beaches.", imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Bangkok", country: "Thailand" } }, update: {}, create: { name: "Bangkok", country: "Thailand", region: "Asia", costIndex: 2, popularity: 88, description: "Vibrant street life, ornate temples, and legendary food scene.", imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Singapore", country: "Singapore" } }, update: {}, create: { name: "Singapore", country: "Singapore", region: "Asia", costIndex: 4, popularity: 85, description: "A futuristic city-state with world-class dining and gardens.", imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Mumbai", country: "India" } }, update: {}, create: { name: "Mumbai", country: "India", region: "Asia", costIndex: 2, popularity: 78, description: "The city of dreams — Bollywood, street food, and colonial architecture.", imageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Kyoto", country: "Japan" } }, update: {}, create: { name: "Kyoto", country: "Japan", region: "Asia", costIndex: 4, popularity: 88, description: "Ancient capital with thousands of temples and traditional gardens.", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Seoul", country: "South Korea" } }, update: {}, create: { name: "Seoul", country: "South Korea", region: "Asia", costIndex: 3, popularity: 84, description: "K-pop capital with palaces, nightlife, and incredible street food.", imageUrl: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Hanoi", country: "Vietnam" } }, update: {}, create: { name: "Hanoi", country: "Vietnam", region: "Asia", costIndex: 1, popularity: 76, description: "Charming old quarter, pho kitchens, and French colonial elegance.", imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80" } }),
    // Europe
    prisma.city.upsert({ where: { name_country: { name: "Santorini", country: "Greece" } }, update: {}, create: { name: "Santorini", country: "Greece", region: "Europe", costIndex: 4, popularity: 94, description: "Iconic white-washed buildings and breathtaking Aegean sunsets.", imageUrl: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Paris", country: "France" } }, update: {}, create: { name: "Paris", country: "France", region: "Europe", costIndex: 5, popularity: 97, description: "The City of Light — art, fashion, cuisine, and the Eiffel Tower.", imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Barcelona", country: "Spain" } }, update: {}, create: { name: "Barcelona", country: "Spain", region: "Europe", costIndex: 3, popularity: 91, description: "Gaudí's masterpieces, tapas bars, and Mediterranean beaches.", imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Rome", country: "Italy" } }, update: {}, create: { name: "Rome", country: "Italy", region: "Europe", costIndex: 3, popularity: 93, description: "The Eternal City — Colosseum, Vatican, and the best pasta on earth.", imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Amsterdam", country: "Netherlands" } }, update: {}, create: { name: "Amsterdam", country: "Netherlands", region: "Europe", costIndex: 4, popularity: 86, description: "Canals, museums, cycling culture, and vibrant nightlife.", imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "London", country: "United Kingdom" } }, update: {}, create: { name: "London", country: "United Kingdom", region: "Europe", costIndex: 5, popularity: 96, description: "Historic landmarks, world-class museums, and multicultural energy.", imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Zurich", country: "Switzerland" } }, update: {}, create: { name: "Zurich", country: "Switzerland", region: "Europe", costIndex: 5, popularity: 80, description: "Alpine beauty, pristine lakes, and luxury shopping.", imageUrl: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Prague", country: "Czech Republic" } }, update: {}, create: { name: "Prague", country: "Czech Republic", region: "Europe", costIndex: 2, popularity: 84, description: "Fairy-tale architecture, beer culture, and affordable charm.", imageUrl: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Istanbul", country: "Turkey" } }, update: {}, create: { name: "Istanbul", country: "Turkey", region: "Europe", costIndex: 2, popularity: 87, description: "Where East meets West — bazaars, mosques, and Bosphorus views.", imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80" } }),
    // Americas
    prisma.city.upsert({ where: { name_country: { name: "New York", country: "United States" } }, update: {}, create: { name: "New York", country: "United States", region: "Americas", costIndex: 5, popularity: 98, description: "The city that never sleeps — Broadway, Central Park, and pizza.", imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Cancún", country: "Mexico" } }, update: {}, create: { name: "Cancún", country: "Mexico", region: "Americas", costIndex: 3, popularity: 85, description: "Crystal-clear Caribbean waters and ancient Mayan ruins.", imageUrl: "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Rio de Janeiro", country: "Brazil" } }, update: {}, create: { name: "Rio de Janeiro", country: "Brazil", region: "Americas", costIndex: 3, popularity: 89, description: "Carnival, Christ the Redeemer, and Copacabana Beach.", imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Buenos Aires", country: "Argentina" } }, update: {}, create: { name: "Buenos Aires", country: "Argentina", region: "Americas", costIndex: 2, popularity: 82, description: "Tango, steak, colorful La Boca, and European-style architecture.", imageUrl: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "San Francisco", country: "United States" } }, update: {}, create: { name: "San Francisco", country: "United States", region: "Americas", costIndex: 5, popularity: 83, description: "Golden Gate, tech culture, Alcatraz, and fog-wrapped hills.", imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80" } }),
    // Africa
    prisma.city.upsert({ where: { name_country: { name: "Cape Town", country: "South Africa" } }, update: {}, create: { name: "Cape Town", country: "South Africa", region: "Africa", costIndex: 2, popularity: 86, description: "Table Mountain, stunning coastline, and world-class vineyards.", imageUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Marrakech", country: "Morocco" } }, update: {}, create: { name: "Marrakech", country: "Morocco", region: "Africa", costIndex: 2, popularity: 83, description: "Vibrant souks, riad stays, and Sahara desert gateway.", imageUrl: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Nairobi", country: "Kenya" } }, update: {}, create: { name: "Nairobi", country: "Kenya", region: "Africa", costIndex: 2, popularity: 74, description: "Safari gateway with vibrant culture and national parks.", imageUrl: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&q=80" } }),
    // Oceania
    prisma.city.upsert({ where: { name_country: { name: "Sydney", country: "Australia" } }, update: {}, create: { name: "Sydney", country: "Australia", region: "Oceania", costIndex: 4, popularity: 90, description: "Opera House, harbour bridges, and golden beaches.", imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Queenstown", country: "New Zealand" } }, update: {}, create: { name: "Queenstown", country: "New Zealand", region: "Oceania", costIndex: 4, popularity: 81, description: "Adventure capital with bungee jumping and Lord of the Rings scenery.", imageUrl: "https://images.unsplash.com/photo-1589871973318-9ca1258faa5d?w=800&q=80" } }),
    // Middle East
    prisma.city.upsert({ where: { name_country: { name: "Dubai", country: "UAE" } }, update: {}, create: { name: "Dubai", country: "UAE", region: "Middle East", costIndex: 4, popularity: 93, description: "Futuristic skyline, luxury shopping, and desert adventures.", imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80" } }),
    prisma.city.upsert({ where: { name_country: { name: "Petra", country: "Jordan" } }, update: {}, create: { name: "Petra", country: "Jordan", region: "Middle East", costIndex: 2, popularity: 79, description: "Ancient rose-red city carved into cliff faces — a world wonder.", imageUrl: "https://images.unsplash.com/photo-1579606032821-4e6161c81571?w=800&q=80" } }),
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
    { cityName: "Marrakech", name: "Moroccan Cooking Class", type: "FOOD" as const, description: "Learn tagine, couscous, and mint tea preparation.", cost: 40, duration: 3 },
    // Singapore
    { cityName: "Singapore", name: "Gardens by the Bay", type: "NATURE" as const, description: "Futuristic Supertree Grove and Cloud Forest dome.", cost: 20, duration: 3 },
    { cityName: "Singapore", name: "Hawker Centre Food Trail", type: "FOOD" as const, description: "Chilli crab, laksa, and Hainanese chicken rice.", cost: 15, duration: 3 },
    { cityName: "Singapore", name: "Marina Bay Sands SkyPark", type: "SIGHTSEEING" as const, description: "Iconic rooftop with infinity pool views.", cost: 25, duration: 2 },
    { cityName: "Singapore", name: "Sentosa Island", type: "ADVENTURE" as const, description: "Beach, Universal Studios, and luge rides.", cost: 50, duration: 6 },
    // Mumbai
    { cityName: "Mumbai", name: "Gateway of India & Colaba", type: "SIGHTSEEING" as const, description: "Iconic waterfront arch and vibrant market district.", cost: 0, duration: 2 },
    { cityName: "Mumbai", name: "Mumbai Street Food Tour", type: "FOOD" as const, description: "Vada pav, pav bhaji, pani puri, and more.", cost: 15, duration: 3 },
    { cityName: "Mumbai", name: "Bollywood Studio Tour", type: "CULTURE" as const, description: "Behind-the-scenes look at Film City.", cost: 25, duration: 4 },
    { cityName: "Mumbai", name: "Elephanta Caves", type: "CULTURE" as const, description: "Ancient rock-cut Hindu temples on an island.", cost: 10, duration: 4 },
    // Kyoto
    { cityName: "Kyoto", name: "Fushimi Inari Shrine", type: "CULTURE" as const, description: "Thousands of vermillion torii gates up the mountain.", cost: 0, duration: 3 },
    { cityName: "Kyoto", name: "Arashiyama Bamboo Grove", type: "NATURE" as const, description: "Ethereal bamboo forest with monkey park.", cost: 0, duration: 3 },
    { cityName: "Kyoto", name: "Traditional Tea Ceremony", type: "CULTURE" as const, description: "Authentic matcha ceremony in a historic teahouse.", cost: 30, duration: 1.5 },
    { cityName: "Kyoto", name: "Kaiseki Dining Experience", type: "FOOD" as const, description: "Multi-course traditional Japanese haute cuisine.", cost: 80, duration: 2 },
    // Seoul
    { cityName: "Seoul", name: "Gyeongbokgung Palace", type: "CULTURE" as const, description: "Grand Joseon-era palace with guard changing ceremony.", cost: 3, duration: 3 },
    { cityName: "Seoul", name: "Myeongdong Street Food", type: "FOOD" as const, description: "Korean fried chicken, tteokbokki, and hotteok.", cost: 15, duration: 2 },
    { cityName: "Seoul", name: "N Seoul Tower", type: "SIGHTSEEING" as const, description: "Panoramic city views from Namsan Mountain.", cost: 12, duration: 2 },
    { cityName: "Seoul", name: "Bukchon Hanok Village", type: "CULTURE" as const, description: "Traditional Korean houses between two palaces.", cost: 0, duration: 2 },
    // Hanoi
    { cityName: "Hanoi", name: "Old Quarter Walking Tour", type: "SIGHTSEEING" as const, description: "36 ancient streets filled with shops and temples.", cost: 0, duration: 3 },
    { cityName: "Hanoi", name: "Pho & Bun Cha Tasting", type: "FOOD" as const, description: "Vietnam's most iconic noodle soups and grilled pork.", cost: 10, duration: 2 },
    { cityName: "Hanoi", name: "Ha Long Bay Day Trip", type: "ADVENTURE" as const, description: "Cruise through limestone karsts and emerald waters.", cost: 65, duration: 10 },
    { cityName: "Hanoi", name: "Water Puppet Show", type: "CULTURE" as const, description: "Traditional Vietnamese puppetry on water stage.", cost: 5, duration: 1 },
    // London
    { cityName: "London", name: "Tower of London", type: "CULTURE" as const, description: "Historic castle with Crown Jewels exhibition.", cost: 35, duration: 3 },
    { cityName: "London", name: "British Museum", type: "CULTURE" as const, description: "World-class collection spanning 2 million years.", cost: 0, duration: 4 },
    { cityName: "London", name: "Borough Market Food Tour", type: "FOOD" as const, description: "London's oldest food market with artisan vendors.", cost: 30, duration: 3 },
    { cityName: "London", name: "London Eye", type: "SIGHTSEEING" as const, description: "Giant observation wheel on the Thames.", cost: 30, duration: 1.5 },
    { cityName: "London", name: "West End Theatre Show", type: "CULTURE" as const, description: "World-famous musical theatre district.", cost: 80, duration: 3 },
    // Amsterdam
    { cityName: "Amsterdam", name: "Anne Frank House", type: "CULTURE" as const, description: "Moving museum in the famous WWII hiding place.", cost: 16, duration: 2 },
    { cityName: "Amsterdam", name: "Van Gogh Museum", type: "CULTURE" as const, description: "World's largest Van Gogh collection.", cost: 20, duration: 3 },
    { cityName: "Amsterdam", name: "Canal Cruise", type: "SIGHTSEEING" as const, description: "Glide through UNESCO-listed canals.", cost: 18, duration: 1.5 },
    { cityName: "Amsterdam", name: "Jordaan Food Walk", type: "FOOD" as const, description: "Dutch cheese, stroopwafels, and herring tasting.", cost: 35, duration: 3 },
    // Zurich
    { cityName: "Zurich", name: "Old Town (Altstadt) Walk", type: "SIGHTSEEING" as const, description: "Medieval lanes, churches, and lakefront views.", cost: 0, duration: 2 },
    { cityName: "Zurich", name: "Swiss Chocolate Tasting", type: "FOOD" as const, description: "Premium Swiss chocolate factory and tasting tour.", cost: 30, duration: 2 },
    { cityName: "Zurich", name: "Lake Zurich Cruise", type: "NATURE" as const, description: "Scenic boat ride with Alpine panoramas.", cost: 25, duration: 2 },
    // Prague
    { cityName: "Prague", name: "Prague Castle", type: "CULTURE" as const, description: "Largest ancient castle complex in the world.", cost: 15, duration: 3 },
    { cityName: "Prague", name: "Charles Bridge Walk", type: "SIGHTSEEING" as const, description: "Iconic Gothic bridge with 30 Baroque statues.", cost: 0, duration: 1 },
    { cityName: "Prague", name: "Czech Beer Tasting", type: "FOOD" as const, description: "Sample pilsners and craft brews in historic pubs.", cost: 20, duration: 3 },
    { cityName: "Prague", name: "Old Town Square", type: "SIGHTSEEING" as const, description: "Astronomical clock and stunning medieval architecture.", cost: 0, duration: 2 },
    // Istanbul
    { cityName: "Istanbul", name: "Hagia Sophia", type: "CULTURE" as const, description: "1,500-year-old architectural masterpiece.", cost: 25, duration: 2 },
    { cityName: "Istanbul", name: "Grand Bazaar Shopping", type: "SHOPPING" as const, description: "4,000+ shops in one of world's oldest markets.", cost: 0, duration: 3 },
    { cityName: "Istanbul", name: "Bosphorus Cruise", type: "SIGHTSEEING" as const, description: "Sail between Europe and Asia.", cost: 15, duration: 2 },
    { cityName: "Istanbul", name: "Turkish Breakfast Feast", type: "FOOD" as const, description: "Elaborate spread of cheese, eggs, simit, and tea.", cost: 15, duration: 2 },
    // Cancún
    { cityName: "Cancún", name: "Chichén Itzá Day Trip", type: "CULTURE" as const, description: "Ancient Mayan pyramid — one of the New Seven Wonders.", cost: 60, duration: 10 },
    { cityName: "Cancún", name: "Snorkeling in Cenotes", type: "ADVENTURE" as const, description: "Swim in crystal-clear underground sinkholes.", cost: 40, duration: 4 },
    { cityName: "Cancún", name: "Tacos & Ceviche Tour", type: "FOOD" as const, description: "Authentic Yucatecan flavors and seafood.", cost: 25, duration: 3 },
    // Rio de Janeiro
    { cityName: "Rio de Janeiro", name: "Christ the Redeemer", type: "SIGHTSEEING" as const, description: "Iconic statue atop Corcovado mountain.", cost: 20, duration: 3 },
    { cityName: "Rio de Janeiro", name: "Copacabana & Ipanema", type: "NATURE" as const, description: "World-famous beaches with vibrant atmosphere.", cost: 0, duration: 4 },
    { cityName: "Rio de Janeiro", name: "Sugarloaf Cable Car", type: "SIGHTSEEING" as const, description: "Cable car ride with panoramic bay views.", cost: 25, duration: 2 },
    { cityName: "Rio de Janeiro", name: "Feijoada Cooking Class", type: "FOOD" as const, description: "Learn Brazil's national black bean stew.", cost: 35, duration: 3 },
    // Buenos Aires
    { cityName: "Buenos Aires", name: "Tango Show & Dinner", type: "CULTURE" as const, description: "Authentic tango performance with Argentine cuisine.", cost: 60, duration: 3 },
    { cityName: "Buenos Aires", name: "La Boca Neighborhood", type: "SIGHTSEEING" as const, description: "Colorful Caminito street and football culture.", cost: 0, duration: 2 },
    { cityName: "Buenos Aires", name: "Asado (BBQ) Experience", type: "FOOD" as const, description: "Argentine grill master steak experience.", cost: 40, duration: 3 },
    // San Francisco
    { cityName: "San Francisco", name: "Golden Gate Bridge Walk", type: "SIGHTSEEING" as const, description: "Walk across the iconic 1.7-mile suspension bridge.", cost: 0, duration: 2 },
    { cityName: "San Francisco", name: "Alcatraz Island Tour", type: "CULTURE" as const, description: "Visit the infamous former federal prison.", cost: 40, duration: 3 },
    { cityName: "San Francisco", name: "Fisherman's Wharf", type: "FOOD" as const, description: "Clam chowder, sourdough bread, and sea lions.", cost: 25, duration: 3 },
    // Nairobi
    { cityName: "Nairobi", name: "Nairobi National Park Safari", type: "ADVENTURE" as const, description: "See lions and rhinos with city skyline backdrop.", cost: 50, duration: 4 },
    { cityName: "Nairobi", name: "Giraffe Centre", type: "NATURE" as const, description: "Hand-feed endangered Rothschild giraffes.", cost: 15, duration: 2 },
    { cityName: "Nairobi", name: "Karen Blixen Museum", type: "CULTURE" as const, description: "Home of 'Out of Africa' author.", cost: 10, duration: 2 },
    // Queenstown
    { cityName: "Queenstown", name: "Bungee Jumping", type: "ADVENTURE" as const, description: "Kawarau Bridge — birthplace of commercial bungee.", cost: 150, duration: 2 },
    { cityName: "Queenstown", name: "Milford Sound Cruise", type: "NATURE" as const, description: "Stunning fjord cruise through Fiordland.", cost: 80, duration: 8 },
    { cityName: "Queenstown", name: "Skyline Gondola & Luge", type: "ADVENTURE" as const, description: "Gondola ride and luge track with mountain views.", cost: 45, duration: 3 },
    // Petra
    { cityName: "Petra", name: "The Treasury (Al-Khazneh)", type: "CULTURE" as const, description: "Walk through the Siq to the rose-red carved facade.", cost: 50, duration: 4 },
    { cityName: "Petra", name: "Monastery Hike", type: "ADVENTURE" as const, description: "800+ steps to the massive carved monastery.", cost: 0, duration: 3 },
    { cityName: "Petra", name: "Petra by Night", type: "CULTURE" as const, description: "Candlelit walk through the Siq to illuminated Treasury.", cost: 17, duration: 2 },
    // Dubai extras
    { cityName: "Dubai", name: "Old Dubai & Spice Souk", type: "CULTURE" as const, description: "Traditional souks and abra rides across Dubai Creek.", cost: 5, duration: 3 },
    { cityName: "Dubai", name: "Dubai Frame", type: "SIGHTSEEING" as const, description: "150m picture-frame structure with glass floor walkway.", cost: 15, duration: 1.5 },
  ];

  let activityCount = 0;
  for (const act of activitiesData) {
    const cityId = cityMap.get(act.cityName);
    if (cityId) {
      await prisma.activity.upsert({
        where: { name_cityId: { name: act.name, cityId } },
        update: {},
        create: {
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
