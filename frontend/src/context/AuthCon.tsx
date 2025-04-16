import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "../schemas";

const BASE_URL = process.env.BASE_URL;

interface AuthContextType {
  user: User | null;
  login: (user: User, auth: string) => void;
  logout: () => void;
  auth: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [auth, setAuth] = useState<string | null>(localStorage.getItem("auth"));

  const login = (user: User, auth: string) => {
    console.log({ user, auth });

    setUser(user);
    setAuth(auth);
    localStorage.setItem("auth", auth);
  };

  const logout = () => {
    setUser(null);
    setAuth("");
    localStorage.removeItem("auth");
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (auth) {
        try {
          const response = await fetch(`${BASE_URL}/auth/auth`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${auth}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Fetch failed with status ${response.status}`);
          }

          const data = await response.json();
          const { user } = data.results;
          setUser(user);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };

    fetchUser();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, login, logout, auth: auth || "" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
