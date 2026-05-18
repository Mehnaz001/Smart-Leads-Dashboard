/**
 * Run with: npx ts-node src/utils/seed.ts
 * Seeds demo admin + sales user and 25 sample leads
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Lead } from '../models/Lead';

dotenv.config();

const NAMES = ['Rahul Sharma','Priya Mehta','Arjun Nair','Sneha Patel','Vikram Gupta',
  'Ananya Singh','Rohit Verma','Kavya Reddy','Aditya Kumar','Pooja Joshi',
  'Manish Tiwari','Deepika Rao','Saurabh Mishra','Neha Chaudhary','Ravi Bhat',
  'Swati Kulkarni','Nikhil Desai','Anjali Sinha','Karan Malhotra','Divya Nambiar',
  'Suresh Pillai','Ritika Agarwal','Abhishek Dube','Meera Iyer','Harsh Pandey'];

const STATUSES: Array<'New'|'Contacted'|'Qualified'|'Lost'> = ['New','Contacted','Qualified','Lost'];
const SOURCES: Array<'Website'|'Instagram'|'Referral'> = ['Website','Instagram','Referral'];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartleads');
  console.log('Connected to MongoDB');

  // Clear existing
  await User.deleteMany({});
  await Lead.deleteMany({});

  // Create admin
  const admin = await User.create({
    name: 'Admin User', email: 'admin@demo.com', password: 'password123', role: 'admin',
  });

  // Create sales user
  const sales = await User.create({
    name: 'Sales User', email: 'sales@demo.com', password: 'password123', role: 'sales',
  });

  // Create 25 leads
  const leads = NAMES.map((name, i) => ({
    name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    status: STATUSES[i % STATUSES.length],
    source: SOURCES[i % SOURCES.length],
    notes: i % 3 === 0 ? `Follow up scheduled for next week. Lead came via ${SOURCES[i % SOURCES.length]}.` : undefined,
    createdBy: i % 4 === 0 ? sales._id : admin._id,
  }));

  await Lead.insertMany(leads);

  console.log('✅ Seeded: 2 users + 25 leads');
  console.log('   Admin:  admin@demo.com / password123');
  console.log('   Sales:  sales@demo.com / password123');
  await mongoose.disconnect();
};

seed().catch((err) => { console.error(err); process.exit(1); });
