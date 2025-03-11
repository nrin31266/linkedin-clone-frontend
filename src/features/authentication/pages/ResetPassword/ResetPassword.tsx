import { useNavigate } from "react-router-dom";
import Box from "../../../../components/Box/Box";
import Button from "../../../../components/Button/Button";
import Input from "../../../../components/Input/Input";

import classes from "./ResetPassword.module.scss";
import { FormEvent, useState } from "react";
import handleAPI from "../../../../configs/handleAPI";
import { API } from "../../../../configs/appConfig";


const ResetPassword = () => {
  const navigate = useNavigate();
  const [sentToEmail, setSentToEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendResetPasswordToken = async (email: string) => {
    setErrorMessage("");
  
    await handleAPI<void>({
      endpoint: `${API.RESET_PASSWORD_TOKEN}?email=${email}`,
      method: "put",
      onSuccess: () => {
        setSentToEmail(email);
      },
      onFailure: (error) => {
        setErrorMessage(error);
      }
    });
  };
  

  const doResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
  
    const formData = new FormData(e.currentTarget);
    const request = {
      token: formData.get("token"),
      newPassword: formData.get("newPassword"),
      email: sentToEmail,
    };
  
    await handleAPI<void>({
      endpoint: API.RESET_PASSWORD,
      body: request,
      method: "put",
      onSuccess: () => {
        navigate("/authentication/login");
      },
      onFailure: (error) => {
        setErrorMessage(error);
      },
      onFinally: () => {
        setIsLoading(false);
      }
    });
  };
  

  return (
    <>
      <div className={classes.root}>
        <Box>
          <h1>Forgot password</h1>
          {!sentToEmail ? (
            <>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  const formData = new FormData(e.currentTarget);
                  const email = formData.get("email") as string;
                  await sendResetPasswordToken(email);
                  setIsLoading(false);
                }}
              >
                <Input
                  required
                  label="Email"
                  id="email"
                  name="email"
                  placeholder="Email"
                />
                {errorMessage && (
                  <p className={classes.errorMessage}>{errorMessage}</p>
                )}
                <p className={classes.disclaimer}>
                  We’ll send a verification code to this email or phone number
                  if it matches an existing LinkedIn account.
                </p>
                <Button
                  disabled={isLoading}
                  type="submit"
                  style={{ width: "100%" }}
                >
                  Next
                </Button>
              </form>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  onClick={() => navigate("/login")}
                  style={{ marginTop: "0" }}
                  variant="text"
                  disabled={isLoading}
                >
                  Back
                </Button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={doResetPassword}>
                <p className={classes.disclaimer}>
                  If you don’t see the email in your inbox, check your spam
                  folder. If it’s not there, the email address may not be
                  confirmed, or it may not match an existing LinkedIn account.
                </p>
                <Input
                  id="token"
                  name="token"
                  required
                  label="6-digit code"
                  placeholder="6-digit code"
                />
                <Input
                  id="newPassword"
                  name="newPassword"
                  required
                  label="New password"
                  placeholder="New password"
                />
                {errorMessage && (
                  <p className={classes.errorMessage}>{errorMessage}</p>
                )}
                <Button
                  disabled={isLoading}
                  type="submit"
                  style={{ width: "100%" }}
                >
                  Reset password
                </Button>
              </form>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  disabled={isLoading}
                  onClick={() => setSentToEmail("")}
                  style={{ marginTop: "0" }}
                  variant="text"
                >
                  Back
                </Button>
              </div>
            </>
          )}
        </Box>
      </div>
    </>
  );
};

export default ResetPassword;
