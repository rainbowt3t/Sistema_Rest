const Table = require("../models/tableModel");
const User = require("../models/userModel");
const MenuItem = require("../models/menuItemModel");

const seedDatabase = async () => {
  try {
    // 1. Seed default user if none exists
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("🌱 No users found in database. Seeding default administrator...");
      
      const defaultAdmin = new User({
        name: "Administrador Restro",
        email: "admin@restro.com",
        phone: 9876543210, // Must be 10 digits
        password: "adminpassword123", // Will be automatically hashed by userModel pre-save hook
        role: "Admin"
      });
      
      await defaultAdmin.save();
      console.log("✅ Default administrator seeded successfully!");
      console.log("📧 Email: admin@restro.com");
      console.log("🔑 Contraseña: adminpassword123");
    }

    // 2. Seed tables (1 to 15) if none exist
    const tableCount = await Table.countDocuments();
    if (tableCount === 0) {
      console.log("🌱 No tables found in database. Seeding tables 1 to 15...");
      
      const tablesToSeed = [];
      const seatsDistribution = [4, 6, 2, 4, 3, 4, 5, 5, 6, 6, 4, 6, 2, 6, 3]; // Matches the frontend constants
      
      for (let i = 1; i <= 15; i++) {
        tablesToSeed.push({
          tableNo: i,
          seats: seatsDistribution[i - 1] || 4,
          status: "Available"
        });
      }
      
      await Table.insertMany(tablesToSeed);
      console.log("✅ 15 default tables seeded successfully!");
    }

    // 3. Seed default menu items if none exist
    const menuItemCount = await MenuItem.countDocuments();
    if (menuItemCount === 0) {
      console.log("🌱 No menu items found in database. Seeding Peruvian dishes...");
      
      const dishesToSeed = [
        // Entradas
        { name: "Ceviche Carretillero", price: 32, category: "Entradas", description: "Pescado fresco marinado en limón con cebolla, camote, choclo y chicharrón de pota." },
        { name: "Papa a la Huancaína", price: 15, category: "Entradas", description: "Rodajas de papa sancochada bañadas en una suave crema de ají amarillo y queso fresco." },
        { name: "Causa Rellena de Pollo", price: 18, category: "Entradas", description: "Masa de papa amarilla sazonada con ají amarillo y limón, rellena de pollo y palta." },
        { name: "Anticuchos de Corazón", price: 22, category: "Entradas", description: "Dos palitos de anticucho de corazón de res macerados en ají panca, acompañados de papa dorada." },
        
        // Segundos (Platos de Fondo)
        { name: "Lomo Saltado", price: 38, category: "Segundos", description: "Trozos de lomo de res saltados al wok con cebolla, tomate, ají amarillo y salsa de soya, servido con papas fritas y arroz." },
        { name: "Ají de Gallina", price: 28, category: "Segundos", description: "Hebras de pechuga de gallina en una crema sedosa de ají amarillo, queso y leche, servido con arroz y papa." },
        { name: "Seco de Res con Frijoles", price: 34, category: "Segundos", description: "Carne de res guisada en salsa de culantro y cerveza, acompañada de frijoles cremosos y arroz." },
        { name: "Arroz con Pollo", price: 26, category: "Segundos", description: "Arroz sazonado con culantro, espinaca y verduras, acompañado de pierna o encuentro de pollo y salsa criolla." },
        
        // Bebidas
        { name: "Chicha Morada (Jarra)", price: 15, category: "Bebidas", description: "Bebida tradicional peruana de maíz morado hervido con piña, manzana, canela y clavo de olor." },
        { name: "Pisco Sour Clásico", price: 18, category: "Bebidas", description: "Cóctel insignia peruano a base de pisco, jarabe de goma, limón, clara de huevo y amargo de angostura." },
        { name: "Limonada Celyan", price: 8, category: "Bebidas", description: "Limonada fresca endulzada con azúcar blanca y cubos de hielo." },
        { name: "Gaseosa Inca Kola (Personal)", price: 6, category: "Bebidas", description: "Gaseosa tradicional peruana de sabor dulce y color amarillo dorado." },
        
        // Postres
        { name: "Suspiro a la Limeña", price: 12, category: "Postres", description: "Postre tradicional a base de manjar blanco de yemas cubierto por un merengue al oporto con canela." },
        { name: "Crema Volteada", price: 10, category: "Postres", description: "Clásico postre de leche condensada y vainilla cubierto de caramelo líquido." },
        { name: "Porción de Alfajores", price: 8, category: "Postres", description: "Tres alfajores suaves de maicena rellenos de abundante manjar blanco casero." }
      ];

      await MenuItem.insertMany(dishesToSeed);
      console.log("✅ 15 default Peruvian dishes seeded successfully!");
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
  }
};

module.exports = seedDatabase;
