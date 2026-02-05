import prisma from "../../../../shared/prisma";

export const topCategorySales = async (givenDate: Date) => {
  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      order: { createdAt: { gte: givenDate }, paymentStatus: "PAID" },
    },
    _sum: {
      quantity: true,
      price: true,
    },
    orderBy: { _sum: { price: "desc" } },
  });

  const productSalesData = topProducts.map((p) => ({
    productId: p.productId,
    totalRevenue: p._sum.price || 0,
  }));

  // Get product categories
  const productIds = productSalesData.map((p) => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      category: { select: { name: true } },
    },
  });

  // Get total sales
  const totalSales = await prisma.order.aggregate({
    where: {
      createdAt: { gte: givenDate },
      paymentStatus: "PAID",
    },
    _sum: { totalPrice: true },
  });

  const totalRevenue = totalSales._sum.totalPrice || 1;

  const categoryRevenue: { [key: string]: number } = {};

  productSalesData.forEach((sale) => {
    const product = products.find((p) => p.id === sale.productId);
    const categoryName = product?.category?.name || "Uncategorized";

    if (!categoryRevenue[categoryName]) {
      categoryRevenue[categoryName] = 0;
    }
    categoryRevenue[categoryName] += sale.totalRevenue;
  });

  let highestCategory = "No Category";
  let highestPercentage = 0;

  for (let categoryName in categoryRevenue) {
    const revenue = categoryRevenue[categoryName];
    const percentage = (revenue / totalRevenue) * 100;

    if (percentage > highestPercentage) {
      highestPercentage = percentage;
      highestCategory = categoryName;
    }
  }

  return {
    name: highestCategory,
    percentage: Math.round(highestPercentage * 10) / 10,
  };
};
