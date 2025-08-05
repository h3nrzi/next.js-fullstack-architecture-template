import { z } from "zod";
import { registerSchema } from "../schema/auth.schema";

export type RegisterInput = z.infer<typeof registerSchema>;
