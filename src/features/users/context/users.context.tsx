"use client";

import { createContext } from "react";
import { UsersContextType } from "../types/UsersContextType";

export const UsersContext = createContext<UsersContextType | undefined>(undefined);
