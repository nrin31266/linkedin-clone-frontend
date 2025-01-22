import { Outlet } from 'react-router-dom';
import classes from './ApplicationLayout.module.scss';
import HeaderComponent from '../HeaderComponent/HeaderComponent';

const ApplicationLayout = () => {
  return (
    <div className={classes.root}>
      <HeaderComponent/>
      <main className={classes.container}>
        <Outlet/>
      </main>
    </div>
  );
};

export default ApplicationLayout;