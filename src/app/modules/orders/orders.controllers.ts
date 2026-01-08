import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { OrdersServices } from "./orders.services";
import pick from "../../../helpers/pick";

const orderFilterableFields = ["shopId", "userId", "searchTerm"];
const paginationFields = ["limit", "page", "sortBy", "sortOrder"];

//   const { userId, items, totalPrice, shippingInfo, paymentIntentId } = req.body;
//   const order = await OrderServices.createOrder(
//     userId,
//     items,
//     totalPrice,
//     shippingInfo,
//     paymentIntentId
//   );

//   sendResponse(res, {
//     statusCode: StatusCodes.CREATED,
//     success: true,
//     message: "Order created successfully",
//     data: order,
//   });
// });

const processOrderPayment = catchAsync(async (req, res) => {
  const {
    userId,
    shopId,
    items,
    totalPrice,
    couponId,
    shippingInfo,
    paymentIntentId,
  } = req.body;

  const result = await OrdersServices.processOrderAndPaymentIntoDB(
    userId,
    shopId,
    items,
    totalPrice,
    couponId,
    shippingInfo,
    paymentIntentId
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order and payment processed successfully",
    data: result,
  });
});

// Get all orders (Admin view)
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  console.log("object");
  const filters = pick(req.query, orderFilterableFields);

  const options = {
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy ? String(req.query.sortBy) : "createdAt",
    sortOrder: req.query.sortOrder ? String(req.query.sortOrder) : "desc",
  };

  console.log(filters);

  const result = await OrdersServices.getAllOrdersFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All orders retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// Get orders by shop (for vendors)
const getOrdersByShop = catchAsync(async (req, res) => {
  const { email } = req.user;
  console.log(email);
  // const filters = pick(req.query, orderFilterableFields);
  const filters = pick(req.query, ["shopId", "orderId", "searchTerm"]);
  const options = pick(req.query, paginationFields);

  const result = await OrdersServices.getOrdersByShopFromDB(
    filters,
    options,
    email
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Orders retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

//details of shop order by id
const getShopOrderDetailsById = catchAsync(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const userEmail = req.user.email;

    const orderDetails = await OrdersServices.getShopOrderDetailsById(
      orderId,
      userEmail
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Order details retrieved successfully.",
      data: orderDetails,
    });
  }
);

const getOrdersByUser = catchAsync(async (req: Request, res: Response) => {
  const userEmail = req.user.email;

  const filters = pick(req.query, orderFilterableFields);

  const options = pick(req.query, paginationFields);

  const result = await OrdersServices.getOrdersByUserFromDB(
    filters,
    options,
    userEmail
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User purchase history retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getUserOrderDetails = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userEmail = req.user.email;

  const orderDetails = await OrdersServices.getUserOrderDetailsByIdFromDB(
    orderId,
    userEmail
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order details retrieved successfully!",
    data: orderDetails,
  });
});

export const OrdersControllers = {
  getAllOrders,
  getOrdersByShop,
  getOrdersByUser,
  getShopOrderDetailsById,
  processOrderPayment,
  getUserOrderDetails,
};
