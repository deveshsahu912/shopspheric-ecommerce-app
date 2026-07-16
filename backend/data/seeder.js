import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Order from '../models/Order.js';
import { users, categories, products } from './dummyData.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const seedData = async () => {
  try {
    console.log('Cleaning up database...');
    // Delete existing records
    await Order.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Inserting categories...');
    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories inserted.`);

    console.log('Inserting users (hashing passwords)...');
    // Loop through users and save individually to trigger pre-save bcrypt hashing hook
    const createdUsers = [];
    for (const u of users) {
      const newUser = await User.create(u);
      createdUsers.push(newUser);
    }
    console.log(`${createdUsers.length} users inserted.`);

    console.log('Mapping products and inserting...');
    // Map product categoryName to category ID and assign user references in reviews
    const mappedProducts = products.map((product) => {
      const categoryMatch = createdCategories.find(
        (c) => c.name.toLowerCase() === product.categoryName.toLowerCase()
      );
      if (!categoryMatch) {
        throw new Error(`Category not found for product: ${product.name}`);
      }

      // Map mock reviews to actual created user IDs
      const mappedReviews = (product.reviews || []).map((review) => {
        const userMatch = createdUsers.find(
          (u) => u.name.toLowerCase() === review.name.toLowerCase()
        );
        return {
          ...review,
          user: userMatch ? userMatch._id : createdUsers[0]._id, // Fallback to first user
        };
      });

      return {
        ...product,
        category: categoryMatch._id,
        reviews: mappedReviews,
      };
    });

    const createdProducts = await Product.insertMany(mappedProducts);
    console.log(`${createdProducts.length} products inserted.`);

    console.log('Database Seeding Completed Successfully! 🌱');
    process.exit(0);
  } catch (error) {
    console.error(`Error during data seeding: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    console.log('Wiping database collections...');
    await Order.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Database Cleared! 🗑️');
    process.exit(0);
  } catch (error) {
    console.error(`Error during database wipe: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}
