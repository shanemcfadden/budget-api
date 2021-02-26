import dotenv from "dotenv";
dotenv.config();
import { Application } from "express";

import db from "./database/db";
import express from "express";

const app: Application = express();

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
  db.query("SHOW TABLES;")
    .then(([rows, fields]) => {
      console.log(rows);
      console.log(fields);
    })
    .catch((err) => console.log("MySql connection error:", err));
});
