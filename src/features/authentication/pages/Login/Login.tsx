import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Box from "../../../../components/Box/Box";
import Button from "../../../../components/Button/Button";
import Divider from "../../../../components/Divider/Divider";
import Input from "../../../../components/Input/Input";

import classes from "./Login.module.scss";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider";
import { ErrorUtil } from "../../../../utils/errorUtils";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { login } = useAuthentication();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const doLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage("");
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      const destination = location.state?.from || "/";
      navigate(destination);
    } catch (error: unknown) {
      if (ErrorUtil.isErrorResponse(error)) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={classes.root}>
        <Box>
          <h1>Login</h1>
          <p>Stay updated on your professional world.</p>
          <form onSubmit={(e) => doLogin(e)}>
            <Input
              required
              placeholder="Email"
              type="email"
              id="email"
              label="Email"
              name="email"
            />
            <Input
              required
              placeholder="Password"
              type="password"
              id="password"
              label="Password"
              name="password"
            />
            {errorMessage && (
              <p className={classes.errorMessage}>{errorMessage}</p>
            )}
            <Link to={"/authentication/request-password-reset"}>
              Forgot password?
            </Link>
            <Button
              disabled={isLoading}
              style={{ width: "100%" }}
              type="submit"
            >
              {isLoading ? "..." : "Login"}
            </Button>
            <Divider>Or</Divider>
            <p style={{ textAlign: "center" }}>
              New a LinkedIn?{" "}
              <Link to={"/authentication/register"}>Join now</Link>
            </p>
          </form>
        </Box>
      </div>
    </>
  );
};

export default Login;
