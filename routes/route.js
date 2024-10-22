import express from 'express';
import { addProduct, upload, getProductByCatagory, getProductById, getAllProducts, deleteProduct, updateProduct } from '../controller/product-controller.js';
import { addCategory, categories, getCatagory, ListCatagory } from '../controller/catagory-controller.js'; 
import { userLogin, usersignup } from '../controller/user-controller.js';
import { addToCart, AdminlistOrders, AdminUpdateStatus, deleteCart, deleteCartProduct, getCartPage, increaseProduct, listOrders, placeOrder } from '../controller/cart-controller.js';


const router = express.Router();

// Route for adding a product, upload a single image    
router.post('/addproduct', upload.single('image'), addProduct);
router.post('/signup', usersignup);
router.post('/userlogin', userLogin);
router.post('/addcategory', categories.single('image'), addCategory);
router.get('/categories', getCatagory);
router.get('/listcategories', ListCatagory); // Just keep this as is
router.get('/products',getProductByCatagory)
router.get('/products/:id',getProductById)
router.get('/products',getAllProducts)
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/addtocart',addToCart)
router.get('/cart/:userId',getCartPage)
router.put('/cart/:userId/product/:productId', increaseProduct);
router.delete('/cart/:userId/product/:productId', deleteCartProduct);
router.post('/orders',placeOrder)
router.delete('/cart/:userId', deleteCart);
router.get('/orders/:userId',listOrders)
router.get('/adminorders',AdminlistOrders)
router.put('/orders/:id',AdminUpdateStatus)


export default router;

