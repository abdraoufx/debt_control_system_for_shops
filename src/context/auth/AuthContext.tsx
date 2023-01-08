import React, { createContext, useState } from "react";
import { AuthContextType } from "../../types/authContextTypes";

type Props = {
  children: React.ReactNode;
};

const ctxDefaultValue = {
  currentUser: null,
  setCurrentUser: () => {},
};

export const AuthContextAPI = createContext<AuthContextType>(ctxDefaultValue);

const AuthContext = ({ children }: Props) => {
  const defaultUser =
    JSON.parse(localStorage.getItem("user") as string) || null;

  const [currentUser, setCurrentUser] = useState<
    AuthContextType["currentUser"] | null
  >(defaultUser);

  return (
    <AuthContextAPI.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContextAPI.Provider>
  );
};

export default AuthContext;
