import prisma from "../../../shared/prisma";
import { pagination } from "../../../helpers/pagination";
import { StatusCodes } from "http-status-codes";

const getAllTransactionsForAdminFromDB = async (
  filters: Record<string, any>,
  options: { page: number; limit: number; sortBy: string; sortOrder: string }
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    pagination.calculatePagination(options);

  const where: Record<string, any> = {};

  if (filters.userId && filters.userId !== "null") {
    where.userId = filters.userId;
  }

  if (filters.searchTerm) {
    where.id = { equals: filters.searchTerm };
  }

  console.log("Filters applied:", where);

  const [data, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        order: true,
        user: true,
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  console.log("Fetched transactions:", data.length, "out of", total);

  const hasNextPage = skip + data.length < total;
  return {
    meta: { total, page, limit, hasNextPage },
    data,
  };
};

export const TransactionServices = {
  //   getAllTransactionsFromDB,
  getAllTransactionsForAdminFromDB,
};
