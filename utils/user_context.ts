import { createContext } from "preact";
import { LoginUser } from "./types.ts";

export const UserContext = createContext<LoginUser | undefined>(undefined);
