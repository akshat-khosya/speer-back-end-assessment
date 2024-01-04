import { Express, Request } from "express";
import mongoose from "mongoose";
declare global {
  namespace Express {
    interface Request {
      imageName?: string;
      userId?: mongoose.Types.ObjectId;
    }
  }
}
