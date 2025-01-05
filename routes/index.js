const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const cartRoute = require("./cartRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/cart", cartRoute);
};

module.exports = mountRoutes;
