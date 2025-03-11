import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import handleAPI from "../../../configs/handleAPI";
import { API } from "../../../configs/appConfig";
import Loader from "../../../components/Loader/Loader";

import request from "../../../configs/handleAPI";

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  company?: string;
  position?: string;
  location?: string;
  profileComplete: boolean;
  profilePicture?: string;
}

interface AuthenticationContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const AuthenticationContext = createContext<AuthenticationContextType | null>(
  null
);

export function useAuthentication() {
  return useContext(AuthenticationContext)!;
}

const AuthenticationContextProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const isOnAuthPage =
    location.pathname === "/authentication/login" ||
    location.pathname === "/authentication/register" ||
    location.pathname === "/authentication/request-password-reset";


  const login = async (email: string, password: string) => {
    await handleAPI<{ token: string }>({
      endpoint: API.LOGIN,
      body: { email, password },
      method: "post",
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
      },
      onFailure: (error) => {
        console.error("Login failed:", error);
        throw new Error(error);
      }
    });
  };
  
  const register = async (email: string, password: string) => {
    await handleAPI<{ token: string }>({
      endpoint: API.REGISTER,
      body: { email, password },
      method: "post",
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
      },
      onFailure: (error) => {
        console.error("Registration failed:", error);
        throw new Error(error);
      }
    });
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };


  
  useEffect(() => {
    const fetchUser = async () => {

      setIsLoading(true);
      await request<User>({
        endpoint: API.FETCH_USER,
        method: "get",
        onSuccess: (data) => {
          setUser(data);
        },
        onFailure: (error) => {
          console.log(error)
        },
        onFinally: () => {
          setIsLoading(false);
        }
      })
    };

    if (user) {
      return;
    }
    fetchUser();
  }, [user, location.pathname]);
  useEffect(() => {
    console.log("🔄 user state changed:", user);
  }, [user]);
  
  useEffect(() => {
    console.log("📌 Current pathname:", location.pathname);
  }, [location.pathname]);
  

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && !user && !isOnAuthPage) {
    return <Navigate to="/authentication/login" state={{ from: location.pathname }} />;
  }

  if (user && !user.emailVerified && location.pathname !== "/authentication/verify-email") {
    return <Navigate to="/authentication/verify-email" />;
  }

  if (user && user.emailVerified && location.pathname == "/authentication/verify-email") {
    console.log("here1");
    return <Navigate to="/" />;
  }

  if (
    user &&
    user.emailVerified &&
    !user.profileComplete &&
    !location.pathname.includes("/authentication/profile")
  ) {
    return <Navigate to={`/authentication/profile/${user.id}`} />;
  }

  if (
    user &&
    user.emailVerified &&
    user.profileComplete &&
    location.pathname.includes("/authentication/profile")
  ) {
    console.log("here2");
    return <Navigate to="/" />;
  }

  if (user && isOnAuthPage) {
    return <Navigate to={location.state?.from || "/"} />;
  }
  
  
  return (
    <AuthenticationContext.Provider value={{ user, login, logout, register, setUser }}>
      <Outlet />
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContextProvider;
