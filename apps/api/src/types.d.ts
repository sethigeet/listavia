import { User } from "@prisma/client";
import { Request as ExpressReq } from "express";

interface Request extends ExpressReq {
  user?: User;
}
