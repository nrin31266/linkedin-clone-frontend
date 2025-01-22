import { ButtonHTMLAttributes, ReactNode } from "react";
import classes from "./Button.module.scss";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "outline" | "text" | "";
  children?: ReactNode
  size?: "small" | "medium" | "large"
};

const Button = ({size, variant, children, ...others }: ButtonProps) => {
  return (
    <button {...others} className={`${classes.root} ${variant ? classes[variant]  : ""} ${classes[size || "large"]}`}>
      {children?? "Button"}
    </button>
  );
};

export default Button;
