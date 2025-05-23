import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import BASE_URL_V1 from "./config/base-url.js";
import authRoutes from "./routes/auth.routes.js";
import claimRoutes from "./routes/claim.routes.js";
import reportRoutes from "./routes/report.routes.js";
import AuthGuard from "./middlewares/auth-guard.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import User from "./routes/user.routes.js";
import Vehicle from "./routes/vehicle.routes.js";
import Detection from "./routes/detection.routes.js";

//! Initialize Express app
const app = express();

//! Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming request bodies in JSON format

app.get("/", (req, res) => {
  res.send("Health Check insureGeini API");
});

//! Routes
app.use(AuthGuard); // Auth Middleware
app.use(`${BASE_URL_V1}/auth`, authRoutes);
app.use(`${BASE_URL_V1}/claims`, claimRoutes);
app.use(`${BASE_URL_V1}/feedback`, feedbackRoutes);
app.use(`${BASE_URL_V1}/reports`, reportRoutes);
app.use(`${BASE_URL_V1}/user`, User);
app.use(`${BASE_URL_V1}/vehicle`, Vehicle);
app.use(`${BASE_URL_V1}/detection`, Detection);

// app.use(`${BASE_URL_V1}/role`, roleRoutes);

export default app;
