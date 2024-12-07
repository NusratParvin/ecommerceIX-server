import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/apiErrors";
import { ActiveStatus, Shop } from "@prisma/client";
import { TFile } from "../../interfaces/fileUpload";
import { fileUploader } from "../../../helpers/uploadImageToCloudinary";
import { pagination } from "../../../helpers/pagination";

const getShopByOwnerFromDB = async (email: string) => {
  const isOwner = await prisma.user.findFirst({
    where: {
      email,
      status: ActiveStatus.ACTIVE,
    },
  });

  if (!isOwner) {
    throw new ApiError(StatusCodes.NOT_FOUND, "No Vendor Found");
  }
  // const result = await prisma.shop.findFirst({
  //   where: {
  //     ownerId: isOwner.id,
  //   },
  // });

  const result = await prisma.shop.findFirst({
    where: {
      ownerId: isOwner.id,
    },
    include: {
      _count: {
        select: { products: true }, // Include product count
      },
    },
  });
  // console.log(result, "prod");
  return { ...result, productCount: result?._count.products };
};

const createShopIntoDB = async (req: any): Promise<Shop> => {
  const { name, description } = req.body;

  // Validate the owner based on the email
  const owner = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!owner) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "User not authenticated.");
  }

  // Extract the owner ID
  const ownerId = owner.id;

  const isShop = await prisma.shop.findFirst({ where: { ownerId } });
  if (isShop)
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "You Are not permitted to open more than one shop"
    );

  // Handle file upload (if provided)
  let logo = null;
  const file = req.file as TFile;
  if (file) {
    const uploadResult = await fileUploader.uploadImageToCloudinary(file);
    logo = uploadResult?.secure_url;
  }

  // Prepare shop data for creation
  const shopData = {
    name,
    description,
    logo,
    ownerId,
  };

  // console.log("Shop data to be created:", shopData);

  // Create the shop in the database
  const result = await prisma.shop.create({
    data: shopData,
  });

  // console.log("Created shop:", result);
  return result;
};

const getAllShopsFromDB = async (filters: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    pagination.calculatePagination(options);

  const where: any = {};
  if (filters.searchTerm) {
    where.name = { contains: filters.searchTerm, mode: "insensitive" };
  }
  if (filters.status) {
    where.status = filters.status; // Filtering by status if provided
  }
  if (filters.ownerId) {
    where.ownerId = filters.ownerId; // Filtering by owner ID if provided
  }

  const shops = await prisma.shop.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      owner: {
        select: { id: true, name: true, email: true }, // Include owner details if needed
      },
    },
  });

  // Count total records for meta
  const totalRecords = await prisma.shop.count({ where });

  return {
    meta: {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
    },
    data: shops,
  };
};

const updateShopIntoDB = async (
  shopId: string,
  data: any,
  file?: TFile
): Promise<Shop> => {
  // Fetch the existing shop by ID
  const existingShop = await prisma.shop.findUnique({
    where: { id: shopId },
  });

  if (!existingShop) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Shop not found.");
  }

  // Handle file upload if a new logo is provided
  let logo: string | null = existingShop.logo; // Default to existing logo
  if (file) {
    const uploadResult = await fileUploader.uploadImageToCloudinary(file);
    logo = uploadResult?.secure_url || null; // Ensure `null` if undefined
  }

  // Prepare updated shop data
  const updatedShopData = {
    ...data,
    ...(logo !== null && { logo }), // Only include `logo` if it's updated
  };

  // Update the shop in the database
  const updatedShop = await prisma.shop.update({
    where: { id: shopId },
    data: updatedShopData,
  });

  return updatedShop;
};

export const ShopServices = {
  createShopIntoDB,
  updateShopIntoDB,
  getAllShopsFromDB,
  getShopByOwnerFromDB,
};
