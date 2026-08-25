const mongoose = require('mongoose');

const uri = "mongodb+srv://balusiva1299:Siva2312@cluster0.avjoegu.mongodb.net/srianvaya_db?retryWrites=true&w=majority";

async function run() {
  try {
    console.log("Connecting to MongoDB Atlas Cluster0...");
    await mongoose.connect(uri);
    console.log("Connected successfully!");

    const db = mongoose.connection.db;

    // 1. Create 'users' collection with initial record
    console.log("Creating collections in srianvaya_db...");
    await db.collection('users').updateOne(
      { email: 'admin@srianvaya.com' },
      {
        $set: {
          email: 'admin@srianvaya.com',
          fullName: 'Sri Anvaya Administrator',
          roles: ['SUPER_ADMIN', 'ADMIN'],
          isActive: true,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    // 2. Create 'plans' collection
    await db.collection('plans').updateOne(
      { code: 'STANDARD' },
      {
        $set: {
          code: 'STANDARD',
          name: 'Standard 360',
          monthlyPrice: 1500,
          annualPrice: 18000,
          description: 'Complete 4-member Vedic team dispatch & Samagri kit',
          isActive: true,
          isRecommended: true,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    // 3. Create 'pitru_records' collection
    await db.collection('pitru_records').updateOne(
      { pitruName: 'Late Sri V. Subramania Sharma' },
      {
        $set: {
          pitruName: 'Late Sri V. Subramania Sharma',
          relationship: 'Father',
          calendarType: 'Chandramana',
          masa: 'Bhadrapada',
          paksha: 'Krishna Paksha (Mahalaya)',
          tithi: 'Navami',
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    // 4. Create 'events' collection
    await db.collection('events').updateOne(
      { title: 'Annual Sradham - Late Sri V. Subramania Sharma' },
      {
        $set: {
          title: 'Annual Sradham - Late Sri V. Subramania Sharma',
          status: 'PLANNING',
          location: { city: 'Chennai', venueType: 'HOME' },
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    // 5. Create 'system_settings' collection
    await db.collection('system_settings').updateOne(
      { key: 'storage_provider' },
      {
        $set: {
          key: 'storage_provider',
          value: 'cloudinary',
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log(">> Successfully written collections to database 'srianvaya_db' on MongoDB Atlas! <<");
    const collections = await db.listCollections().toArray();
    console.log("Existing collections in srianvaya_db:", collections.map(c => c.name));

    await mongoose.disconnect();
    console.log("Done!");
  } catch (err) {
    console.error("Error connecting to Atlas:", err.message);
  }
}

run();
