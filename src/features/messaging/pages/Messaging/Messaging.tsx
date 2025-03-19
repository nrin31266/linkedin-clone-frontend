import { Outlet, useLocation, useNavigate } from "react-router-dom";
import classes from "./Messaging.module.scss";
import usePageTitle from "../../../../hooks/usePageTitle";
import Conversation from "../Conversation/Conversation";
import RightSideBar from "../../../feed/components/RightSideBar/RightSideBar";
import Conversations from "../components/Conversations/Conversations";
import { useEffect, useState } from "react";

const Messaging = () => {
  usePageTitle("Messaging");
  const navigate = useNavigate();
  const location = useLocation();
  const onConversation = location.pathname.includes("/messaging/conversation/");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  return (
    <div className={classes.root}>
      <div className={classes.messaging}>
        <div className={`${classes.sidebar}`}>
          <div className={classes.header}>
            <h1>Messaging</h1>
            <button
              onClick={() => navigate(`conversation/new`)}
              className={classes.new}
            >
              +
            </button>
          </div>
          <div
            className={`${classes.conversations} ${
              onConversation && windowWidth < 1025 ? classes.hidden : classes.show
            }`}
          >
            <Conversations />
          </div>
        </div>
        <Outlet />
      </div>

      <div className={classes.right}>
        <RightSideBar />
      </div>
    </div>
  );
};

export default Messaging;
