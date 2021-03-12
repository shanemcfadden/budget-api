import "./util/env";
import express from "express";
import { db } from "./database/Database";
import AuthRoutes from "./routes/auth";
import BudgetRoutes from "./routes/budget";
import isAuth from "./middleware/isAuth";
import { errorRequestHandler } from "./util/errors";

const app = express();

const { PORT } = process.env;

app.use(express.json());
app.use(isAuth);

app.use("/auth", AuthRoutes);
app.use("/budget", BudgetRoutes);

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
