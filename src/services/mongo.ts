
import mongoose from 'mongoose';

const uri = String(process.env.MONGO_URI) || 'http://localhost:27017'

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });