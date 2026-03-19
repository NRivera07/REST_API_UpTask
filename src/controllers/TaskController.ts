import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      task.project = req.project._id;
      req.project.tasks.push(task);

      console.log(task);
      await Promise.allSettled([task.save(), req.project.save()]);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
  static getProjectTask = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const task = await Task.find({ project: projectId }).populate("project"); //unir informacion detallada del proyecto a la tarea
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
  static getTaskById = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId).populate("project");
      if (!task) {
        const error = new Error("Tarea no econtrada");
        return res.status(404).json({ error: error.message });
      }
      if (task.project.toString() !== req.project._id.toString()) {
        const error = new Error("La tarea no pertenece a este proyecto");
        return res.status(400).json({ error: error.message });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
  static updateTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findByIdAndUpdate(taskId, req.body);
      if (!task) {
        const error = new Error("Tarea no econtrada");
        return res.status(404).json({ error: error.message });
      }
      if (task.project.toString() !== req.project._id.toString()) {
        const error = new Error("La tarea no pertenece a este proyecto");
        return res.status(400).json({ error: error.message });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
  static deleteTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId);
      if (!task) {
        const error = new Error("Tarea no econtrada");
        return res.status(404).json({ error: error.message });
      }
      if (task.project.toString() !== req.project._id.toString()) {
        const error = new Error("La tarea no pertenece a este proyecto");
        return res.status(400).json({ error: error.message });
      }
      req.project.tasks = req.project.tasks.filter(
        (task) => task.toString() !== taskId.toString()
      );

      await Promise.allSettled([task.deleteOne(), req.project.save()]);
      res.send("Tarea eliminada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
