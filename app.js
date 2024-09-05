require("dotenv").config();
const express = require("express");
const connectToDB = require("./db/db");
const cors = require("cors");
const cron = require("node-cron");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();
const port = 5000;

const accounts = require("./routes/accounts");
const patients = require("./routes/patients");
const doctors = require("./routes/doctors");
const slots = require("./routes/slots");
const speciality = require("./routes/speciality");
const appointments = require("./routes/appointments");
const { slotsDateUpdate } = require("./controllers/slots");

// Schedule the function to run every day
cron.schedule("0 0 * * *", async () => {
  console.log("Running slots update date...");
  await slotsDateUpdate(); // Runs at 12:00 AM every day.
});

app.use(express.json());
// allow cors requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

// Serve Swagger documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get("/node", (req, res) => res.send("Hello World"));
app.use("/api/accounts", accounts);
app.use("/api/patients", patients);
app.use("/api/doctors", doctors);
app.use("/api/slots", slots);
app.use("/api/speciality", speciality);
app.use("/api/appointments", appointments);

const startConnection = async () => {
  try {
    await connectToDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};
startConnection();
