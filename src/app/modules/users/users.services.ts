import { ActiveStatus, PrismaClient, UserRole } from "@prisma/client";
import ApiError from "../../errors/apiErrors";
import { StatusCodes } from "http-status-codes";
import { pagination } from "../../../helpers/pagination";

const prisma = new PrismaClient();

// Get all users
const getAllUsersFromDB = async (
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

  const where: Record<string, any> = {};

  // Handle search term for filtering by name or email
  if (filters.searchTerm) {
    where.OR = [
      { name: { contains: filters.searchTerm, mode: "insensitive" } },
      { email: { contains: filters.searchTerm, mode: "insensitive" } },
    ];
  }

  // Additional filters
  if (filters.role) {
    where.role = filters.role;
  }
  if (filters.status) {
    where.status = filters.status;
  }

  // Fetch data and count
  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortBy || "createdAt"]: sortOrder || "asc" },
    include: {
      shops: true,
      orders: true,
      reviews: true,
      followedShops: true,
    },
  });

  const total = await prisma.user.count({ where });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: users,
  };
};

// Get a single user by ID
const getUserByIdFromDB = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      shops: true,
      orders: true,
      reviews: true,
      followedShops: true,
    },
  });
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  return user;
};

const updateUserStatusIntoDB = async (id: string, status: ActiveStatus) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { status },
  });

  return updatedUser;
};

const updateUserRoleIntoDB = async (id: string, role: UserRole) => {
  //   console.log(id, role);

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role },
  });

  return updatedUser;
};

// Delete a user permanently
const deleteUserFromDB = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");

  await prisma.user.update({
    where: { id },
    data: { status: ActiveStatus.DELETED },
  });
};

export const UserServices = {
  getUserByIdFromDB,
  getAllUsersFromDB,
  updateUserStatusIntoDB,
  updateUserRoleIntoDB,
  deleteUserFromDB,
};