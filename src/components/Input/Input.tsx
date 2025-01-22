import { InputHTMLAttributes } from 'react';
import classes from './Input.module.scss';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  customSize?: "small" | "medium" | "large"; 
  width?: number
};


const Input = (
  {customSize,label, width,...otherProps} : InputProps
) => {
  return (
    <div className={`${classes.root} ${classes[customSize?? "large"]}`}>
      {label && <div className={classes.label}>{label}</div>}
      <input style={{
        width: width? `${width}px` : '100%'
      }} {...otherProps} />
    </div>
  );
};

export default Input;