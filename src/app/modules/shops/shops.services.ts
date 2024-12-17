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
        select: { products: true },
      },
    },
  });
  // console.log(result, "prod");
  if (result) {
    return { ...result, productCount: result?._count.products };
  }
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
const getAllShopsForAllFromDB = async () => {
  const shops = await prisma.shop.findMany();

  return shops;
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
  console.log(updatedShopData, "service");
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

const getFollowedShops = async (userEmail: string) => {
  const user = await prisma.user.findFirst({
    where: { email: userEmail },
    include: { followedShops: true },
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user.followedShops;
};

const followShopIntoDB = async (userEmail: string, shopId: string) => {
  // Verify if the shop exists
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
  });
  if (!shop) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Shop not found");
  }
  // console.log(userEmail);
  // Find user by email
  const user = await prisma.user.findFirst({
    where: { email: userEmail },
  });
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const userId = user.id;

  const existingFollower = await prisma.shopFollower.findUnique({
    where: {
      userId_shopId: { userId, shopId },
    },
  });

  if (existingFollower) {
    throw new ApiError(StatusCodes.CONFLICT, "Already following the shop");
  }
  console.log(userId, shopId);
  const follower = await prisma.shopFollower.create({
    data: {
      userId: userId,
      shopId: shopId,
      followedAt: new Date(),
    },
  });
  // console.log(follower);
  return follower;
};

const unfollowShopIntoDB = async (userEmail: string, shopId: string) => {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
  });
  if (!shop) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Shop not found");
  }

  const user = await prisma.user.findFirst({
    where: { email: userEmail },
  });
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  const userId = user.id;

  console.log(userId, shopId);
  const followerRecord = await prisma.shopFollower.findUnique({
    where: {
      userId_shopId: { userId, shopId },
    },
  });

  if (!followerRecord) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Follow record not found");
  }

  console.log(user);

  const follower = await prisma.shopFollower.delete({
    where: {
      userId_shopId: { userId, shopId },
    },
  });

  return follower;
};

const getShopDetailsFromDB = async (shopId: string) => {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      products: true,
      followers: true,
    },
  });

  if (!shop) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Shop not found");
  }

  return shop;
};

export const ShopServices = {
  createShopIntoDB,
  updateShopIntoDB,
  updateShopStatusIntoDB,
  getAllShopsFromDB,
  getAllShopsForAllFromDB,
  getShopByOwnerFromDB,
  getFollowedShops,
  unfollowShopIntoDB,
  followShopIntoDB,
  getShopDetailsFromDB,
};
