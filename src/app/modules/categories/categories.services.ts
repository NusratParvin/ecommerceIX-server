import { StatusCodes } from "http-status-codes";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/apiErrors";
import { pagination } from "../../../helpers/pagination";

const createCategoryIntoDB = async (name: string) => {
  return await prisma.category.create({
    data: { name },
  });
};

const getCategoriesFromDB = async (filters: any, options: any) => {
  // Calculate pagination
  const { page, limit, skip, sortBy, sortOrder } =
    pagination.calculatePagination(options);

  // Construct where clause based on filters
  const where: any = {};
  if (filters.searchTerm) {
    where.name = { contains: filters.searchTerm, mode: "insensitive" };
  }

  // Fetch categories with filters, sorting, and pagination
  const categories = await prisma.category.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });

  // Count total records for meta
  const totalRecords = await prisma.category.count({ where });

  return {
    meta: {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
    },
    data: categories,
  };
};

export const updateCategoryIntoDB = async (
  id: string,
  data: Partial<{ name: string; isDeleted: boolean }>
) => {
  try {
    return await prisma.category.update({
      where: { id },
      data,
    });
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid category ID.");
  }
};

const deleteCategoryFromDB = async (id: string) => {
  return await prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });
};

export const CategoriesServices = {
  getCategoriesFromDB,
  createCategoryIntoDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};
