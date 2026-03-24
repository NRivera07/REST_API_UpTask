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
      res.send("Tarea creada correctamente");
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
      res.json(req.task);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
  static updateTask = async (req: Request, res: Response) => {
    try {
      req.task.name = req.body.name || req.task.name;
      req.task.description = req.body.description || req.task.description;
      await req.task.save();
      res.send("Tarea actualizada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
  static deleteTask = async (req: Request, res: Response) => {
    try {
      req.project.tasks = req.project.tasks.filter(
        (task) => task.toString() !== req.task._id.toString()
      );

      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
      res.send("Tarea eliminada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
  static updateStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      req.task.status = status;
      await req.task.save();
      res.send("Estado de la tarea actualizado");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
