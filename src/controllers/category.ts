import Category from "../models/category";
import User from "../models/user";
import { Controller } from "../types/controllers";
import { AuthenticatedRequestHandler } from "../types/express";
import { handleControllerErrors, ServerError } from "../util/errors";

export const CategoryControllerBase: Controller = {
  postCategory: (async (req, res, next) => {
    const userId = req.userId;
    const { description, isIncome, budgetId } = req.body;
    const permissionToEdit = await User.hasPermissionToEditBudget(
      userId,
      budgetId
    );
    if (!permissionToEdit) throw new ServerError(403, "Access denied");
    const idPacket = await Category.create({ description, isIncome, budgetId });
    res.status(200).json({
      message: "Category created successfully",
      categoryId: idPacket._id,
    });
  }) as AuthenticatedRequestHandler,
  patchCategory: (async (req, res, next) => {
    const userId = req.userId;
    const id = +req.params.id;
    const permissionToEdit = await User.hasPermissionToEditCategory(userId, id);
    if (!permissionToEdit) throw new ServerError(403, "Access denied");
    const { description, isIncome } = req.body;
    await Category.update({ description, isIncome, id });
    res.status(200).json({
      message: "Category updated successfully",
    });
  }) as AuthenticatedRequestHandler,
  deleteCategory: (async (req, res, next) => {
    const userId = req.userId;
    const id = +req.params.id;
    const [permissionToEdit, categoryHasTransactions] = await Promise.all([
      User.hasPermissionToEditCategory(userId, id),
      Category.hasTransactions(id),
    ]);
    if (!permissionToEdit) throw new ServerError(403, "Access denied");
    if (categoryHasTransactions) {
      throw new ServerError(
        403,
        "Make sure none of the current transactions are in this category before deleting it"
      );
    }
    await Category.removeById(id);
    res.status(200).json({
      message: "Category deleted successfully",
    });
  }) as AuthenticatedRequestHandler,
};

export default handleControllerErrors(CategoryControllerBase);
