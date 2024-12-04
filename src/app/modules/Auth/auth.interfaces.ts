import { UserRole } from "@prisma/client";

type TRegisterUser = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};
