import { Request, Response } from "express";
import { User } from "../models/User";
import { hashPassword } from "../utils/auth";

export class AutController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      const userExist = await User.findOne({ email });

      if (userExist) {
        const error = new Error("El usuario ya esta registrado");
        return res.status(409).json({ error: error.message });
      }
      const user = new User(req.body);

      user.password = await hashPassword(password);
      await user.save();

      res.send(
        "Usuario creado correctamente, verifica tu correo para confirma la cuenta"
      );
    } catch (error) {
      res.status(400).json({ error: "Error al crear el usuario" });
    }
  };
}
