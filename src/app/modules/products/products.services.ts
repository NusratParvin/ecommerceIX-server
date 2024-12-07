import { pagination } from "../../../helpers/pagination";
import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/apiErrors";
import { Product, ProductStatus } from "@prisma/client";
import { TFile } from "../../interfaces/fileUpload";
import { fileUploader } from "../../../helpers/uploadImageToCloudinary";

const createProductIntoDB = async (req: any): Promise<Product> => {
  const payload = req.body;

  const shopExists = await prisma.shop.findUnique({
    where: { id: payload.shopId },
  });
  if (!shopExists) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Shop ID.");
  }

  const categoryExists = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });
  if (!categoryExists) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Category ID.");
  }

  const file = req.file as TFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadImageToCloudinary(file);
    payload.imageUrl = uploadToCloudinary?.secure_url;
  }
  const productInfo = { ...payload, imageUrl: payload.imageUrl };
  // Create the product directly
  return await prisma.product.create({
    data: productInfo,
  });
};

const getProductByIdFromDB = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      shop: true,
      category: true,
      reviews: true,
    },
  });
};

const updateProductIntoDB = async (
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    stock: number;
    discount: number;
    imageUrl: string;
    isFlashSale: boolean;
    flashSalePrice: number;
    flashSaleStartDate: Date;
    flashSaleEndDate: Date;
  }>
) => {
  console.log(data);
  return await prisma.product.update({
    where: { id },
    data,
  });
};

const updateProductStatusIntoDB = async (id: string, status: ProductStatus) => {
  // console.log(object);
  return prisma.product.update({
    where: { id },
    data: { status },
  });
};

const deleteProductFromDB = async (id: string) => {
  return await prisma.product.update({
    where: { id },
    data: { isDeleted: true },
  });
};

const getAllProductsFromDB = async (
  filters: Record<string, any>,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    pagination.calculatePagination(options);

  const whereClause = {
    isDeleted: false,
    ...filters,
  };

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        shop: true,
        category: true,
      },
    }),
    prisma.product.count({ where: whereClause }),
  ]);
  console.log("hit here");
  return {
    meta: {
      total,
      page,
      limit,
    },
    data,
  };
};

const getAllProductsForAdminFromDB = async (
  filters: Record<string, any>,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    pagination.calculatePagination(options);

  // const whereClause = {
  //   // isDeleted: false,
  //   ...filters,
  // };
  const where: any = {};
  if (filters.searchTerm) {
    where.name = { contains: filters.searchTerm, mode: "insensitive" };
  }
  // console.log({ whereClause }, "sfndjbh");
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy || "createdAt"]: sortOrder || "asc" },
      include: {
        shop: true,
        category: true,
        OrderItem: true,
        reviews: true,
      },
    }),
    prisma.product.count({ where: where }),
  ]);
  console.log("object");
  return {
    meta: { total, page, limit },
    data,
  };
};

export const ProductServices = {
  createProductIntoDB,
  getProductByIdFromDB,
  updateProductIntoDB,
  updateProductStatusIntoDB,
  deleteProductFromDB,
  getAllProductsFromDB,
  getAllProductsForAdminFromDB,
};
