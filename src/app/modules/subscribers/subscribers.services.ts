import { ActiveStatus, PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const subscribeToNewsletter = async (email: string) => {
  const existingSubscriber = await prisma.newsletter.findUnique({
    where: { email },
  });

  if (existingSubscriber) {
    throw new Error("This email is already subscribed.");
  }

  return await prisma.newsletter.create({
    data: { email },
  });
};

const getAllSubscribers = async () => {
  console.log("in news");
  return await prisma.newsletter.findMany({
    where: { isSubscribed: true },
    orderBy: { createdAt: "desc" },
  });
};

const unsubscribeFromNewsletter = async (id: string) => {
  return await prisma.newsletter.update({
    where: { id },
    data: { isSubscribed: false },
  });
};

export const SubscriberServices = {
  subscribeToNewsletter,
  getAllSubscribers,
  unsubscribeFromNewsletter,
};
