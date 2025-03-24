const mongoose = require('mongoose');

// Load the MongoDB URI from the environment variables
const URL = process.env.MONGO_URI;

if (!URL) {
  console.error('MONGO_URI is not defined in the environment variables.');
  process.exit(1); // Exit the process if MONGO_URI is not set
}

// Connect to MongoDB
mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the process on connection failure
  });

mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB ERROR:'));

module.exports = { db, mongoose };
