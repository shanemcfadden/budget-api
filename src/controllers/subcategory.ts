import Subcategory from "models/subcategory";
import User from "models/user";
import { Controller } from "types/controllers";
import { AuthenticatedRequestHandler } from "types/express";
import { handleControllerErrors, ServerError } from "util/errors";

export const SubcategoryControllerBase: Controller = {
  postSubcategory: (async (req, res, next) => {
    const userId = req.userId;
    const { description, categoryId } = req.body;
    const permissionToEdit = await User.hasPermissionToEditCategory(
      userId,
      categoryId
    );
    if (!permissionToEdit) throw new ServerError(403, "Access denied");
    const idPacket = await Subcategory.create({
      description,
      categoryId,
    });
    res.status(200).json({
      message: "Subcategory created successfully",
      subcategoryId: idPacket._id,
    });
  }) as AuthenticatedRequestHandler,
  patchSubcategory: (async (req, res, next) => {
    const userId = req.userId;
    const id = +req.params.id;
    const { categoryId, description } = req.body;
    const [
      hasPermissionToEditNewCategory,
      hasPermissionToEditSubcategory,
    ] = await Promise.all([
      User.hasPermissionToEditCategory(userId, categoryId),
      User.hasPermissionToEditSubcategory(userId, id),
    ]);
    if (!hasPermissionToEditNewCategory || !hasPermissionToEditSubcategory)
      throw new ServerError(403, "Access denied");
    await Subcategory.update({ description, categoryId, id });
    res.status(200).json({
      message: "Subcategory updated successfully",
    });
  }) as AuthenticatedRequestHandler,
  deleteSubcategory: (async (req, res, next) => {
    const userId = req.userId;
    const id = +req.params.id;
    const [
      hasPermissionToEditSubcategory,
      subcategoryHasTransactions,
    ] = await Promise.all([
      User.hasPermissionToEditSubcategory(userId, id),
      Subcategory.hasTransactions(id),
    ]);

    if (!hasPermissionToEditSubcategory)
      throw new ServerError(403, "Access denied");

    if (subcategoryHasTransactions) {
      throw new ServerError(
        403,
        "Make sure none of the current transactions are in this subcategory before deleting it"
      );
    }

    await Subcategory.removeById(id);
    res.status(200).json({
      message: "Subcategory removed successfully",
    });
  }) as AuthenticatedRequestHandler,
};

export default handleControllerErrors(SubcategoryControllerBase);
