import { Link, useNavigate } from "react-router-dom";
import Box from "../../../../components/Box/Box";
import Button from "../../../../components/Button/Button";
import Divider from "../../../../components/Divider/Divider";
import Input from "../../../../components/Input/Input";
import classes from "./Register.module.scss";
import { FormEvent, useState } from "react";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider";
import { ErrorUtil } from "../../../../utils/errorUtils";


const Register = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { register} = useAuthentication();
  const [ isLoading, setIsLoading ] = useState(false);
  const navigate = useNavigate();

  const doRegister= async (e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;


    try {
      await register(email, password);
      navigate("/");
    } catch (error: unknown) {
      if(ErrorUtil.isErrorResponse(error)){
        setErrorMessage(error.message)
      }
    }finally{
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className={classes.root}>
        <Box>
          <h1>Register</h1>
          <p>Make the most of your professional life.</p>
          <form onSubmit={doRegister}>
            <Input required placeholder="Email or phone" type="email" name="email" id="email" label="Email" />
            <Input required placeholder="Password" type="password" name="password" id="password" label="Password" />
            {errorMessage&& <p className={classes.errorMessage}>{errorMessage}</p>}

            <p className={classes.disclaimer}>
              By clicking Agree & Join or Continue, you agree to the LinkedIn{" "}
              <a href="">User Agreement</a>, <a href="">Privacy Policy</a>, and <a href="">Cookie Policy</a>.
            </p>
            <Button disabled={isLoading} style={{ width: "100%" }} type="submit">
              Agree & Join
            </Button>
            <Divider>Or</Divider>
            <p style={{textAlign: 'center'}}>
              Already on LinkedIn?{" "}
              <Link to={"/authentication/login"}>Login</Link>
            </p>
          </form>
        </Box>
      </div>
    </>
  );
};

export default Register;
