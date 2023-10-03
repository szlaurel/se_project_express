/* -------------------------------------------------------------------------- */
/*                                 app imports                                */
/* -------------------------------------------------------------------------- */

const express = require("express");
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const app = express();
mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to DB");
  },
  (e) => console.log("DB error", e),
);

const routes = require("./routes");

app.use(express.json());
app.use(routes);
app.use((req, res, next) => {
  req.user = {
    _id: "651b8090a03f52722909406c", // paste the _id of the test user created in the previous step
  };
  next();
});

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id); // _id will become accessible
};

app.listen(PORT, () => {
  console.log(`app is listening at port ${PORT}`);
  console.log("this is working");
});
