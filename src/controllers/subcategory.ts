import Subcategory from "../models/subcategory";
import User from "../models/user";
import { Controller } from "../types/controllers";
import { AuthenticatedRequestHandler } from "../types/express";
import { handleControllerErrors, ServerError } from "../util/errors";

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
    // const userId = req.userId;
    // const id = +req.params.id;
    // const permissionToEdit = await User.hasPermissionToEditCategory(userId, id);
    // if (!permissionToEdit) throw new ServerError(403, "Access denied");
    // const { description, isIncome } = req.body;
    // await Category.update({ description, isIncome, id });
    // res.status(200).json({
    //   message: "Category updated successfully",
    // });
    res.send("PATCH /:categoryId/:subcategoryId");
  }) as AuthenticatedRequestHandler,
  deleteSubcategory: (async (req, res, next) => {
    // const userId = req.userId;
    // const id = +req.params.id;
    // const permissionToEdit = await User.hasPermissionToEditCategory(userId, id);
    // // TODO: Make sure category has no subcategory with transactions before deleting
    // if (!permissionToEdit) throw new ServerError(403, "Access denied");
    // await Category.removeById(id);
    // res.status(200).json({
    //   message: "Category deleted successfully",
    // });
    res.send("DELETE /:categoryId/:subcategoryId");
  }) as AuthenticatedRequestHandler,
};

export default handleControllerErrors(SubcategoryControllerBase);
