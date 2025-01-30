const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const productRoute = require("./productRoute");
const addressRoute = require("./addressRoute");
const favoriteRoute = require("./favoriteRoute")

const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/address", addressRoute);
  app.use("/api/v1/favorites", favoriteRoute);

};

module.exports = mountRoutes;
