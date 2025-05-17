import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import trpc from "src/trpc";

import * as types from "src/schema";

interface AuthContextType {
  user: types.UserT | null;
  auth: string;
  login: (authToken: string, userData: types.UserT) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<types.UserT | null>(null);
  const [auth, setAuth] = useState<string>(
    localStorage.getItem("authFinTrack") || ""
  );

  const login = (authToken: string, userData: types.UserT) => {
    setAuth(authToken);
    setUser(userData);
    localStorage.setItem("authFinTrack", authToken);
  };

  const logout = () => {
    setUser(null);
    setAuth("");
    localStorage.removeItem("authFinTrack");
    window.location.href = "/";
  };

  useEffect(() => {
    if (!auth) return;

    const fetchUser = async () => {
      try {
        const userData = await types.UserS.validate(
          await trpc.auth.auth.query()
        );

        setUser(userData);
      } catch (error) {
        console.error(error);
        logout();
        alert("Auth failed:  Authentication required or token expired");
      }
    };

    fetchUser();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
