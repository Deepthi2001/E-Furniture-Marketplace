import { Router } from "express";
import { isLoggedIn } from "../middleware.js";
import { getAllProducts, getSearchValue, addProduct, getMyProducts, updateProductById, deleteProductById } from "../controllers/product.js";
import {upload} from "../middleware/uploadMiddleware.js";
import {Product} from "../models/product.js";

const router = Router();


router.get("/myProducts", isLoggedIn ,getMyProducts);
router.get("/:searchvalue", getSearchValue);
router.get("/", getAllProducts);
//router.post("/addProduct",isLoggedIn, addProduct);
router.put("/updateProduct/:productId", isLoggedIn, upload.single("img"), updateProductById);
router.delete("/deleteProduct/:productId", isLoggedIn, deleteProductById);
router.post("/addProduct", isLoggedIn, upload.single("img"), addProduct);


export default router;