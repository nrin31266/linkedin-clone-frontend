import { ReactNode } from 'react';
import classes from './Divider.module.scss';

const Divider = ({children}: {children?:ReactNode}) => {
  return (
    <div className={`${classes.root} ${children? classes.hasChildren : ""}`}>
      {children}
    </div>
  );
};

export default Divider;