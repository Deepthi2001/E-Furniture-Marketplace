import { Product } from "../models/product.js";
import { randomFnForProducts } from "../utils/utils.js";
import { HTTP_RESPONSE } from "../utils/config.js";
import {seedProducts} from "../seeds/products.js"
import { User } from "../models/user.js";
import multer from "multer";

// get all products=======================================
export const getAllProducts = async (req, res) => {
    try {
        if (Object.keys(req.query).length === 0) {
            const products = await Product.find().populate('seller');
            return res.json({ data: products });
		} else {
			console.log("else part");
			// const colors = req.query.color?.split(",") || [];
			const categories = req.query.category?.split(",") || [];
			// const collections = req.query.collection?.split(",") || [];
			const price = req.query.price ? Number(req.query.price) : null;

			const query = {};

			// if (colors.length > 0) {
			// 	query.color = { $in: colors };
			// }

			if (categories.length > 0) {
				query.category = { $in: categories };
			}

			// if (collections.length > 0) {
			// 	query.collection_ = { $in: collections };
			// }

			if (price !== null) {
				query.price = { $lt: price };
			}

			const products = await Product.find(query);
			console.log("products",products);
			return res.json({ data: products });
		}
	} catch (error) {
		console.error("Error details:", error);
		res
			.status(HTTP_RESPONSE.INTERNAL_ERROR.CODE)
			.json(HTTP_RESPONSE.INTERNAL_ERROR.MESSAGE);
	}
};

// get search value
export const getSearchValue = async (req, res) => {
	try {
		const { searchvalue } = req.params;
		const products = await Product.find({
			$or: [{ title: searchvalue }, { category: searchvalue }],
		});
		res.status(HTTP_RESPONSE.OK.CODE).json({ data: products });
	} catch (err) {
		res
			.status(HTTP_RESPONSE.INTERNAL_ERROR.CODE)
			.json(HTTP_RESPONSE.INTERNAL_ERROR.MESSAGE);
	}
};


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, './uploads/images'); // Define the upload directory
	},
	filename: (req, file, cb) => {
	  cb(null, Date.now() + path.extname(file.originalname)); // Filename will be the timestamp and file extension
	},
  });
  
  const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
	fileFilter: (req, file, cb) => {
	  // Allow only image file types
	  const fileTypes = /jpeg|jpg|png|gif/;
	  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
	  const mimetype = fileTypes.test(file.mimetype);
  
	  if (extname && mimetype) {
		return cb(null, true);
	  }
	  cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
	},
  }).single('img'); // 'img' is the field name for the image file

  
// Add a new product to the list ===============================
export const addProduct = async (req, res) => {
	try {
		const { title, description, price, category, location } = req.body;
		const img = req.file ? `/uploads/images/${req.file.filename}` : ''; 
		
		if (!req.user || !req.user.id) {
			return res.status(400).json({ message: "User not authenticated" });
		}
		
		const username = await User.findById(req.user.id);
		// Create a new product instance with the provided data
		const newProduct = new Product({
            title,
            description,
            price,
            category,
            img,
            location,
            userId: req.user.id,
            seller: username
        });

		// Save the new product to the database
		const savedProduct = await newProduct.save();
		// Respond with the newly created product
		return res.status(HTTP_RESPONSE.OK.CODE).json({ data: savedProduct });
	} catch (error) {
		// Handle errors
		console.error("Detailed error:", error);
		return res
			.status(HTTP_RESPONSE.INTERNAL_ERROR.CODE)
			.json({ message: "Error adding product", error: error.message || error });
	}
};


export const getMyProducts = async (req, res) => {
    try {
        const userprods = await Product.find({ userId: req.user.id });
		return res.json(userprods);
    } catch (error) {
        // Handle errors
        console.error("Detailed error:", error);
        return res
            .status(HTTP_RESPONSE.INTERNAL_ERROR.CODE)
            .json({ message: "Error adding product", error: error.message || error });
    }
};