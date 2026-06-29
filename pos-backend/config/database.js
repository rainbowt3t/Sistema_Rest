const mongoose = require("mongoose");
const config = require("./config");
const seedDatabase = require("./seeder");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.databaseURI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        // Run database seeding
        await seedDatabase();
    } catch (error) {
        console.log(`❌ Database connection failed: ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB;