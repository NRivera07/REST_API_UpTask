import { Router } from "express";
import { AutController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post(
  "/createAccount",
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe de tener mínimo 8 caracteres")
    .notEmpty()
    .withMessage("La contraseñas es obligatorio"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no coinciden");
    }
  }),
  body("email")
    .isEmail()
    .withMessage("El email no es válido")
    .notEmpty()
    .withMessage("El nombre es obligatorio"),
  handleInputErrors,
  AutController.createAccount
);

export default router;
