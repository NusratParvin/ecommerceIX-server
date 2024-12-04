import express, { Application, Response, Request, NextFunction } from "express";
import cors from "cors";
import router from "./app/routes";
import { StatusCodes } from "http-status-codes";
import cookieParser from "cookie-parser";
import globalErrorHandlers from "./app/middlewares/globalErrorHandlers";

const app: Application = express();

// app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Welcome to IX-Server ",
  });
});

app.use(globalErrorHandlers);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    status: StatusCodes.NOT_FOUND,
    message: `${req.originalUrl} - Your requested path is not found!`,
  });
});

export default app;
