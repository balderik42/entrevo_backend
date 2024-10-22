import path from 'path';
import { fileURLToPath } from 'url';
import Category from '../model/catagory-schema.js'; // Ensure path is correct
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure 'categories/' directory exists or create it
const uploadDir = path.join(__dirname, '../categories');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Configure Multer for image upload
const storageCategory = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const categories = multer({ storage: storageCategory });

export const addCategory = async (req, res) => {
  const { name } = req.body;
  const imagePath = `/categories/${req.file.filename}`; // Store relative path
  
  const newCategory = new Category({
    name,
    image: imagePath // Store the relative path in the database
  });

  try {
    await newCategory.save();
    res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCatagory =async (request,response)=>{
  try {
    const categories = await Category.find(); // Fetch all categories from the database
    response.status(200).json(categories);
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
};

export const ListCatagory = async (request,response)=>{
  try {
    const categories = await Category.find(); // Fetch all categories from the database
    response.status(200).json(categories);
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
}
