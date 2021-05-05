import "util/env";
import express from "express";
import { db } from "database/Database";
import AccountRoutes from "routes/account";
import AuthRoutes from "routes/auth";
import BudgetRoutes from "routes/budget";
import CategoryRoutes from "routes/category";
import SubcategoryRoutes from "routes/subcategory";
import authenticateBearer from "middleware/authenticateBearer";
import { errorRequestHandler, ServerError } from "util/errors";
import mustBeAuthenticated from "middleware/mustBeAuthenticated";
import TransactionRoutes from "routes/transaction";

const app = express();

const { PORT } = process.env;

app.use(express.json());
app.use(authenticateBearer);

app.use("/auth", AuthRoutes);
app.use("/budget", mustBeAuthenticated, BudgetRoutes);
app.use("/account", mustBeAuthenticated, AccountRoutes);
app.use("/category", mustBeAuthenticated, CategoryRoutes);
app.use("/transaction", mustBeAuthenticated, TransactionRoutes);
app.use("/subcategory", mustBeAuthenticated, SubcategoryRoutes);

app.use((req, res) => {
  throw new ServerError(404, "Route not found");
});

app.use(errorRequestHandler);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
  db.query("SHOW TABLES;")
    .then(() => {
      console.log("Connected to MySQL database");
    })
    .catch((err) => console.log("MySQL connection error:", err));
});
