"use client";

import { createContext } from "react";
import { AuthContextType } from "../types/AuthContextType";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
