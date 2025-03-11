import { useEffect, useState } from "react";
import Box from "../../../../components/Box/Box";
import Input from "../../../../components/Input/Input";

import classes from "./VerifyEmail.module.scss";
import Button from "../../../../components/Button/Button";
import handleAPI from "../../../../configs/handleAPI";
import { API } from "../../../../configs/appConfig";

import { useNavigate } from "react-router-dom";
import { ErrorUtil } from "../../../../utils/errorUtils";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider";

const VerifyEmail = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuthentication();
  useEffect(() => {
    console.log("VerifyEmail component mounted!");
  }, []);
 

  const sendEmailVerificationToken = async () => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      await handleAPI(API.SEND_EMAIL_VERIFICATION_TOKEN, undefined, "put");
      setMessage("Code sent successfully. Please check your email.");
    } catch (error: unknown) {
      if (ErrorUtil.isErrorResponse(error)) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = async (code: string) => {
    setMessage("");
    setErrorMessage("");
    try {
      await handleAPI(`${API.VALIDATE_EMAIL}?token=${code}`, undefined, "put");
      setUser({ ...user!, emailVerified: true });
      navigate("/");
    } catch (error: unknown) {
      if (ErrorUtil.isErrorResponse(error)) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <>
      <div className={classes.root}>
        <Box>
          <h1>Verify your email</h1>
          <p className={classes.disclaimer}>
            Only one step left to complete your registration. Verify your email
            address.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsLoading(true);
              const code = e.currentTarget.code.value;
              await validateEmail(code);
              setIsLoading(false);
            }}
          >
            <Input
              type="text"
              label="Verification code"
              key={"code"}
              name="code"
              placeholder="Example: 012345"
            />
            {message && <p className={classes.message}>{message}</p>}
            {errorMessage && (
              <p className={classes.errorMessage}>{errorMessage}</p>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              style={{ width: "100%" }}
            >
              Submit
            </Button>
            <Button
              disabled={isLoading}
              style={{ width: "100%" }}
              variant="outline"
              onClick={() => sendEmailVerificationToken()}
            >
              Send again
            </Button>
          </form>
        </Box>
      </div>
    </>
  );
};

export default VerifyEmail;
