import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/apiErrors";
import { ActiveStatus, Shop, ShopStatus } from "@prisma/client";
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
    where.status = filters.status;
  }
  if (filters.ownerId) {
    where.ownerId = filters.ownerId;
  }

  const shops = await prisma.shop.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: {
          products: true,
          followers: true,
        },
      },
    },
  });

  const formattedShops = shops.map((shop) => ({
    ...shop,
    productCount: shop._count.products,
    followerCount: shop._count.followers,
  }));

  const totalRecords = await prisma.shop.count({ where });

  return {
    meta: {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
    },
    data: formattedShops,
  };
};

const updateShopIntoDB = async (
  shopId: string,
  data: any,
  file?: TFile
): Promise<Shop> => {
  const existingShop = await prisma.shop.findUnique({
    where: { id: shopId },
  });

  if (!existingShop) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Shop not found.");
  }

  let logo: string | null = existingShop.logo;
  if (file) {
    const uploadResult = await fileUploader.uploadImageToCloudinary(file);
    logo = uploadResult?.secure_url || null;
  }

  const updatedShopData = {
    ...data,
    ...(logo !== null && { logo }),
  };

  const updatedShop = await prisma.shop.update({
    where: { id: shopId },
    data: updatedShopData,
  });

  return updatedShop;
};

const updateShopStatusIntoDB = async (shopId: string, status: ShopStatus) => {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
  });

  if (!shop) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Shop not found");
  }

  const updatedShop = await prisma.shop.update({
    where: { id: shopId },
    data: { status },
  });

  return updatedShop;
};

export const ShopServices = {
  createShopIntoDB,
  updateShopIntoDB,
  updateShopStatusIntoDB,
  getAllShopsFromDB,
  getShopByOwnerFromDB,
};
