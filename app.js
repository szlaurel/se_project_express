/* -------------------------------------------------------------------------- */
/*                                 app imports                                */
/* -------------------------------------------------------------------------- */

const express = require("express");

const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");

const app = express();
mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  () => {
    console.log("connected to DB");
  },
  (e) => console.log("DB error", e),
);

const routes = require("./routes");

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "651dce85f4ee7d5fefce1e99", // paste the _id of the test user created in the previous step
  };
  next();
});
app.use(routes);

app.listen(PORT, () => {
  console.log(`app is listening at port ${PORT}`);
  console.log("this is working");
});
