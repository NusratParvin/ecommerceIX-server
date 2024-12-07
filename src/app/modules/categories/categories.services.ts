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
  const { page, limit, skip, sortBy, sortOrder } =
    pagination.calculatePagination(options || {});

  const where: any = {};
  if (filters.searchTerm) {
    where.name = { contains: filters.searchTerm, mode: "insensitive" };
  }

  const categories = await prisma.category.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      products: true,
    },
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
const getCategoriesForAllFromDB = async () => {
  const categories = await prisma.category.findMany();

  return categories;
};

const updateCategoryIntoDB = async (
  id: string,
  data: Partial<{ name: string; isDeleted: boolean }>
) => {
  if (data.name) {
    const existingCategory = await prisma.category.findFirst({
      where: { name: data.name, NOT: { id } },
    });

    if (existingCategory) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        `Category name '${data.name}' already exists.`
      );
    }
  }

  // Update the category
  const res = await prisma.category.update({
    where: { id },
    data,
  });

  // console.log(res);
  return res;
};

const deleteCategoryFromDB = async (id: string) => {
  return await prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });
};

export const CategoriesServices = {
  getCategoriesFromDB,
  getCategoriesForAllFromDB,
  createCategoryIntoDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};
