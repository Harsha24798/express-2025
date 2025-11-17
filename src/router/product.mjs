import { Router } from "express";
import { productData } from "../data/product-data.mjs";

const productRouter = Router();

// Get all products
productRouter.get('/', (_, res) => {
    res.status(200).json({
        message: "List of products",
        data: productData
    });
});

// Get product by ID
productRouter.get('/product', (req, res) => {
    const productId = parseInt(req.query.productId);

    if (isNaN(productId)) {
        return res.status(400).json({
            message: "Invalid or missing productId query parameter"
        });
    }

    const product = productData.find(p => p.id === productId);

    if (product) {
        res.status(200).json({
            message: `Product with id ${productId} found`,
            data: product
        });
    } else {
        res.status(404).json({
            message: `Product with id ${productId} not found`
        });
    }
});

export default productRouter;