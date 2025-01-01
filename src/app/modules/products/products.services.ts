import { pagination } from "../../../helpers/pagination";
import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/apiErrors";
import { Product, ProductStatus, ShopStatus } from "@prisma/client";
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

  let imageUrl = payload.imageUrl;

  const file = req.file as TFile;
  // console.log(file);
  if (file != null) {
    const uploadToCloudinary = await fileUploader.uploadImageToCloudinary(file);
    imageUrl = uploadToCloudinary?.secure_url;
  }

  // Prepare product data
  const productInfo = {
    ...payload,
    imageUrl,
  };
  console.log(productInfo);
  // Create product in the database
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
      OrderItem: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profilePhoto: true,
            },
          },
        },
      },
    },
  });
};

const getProductsByCategoryIdFromDB = async (categoryId: string) => {
  const result = await prisma.product.findMany({
    where: { categoryId },
    include: {
      shop: true,
      reviews: true,
    },
  });
  // console.log(result, categoryId, "categoryyyyyyyyyyy");
  return result;
};

const updateProductIntoDB = async (id: string, req: any) => {
  const payload = req.body;

  const productExists = await prisma.product.findUnique({
    where: { id: id },
  });
  console.log(productExists);
  if (!productExists) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Shop ID.");
  }

  let imageUrl = payload.imageUrl;

  const file = req.file as TFile;
  if (file != null) {
    const uploadToCloudinary = await fileUploader.uploadImageToCloudinary(file);
    imageUrl = uploadToCloudinary?.secure_url;
  }

  // Prepare product data
  const productInfo = {
    ...payload,
    imageUrl,
  };
  console.log(productInfo);
  return await prisma.product.update({
    where: { id },
    data: productInfo,
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
  const { page = 1, limit = 8 } = options;
  const skip = (page - 1) * limit;

  const where: Record<string, any> = {
    isDeleted: false,
    status: "ACTIVE",
    stock: { gt: 0 },
  };

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.category) {
    where.categoryId = filters.category;
  }

  if (filters.shop) {
    where.shopId = filters.shop;
  }

  const products = await prisma.product.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      [options.sortBy || "createdAt"]: options.sortOrder || "desc",
    },
    include: {
      shop: true,
      category: true,
      OrderItem: true,
      reviews: true,
    },
  });

  // Further filter products if necessary
  const filteredProducts = products.filter((product) => {
    const effectivePrice =
      product.flashSalePrice ||
      (product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price);

    return (
      (!filters.minPrice || effectivePrice >= filters.minPrice) &&
      (!filters.maxPrice || effectivePrice <= filters.maxPrice)
    );
  });

  const total = await prisma.product.count({ where });
  const hasNextPage = skip + limit < total;

  return {
    meta: {
      total,
      page,
      limit,
      hasNextPage,
    },
    data: filteredProducts,
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

  const where: any = {};
  if (filters.searchTerm) {
    where.name = { contains: filters.searchTerm, mode: "insensitive" };
  }
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
  return {
    meta: { total, page, limit },
    data,
  };
};

const getAllProductsForVendorFromDB = async (
  filters: Record<string, any>,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  },
  email: string
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    pagination.calculatePagination(options);

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");

  const shop = await prisma.shop.findFirst({
    where: {
      ownerId: user.id,
    },
  });

  if (!shop) throw new ApiError(StatusCodes.NOT_FOUND, "Shop not found");
  console.log(email, shop);
  // const where: any = {};
  const where: any = {
    shopId: shop.id,
  };
  if (filters.searchTerm) {
    where.name = { contains: filters.searchTerm, mode: "insensitive" };
  }

  // Add shopId filter if provided
  // if (filters.shopId) {
  //   where.shopId = filters.shopId;
  // }

  // Add shop status filter if provided
  // if (filters.shopStatus) {
  //   where.shop = { status: ShopStatus.ACTIVE };
  // }
  // console.log("hit");
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
  return {
    meta: { total, page, limit },
    data,
  };
};

const getFlashSaleProductsFromDB = async (
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

  const where: Record<string, any> = {
    isDeleted: false,
    status: "ACTIVE",
    stock: { gt: 0 },
    isFlashSale: true,
    flashSaleEndDate: { gte: new Date() },
  };

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.category) {
    where.categoryId = filters.category;
  }

  if (filters.shop) {
    where.shopId = filters.shop;
  }

  if (filters.maxPrice !== null) {
    where.flashSalePrice = { lte: filters.maxPrice };
  }

  console.log(
    "Prisma `where` clause for fetch:",
    JSON.stringify(where, null, 2)
  );

  const products = await prisma.product.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      [options.sortBy || "createdAt"]: options.sortOrder || "desc",
    },
    include: {
      shop: true,
      category: true,
      OrderItem: true,
      reviews: true,
    },
  });

  const total = await prisma.product.count({ where });
  const hasNextPage = skip + products.length < total;

  console.log(
    "Total products:",
    total,
    "Current Fetch:",
    products.length,
    "Has next page:",
    hasNextPage
  );

  return {
    meta: {
      total,
      page,
      limit,
      hasNextPage,
    },
    data: products,
  };
};

const getBestSellingProductsFromDB = async () => {
  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId"], // Group by productId
    _sum: {
      quantity: true, // Sum up the quantity for each product
    },
    orderBy: {
      _sum: {
        quantity: "desc", // Sort by the summed quantity in descending order
      },
    },
    take: 9, // Limit to the top 9
  });
  console.log(topProducts, "topProducts");
  // Directly fetch product details alongside quantities
  const bestsellingProducts = await prisma.product.findMany({
    where: {
      id: {
        in: topProducts.map((item) => item.productId),
      },
      isDeleted: false,
    },
    include: {
      shop: true, // Include related shop details
      category: true, // Include category details
    },
    orderBy: {
      id: "desc", // Optionally sort products by ID or other criteria
    },
  });

  return bestsellingProducts.map((product) => {
    const quantity = topProducts.find((item) => item.productId === product.id)
      ?._sum?.quantity;
    console.log({ ...product });
    return {
      ...product,
      totalQuantitySold: quantity || 0,
    };
  });
};

export const ProductServices = {
  createProductIntoDB,
  getProductByIdFromDB,
  getProductsByCategoryIdFromDB,
  updateProductIntoDB,
  updateProductStatusIntoDB,
  deleteProductFromDB,
  getAllProductsFromDB,
  getAllProductsForAdminFromDB,
  getAllProductsForVendorFromDB,
  getFlashSaleProductsFromDB,
  getBestSellingProductsFromDB,
};
