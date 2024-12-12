import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../helpers/pick";
import { ProductServices } from "./products.services";

const productFilterableFields = [
  "name",
  "categoryId",
  "shopId",
  "isFlashSale",
  "searchTerm",
];
const paginationFields = ["limit", "page", "sortBy", "sortOrder"];

const createProduct = catchAsync(async (req: Request, res: Response) => {
  // // console.log("object");
  // const file = req.file;
  // const payload = req.body;
  const result = await ProductServices.createProductIntoDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Product created successfully!",
    data: result,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductServices.getProductByIdFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product retrieved successfully!",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id, "jhsdjhkjfhjk");
  const result = await ProductServices.updateProductIntoDB(id, req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product updated successfully!",
    data: result,
  });
});

const updateProductStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  // console.log(id, status, "hhfghfghfg");
  const result = await ProductServices.updateProductStatusIntoDB(id, status);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product updated successfully!",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductServices.deleteProductFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product deleted successfully!",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : null,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : null,
    category:
      req.query.category === "null" ? null : (req.query.category as string),
    shop: req.query.shop === "null" ? null : (req.query.shop as string),
    search: req.query.search ? String(req.query.search) : "",
  };

  const options = {
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 8,
    sortBy: req.query.sortBy ? String(req.query.sortBy) : "createdAt",
    sortOrder: req.query.sortOrder ? String(req.query.sortOrder) : "desc",
  };

  console.log("Filters:", filters);
  console.log("Options:", options);

  const result = await ProductServices.getAllProductsFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Products retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getAllProductsForAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, productFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await ProductServices.getAllProductsForAdminFromDB(
      filters,
      options
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Products retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getAllProductsForVendor = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.user.id;
    // console.log(id);
    const filters = pick(req.query, productFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await ProductServices.getAllProductsForVendorFromDB(
      filters,
      options,
      id
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Products retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getFlashSaleProducts = catchAsync(async (req: Request, res: Response) => {
  console.log("in flash");
  const filters = {
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : null,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : null,
    category:
      req.query.category === "null" ? null : (req.query.category as string),
    shop: req.query.shop === "null" ? null : (req.query.shop as string),
    search: req.query.search ? String(req.query.search) : "",
  };

  const options = {
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 8,
    sortBy: req.query.sortBy ? String(req.query.sortBy) : "createdAt",
    sortOrder: req.query.sortOrder ? String(req.query.sortOrder) : "desc",
  };

  console.log("Filters flash:", filters);
  console.log("Options:", options);

  const result = await ProductServices.getFlashSaleProductsFromDB(
    filters,
    options
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Flas sale Products retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const ProductControllers = {
  getAllProducts,
  getFlashSaleProducts,
  createProduct,
  getProductById,
  getAllProductsForAdmin,
  getAllProductsForVendor,
  updateProduct,
  updateProductStatus,
  deleteProduct,
};
