const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const cartRoute = require("./cartRoute");
const categoryRoute = require("./categoryRoute");
const productRoute = require("./productRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/products", productRoute);
};

module.exports = mountRoutes;
