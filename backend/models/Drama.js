import mongoose from 'mongoose';

const dramaSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Year: { type: Number },
  Genre: { type: String },
  'Main Cast': { type: String },
  Sinopsis: { type: String },
  Score: { type: Number },
  'Content Rating': { type: String },
  Tags: { type: String },
  Network: { type: String },
  'img url': { type: String },
  Episode: { type: String },
  drama_key: { type: String, unique: true }
});

const Drama = mongoose.model('Drama', dramaSchema, 'dramas'); // The third argument specifies the collection name

export default Drama;
