import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (error) {
      console.log(error);
    }
  };
  static getProjectsById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const project = await Project.findById(id).populate("tasks");
      if (!project) {
        const error = new Error("Proyecto no econtrado");
        return res.status(404).json({ error: error.message });
      }
      res.json(project);
    } catch (error) {
      console.log(error);
    }
  };
  static updateProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const project = await Project.findByIdAndUpdate(id, req.body);
      if (!project) {
        const error = new Error("Proyecto no econtrado");
        return res.status(404).json({ error: error.message });
      }

      await project.save();
    } catch (error) {
      console.log(error);
    }
  };
  static deleteProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const project = await Project.findByIdAndDelete(id);
      if (!project) {
        const error = new Error("Proyecto no econtrado");
        return res.status(404).json({ error: error.message });
      }

      await project.save();
    } catch (error) {
      console.log(error);
    }
  };
  static createProjects = async (req: Request, res: Response) => {
    const project = new Project(req.body);

    try {
      await project.save();
      res.send("Proyecto creado correctamente");
    } catch (error) {
      console.log(error);
    }
  };
}
