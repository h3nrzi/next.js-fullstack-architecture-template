import { z } from "zod";
import { loginSchema } from "../schema/auth.schema";

export type LoginInput = z.infer<typeof loginSchema>;
