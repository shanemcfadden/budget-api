import "./util/env";
import express from "express";
import { db } from "./database/Database";
import AccountRoutes from "./routes/account";
import AuthRoutes from "./routes/auth";
import BudgetRoutes from "./routes/budget";
import authenticateBearer from "./middleware/authenticateBearer";
import { errorRequestHandler } from "./util/errors";
import mustBeAuthenticated from "./middleware/mustBeAuthenticated";

const app = express();

const { PORT } = process.env;

app.use(express.json());
app.use(authenticateBearer);

app.use("/auth", AuthRoutes);
app.use("/budget", mustBeAuthenticated, BudgetRoutes);
app.use("/account", mustBeAuthenticated, AccountRoutes);

app.use((req, res) => {
  res.send("route not found");
});

app.use(errorRequestHandler);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
  db.query("SHOW TABLES;")
    .then(() => {
      console.log("Connected to MySql server");
    })
    .catch((err) => console.log("MySql connection error:", err));
});
