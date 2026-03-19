import { IProject } from "../../models/Project";

declare module "express-serve-static-core" {
  interface Request {
    project: IProject;
  }
}