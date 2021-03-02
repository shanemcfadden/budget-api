import "./util/env";
import express from "express";
import bodyParser from "body-parser";
import { db } from "./database/Database";
import AuthRoutes from "./routes/auth";
import isAuth from "./middleware/isAuth";

const app = express();

const { PORT } = process.env;

app.use(bodyParser.json());
app.use(isAuth);

app.use("/auth", AuthRoutes);

app.use((req, res) => {
  res.send("route not found");
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
  db.query("SHOW TABLES;")
    .then(() => {
      console.log("Connected to MySql server");
    })
    .catch((err) => console.log("MySql connection error:", err));
});
