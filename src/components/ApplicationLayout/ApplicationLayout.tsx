import { Outlet } from 'react-router-dom';
import classes from './ApplicationLayout.module.scss';
import HeaderComponent from '../HeaderComponent/HeaderComponent';
import WebSocketProvider from '../../features/ws/Ws';

const ApplicationLayout = () => {
  return (
    <WebSocketProvider>
      <div className={classes.root}>
      <HeaderComponent/>
      <main className={classes.container}>
        <Outlet/>
      </main>
    </div>
    </WebSocketProvider>
  );
};

export default ApplicationLayout;