import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import handleAPI from "../../../configs/handleAPI";
import { API } from "../../../configs/appConfig";
import Loader from "../../../components/Loader/Loader";
import { ErrorUtil } from "../../../utils/errorUtils";

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName?: string
  lastName?: string
  company?: string
  position?: string
  location?: string
  profileComplete: boolean
  profilePicture?: string
}

interface AuthenticationContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
    const res = await handleAPI(API.LOGIN, { email, password }, "post");
    localStorage.setItem("token", res.data.data.token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const register = async (email: string, password: string) => {
    const res = await handleAPI(API.REGISTER, { email, password }, "post");
    localStorage.setItem("token", res.data.data.token);
  };

  const fetchUser = async () => {
    try {
      if (!isOnAuthPage) {
        const res = await handleAPI(API.FETCH_USER);
        setUser(res.data.data);
      }
    } catch (error: unknown) {
      if (ErrorUtil.isErrorResponse(error)) {
        console.error(`Error Code: ${error.code}, Message: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      return;
    }
    fetchUser();
  }, [user, location.pathname]);

  if (isLoading) {
    return <Loader />;
  } else if (!isLoading && !user && !isOnAuthPage) {
    return <Navigate to={"/authentication/login"} />;
  } else if (user && user.emailVerified && isOnAuthPage) {
    return <Navigate to={"/"} />;
  }

  return (
    <AuthenticationContext.Provider value={{ user, login, logout, register }}>
      {user && !user.emailVerified && (
        <Navigate to={"/authentication/verify-email"} />
      )}
      <Outlet />
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContextProvider;
