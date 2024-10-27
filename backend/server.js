require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDatabase = require("./utils/db");

const app = express();

connectDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://web.postman.co"],
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);

const authRoutes = require("./routes/auth-routes");
const productRoutes = require("./routes/product-routes");
const cartRoutes = require("./routes/cart-routes");
const orderRoutes = require("./routes/order-routes");
const { generateResponseWithoutPayload } = require("./utils/response-helpers");

app.use("/", (req, res, next) => {
  return res.send("Welcome to Ecommerce API");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use((err, req, res, next) => {
  const code = err.status || 500;
  const message = err.message || "Something went wrong";
  const response = generateResponseWithoutPayload(code, false, message);
  return res.status(code).json(response);
});

const PORT = process.env.PORT;

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});

mongoose.connection.on("error", () => {
  console.log(
    "Probably due to connection with the database server, Server closed"
  );
  process.exit(1);
});
