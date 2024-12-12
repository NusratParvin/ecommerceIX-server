import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../helpers/pick";
import { ShopServices } from "./shops.services";
import { TFile } from "../../interfaces/fileUpload";

const createShop = catchAsync(async (req: Request, res: Response) => {
  const shop = await ShopServices.createShopIntoDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Shop created successfully!",
    data: shop,
  });
});

const getMyShop = catchAsync(async (req, res) => {
  const user = req.user;
  console.log(user);
  const shop = await ShopServices.getShopByOwnerFromDB(user.email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shop retrieved successfully",
    data: shop,
  });
});

const getAllShops = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm", "status", "ownerId"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await ShopServices.getAllShopsFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shops fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});
const getAllShopsForAll = catchAsync(async (req: Request, res: Response) => {
  const result = await ShopServices.getAllShopsForAllFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shops fetched successfully!",
    data: result,
  });
});

const updateShop = catchAsync(async (req: Request, res: Response) => {
  const { shopId } = req.params;
  const data = req.body;

  // const data = req.body;
  const file = req.file as TFile | undefined;
  console.log(data, file, "con");
  const updatedShop = await ShopServices.updateShopIntoDB(shopId, data, file);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shop updated successfully!",
    data: updatedShop,
  });
});

const updateShopStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const updatedShop = await ShopServices.updateShopStatusIntoDB(id, status);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Shop status updated to ${status}`,
    data: updatedShop,
  });
});

const fetchFollowedShops = catchAsync(async (req: Request, res: Response) => {
  const userEmail = req.user?.email;
  // console.log(userEmail);
  if (!userEmail) {
    return sendResponse(res, {
      success: false,
      statusCode: 401,
      message: "Unauthorized",
    });
  }
  const followedShops = await ShopServices.getFollowedShops(userEmail);

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Followed shops fetched successfully",
    data: { followedShops },
  });
});

export const ShopControllers = {
  createShop,
  getAllShops,
  getAllShopsForAll,
  getMyShop,
  updateShop,
  updateShopStatus,
  fetchFollowedShops,
};
