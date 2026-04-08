import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(4, "Contraseña inválida")
});

export const transferSchema = z.object({
  fromAccountId: z.string().min(1, "Selecciona cuenta origen"),
  toAccountId: z.string().min(1, "Selecciona cuenta destino"),
  amount: z.coerce.number().positive("Monto inválido"),
  note: z.string().trim().max(120, "Nota demasiado larga").optional().or(z.literal(""))
});

export const profileSchema = z.object({
  fullName: z.string().min(2, "Nombre inválido").max(80, "Nombre demasiado largo"),
  phone: z.string().max(30, "Teléfono demasiado largo").optional().or(z.literal("")),
  preferredLanguage: z.enum(["es-NZ", "en-NZ"]).default("es-NZ")
});
