import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import BASE_URL_V1 from "./config/base-url.js";
import authRoutes from "./routes/auth.routes.js";
import claimRoutes from "./routes/claim.routes.js";
import AuthGuard from "./middlewares/auth-guard.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import reportRoutes from "./routes/report.routes.js";
//! Initialize Express app
const app = express();

//! Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming request bodies in JSON format

app.get("/", (req, res) => {
  res.send("Health Check");
});

//! Routes
app.use(AuthGuard); // Auth Middleware
app.use(`${BASE_URL_V1}/auth`, authRoutes);
app.use(`${BASE_URL_V1}/claims`, claimRoutes);
app.use(`${BASE_URL_V1}/feedback`, feedbackRoutes);
/* app.use(`${BASE_URL_V1}/report`, reportRoutes); */
// app.use(`${BASE_URL_V1}/role`, roleRoutes);

export default app;
