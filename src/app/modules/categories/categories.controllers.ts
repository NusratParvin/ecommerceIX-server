import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import { CategoriesServices } from "./categories.services";
import sendResponse from "../../../shared/sendResponse";

import pick from "../../../helpers/pick";

const categoryFilterableFields = ["name", "searchTerm"];

const getCategories = catchAsync(async (req: Request, res: Response) => {
  // Extract filters and pagination options from query params
  const filters = pick(req.query, categoryFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  // Fetch data from the service
  const result = await CategoriesServices.getCategoriesFromDB(filters, options);
  console.log(result);
  // Send a standardized response
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Categories fetched successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getCategoriesForAll = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoriesServices.getCategoriesForAllFromDB();
  // console.log(result);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Categories fetched successfully!",
    data: result,
  });
});

// Create a new category
const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  console.log(name);
  const newCategory = await CategoriesServices.createCategoryIntoDB(name);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Category created successfully!",
    data: newCategory,
  });
});

// Update a category
const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const updatedCategory = await CategoriesServices.updateCategoryIntoDB(
    id,
    data
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category updated successfully!",
    data: updatedCategory,
  });
});

// Soft delete a category
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedCategory = await CategoriesServices.deleteCategoryFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category deleted successfully!",
    data: deletedCategory,
  });
});

export const CategoriesControllers = {
  getCategories,
  getCategoriesForAll,
  createCategory,
  updateCategory,
  deleteCategory,
};
