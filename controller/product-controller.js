import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../model/product-schema.js';
import multer from 'multer';
import fs from 'fs';

// Convert import.meta.url to a filename and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure 'uploads/' directory exists or create it
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

export const addProduct = async (request, response) => {
  const imagePath = `/uploads/${request.file.filename}`;
  try {
    const newProduct = new Product({
      shortName: request.body.shortName,
      longName: request.body.longName,
      category: request.body.category,
      price: request.body.price,
      sellingPrice: request.body.sellingPrice, 
      description: request.body.description,
      image: imagePath,
      stock:request.body.stock
    });

    await newProduct.save();
    response.status(201).json(newProduct);
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Remove old image if a new one is uploaded
    if (req.file && product.image) {
      const oldImagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    product.shortName = req.body.shortName || product.shortName;
    product.longName = req.body.longName || product.longName;
    product.category = req.body.category || product.category;
    product.price = req.body.price || product.price;
    product.sellingPrice = req.body.sellingPrice || product.sellingPrice;
    product.description = req.body.description || product.description;
    product.image = req.file ? `/uploads/${req.file.filename}` : product.image;
    product.stock = req.body.stock || product.stock;

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};


export const getProductByCatagory = async (req, res) => {
  try {
    const category = req.query.category;
    const products = await Product.find(category ? { category } : {});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    // Attempt to find the product by ID
    const product = await Product.findById(req.params.id);
    
    // Check if the product exists
    if (product) {
      res.status(200).json(product); // Respond with the product data
    } else {
      res.status(404).json({ message: 'Product not found' }); // Product not found
    }
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
}

export const deleteProduct = async (req, res) => {
  try {
    // Find product by ID and delete it
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Optionally, remove the product's image from the file system
    const imagePath = path.join(__dirname, '..', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Remove the image file
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

