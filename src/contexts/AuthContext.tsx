import React, { useState, createContext, ReactNode } from "react";
import { NavigateFunction } from "react-router-dom";
import { toast } from "react-hot-toast";

import { User } from "../types";
import request from "../server/request";
import { KEY, SECRET, USER } from "../constants";

interface AuthContextType {
  user: User | null;
  register: (data: User, navigate: NavigateFunction) => void;
  logout: (navigate: NavigateFunction) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const storedUser = localStorage.getItem(USER);
  const [user, setUser] = useState<User | null>(
    storedUser ? JSON.parse(storedUser) : null
  );

  const register = async (userData: User, navigate: NavigateFunction) => {
    setUser(userData);
    const {
      data: { data: resData },
    } = await request.post("signup", {
      ...userData,
      key: KEY,
      secret: SECRET,
    });
    localStorage.setItem(USER, JSON.stringify(resData));
    setUser(resData);
    toast.success("Register successfully !");
    navigate("/dashboard");
  };

  const logout = (navigate: NavigateFunction) => {
    setUser(null);
    localStorage.removeItem(USER);
    navigate("/register");
  };

  return (
    <AuthContext.Provider value={{ user, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
