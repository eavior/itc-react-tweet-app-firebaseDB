import { createContext } from "react";

export const AuthContext = createContext({
  authUser: null,
  authStorage: null,
  login: (authUser) => {},
  logout: () => {},
});
