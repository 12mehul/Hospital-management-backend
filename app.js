require("dotenv").config();
const express = require("express");
const connectToDB = require("./db/db");
const cors = require("cors");

const app = express();
const port = 5000;

const patients = require("./routes/patients");

app.use(express.json());
// allow cors requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

app.get("/node", (req, res) => res.send("Hello World"));
app.use("/api/patients", patients);

const startConnection = async () => {
  try {
    await connectToDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};
startConnection();
