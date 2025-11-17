import express from 'express';
import productRouter from './src/router/product.mjs';
import userRouter from './src/router/user.mjs';

const server = express();
const PORT = 4000;

server.use(express.json());
server.use("/api/users", userRouter);
server.use("/api/products", productRouter);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});