import { Outlet } from 'react-router-dom';
import classes from './ApplicationLayout.module.scss';
import HeaderComponent from '../HeaderComponent/HeaderComponent';
import WebSocketProvider from '../../features/ws/Ws';
import { useEffect } from 'react';

const ApplicationLayout = () => {

  const audioContext =new AudioContext();

  useEffect(() => {
    const enableAudio = () => {
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
      document.removeEventListener("click", enableAudio);
    };

    document.addEventListener("click", enableAudio);

    return () => document.removeEventListener("click", enableAudio);
  }, []);
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