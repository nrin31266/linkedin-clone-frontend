import { NavLink } from "react-router-dom";
import classes from "./HeaderComponent.module.scss";
import Input from "../Input/Input";
import { useAuthentication } from "../../features/authentication/contexts/AuthenticationContextProvider";
import { useEffect, useRef, useState } from "react";
import Profile from "./components/Profile";
import { useWebSocket } from "../../features/ws/Ws";
import { Notification } from "./../../features/feed/pages/Notifications/Notifications";
import handleAPI from "../../configs/handleAPI";
import Conversations, {
  IConversation,
} from "./../../features/messaging/pages/components/Conversations/Conversations";

const HeaderComponent = () => {
  const { user } = useAuthentication();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNavigationMenu, setShowNavigationMenu] = useState(
    window.innerWidth > 1080 ? true : false
  );
  const webSocketClient = useWebSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const nonReadNotificationCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  const audioRef = useRef(new Audio("/receive-notify.mp3"));
  const receiveMessageAudioRef = useRef(new Audio("/new-message.mp3"));
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const unReadMessagesCount = conversations.reduce(
    (total, c) => total + c.messages.filter((m) => !m.isRead).length,
    0
  );

  useEffect(() => {
    const subscription = webSocketClient?.subscribe(
      `/topic/users/${user?.id}/conversations`,
      (data) => {
        const conversation : IConversation = JSON.parse(data.body);
        console.log("Received conversation:", conversation);
        setConversations((pre) => {
          const index = pre.findIndex((c) => c.id === conversation.id);
          if (index === -1) {
            return [conversation, ...pre];
          } else {
            return pre.map((c) =>
              c.id === conversation.id ? conversation : c
            );
          }

          // if(conversation.messages)
        });
      }
    );
    return () => subscription?.unsubscribe();
  }, [webSocketClient, user?.id]);
  useEffect(() => {
    const subscribe = webSocketClient?.subscribe(
      `/topic/users/${user?.id}/notifications`,
      (message) => {
        const notification = JSON.parse(message.body);
        audioRef.current.play();

        setNotifications((pre) => {
          const index = pre.findIndex((n) => n.id === notification.id);
          if (index === -1) {
            return [notification, ...pre];
          } else {
            return pre.map((n) =>
              n.id === notification.id ? notification : n
            );
          }
        });
      }
    );

    return () => subscribe?.unsubscribe();
  }, [user?.id, webSocketClient]);

  useEffect(() => {
    const fetchNotifications = async () => {
      await handleAPI<Notification[]>({
        endpoint: "/notifications",
        onSuccess: (data) => {
          setNotifications(data);
        },
        onFailure: (error) =>
          console.log("Error fetching notifications:", error),
      });
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    handleAPI<IConversation[]>({
      endpoint: "/messaging/conversations",
      onSuccess: (data) => {
      },
      onFailure: (error) => console.log("Error fetching conversations:", error),
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setShowNavigationMenu(window.innerWidth >= 1080);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.left}>
          <NavLink to={"/"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={classes.logo}
            >
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
            </svg>
          </NavLink>
          <Input customSize={"medium"} placeholder="Search" />
        </div>
        <div className={classes.right}>
          {showNavigationMenu ? (
            <ul>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? classes.active : "")}
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.innerWidth <= 1080) {
                      setShowNavigationMenu(false);
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="24"
                    height="24"
                    focusable="false"
                  >
                    <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z"></path>
                  </svg>
                  <span>Home</span>
                </NavLink>
              </li>
              <li className={classes.network}>
                <NavLink
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.innerWidth <= 1080) {
                      setShowNavigationMenu(false);
                    }
                  }}
                  to="/network"
                  className={({ isActive }) => (isActive ? classes.active : "")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    focusable="false"
                  >
                    <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
                  </svg>
                  <span>Network</span>
                </NavLink>
              </li>
              <li className={classes.messaging}>
                <NavLink
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.innerWidth <= 1080) {
                      setShowNavigationMenu(false);
                    }
                  }}
                  to="/messaging"
                  className={({ isActive }) => (isActive ? classes.active : "")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    focusable="false"
                  >
                    <path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z"></path>
                  </svg>
                  <div>
                    {unReadMessagesCount > 0 ? (
                      <span className={classes.badge}>
                        {unReadMessagesCount}
                      </span>
                    ) : null}
                    <span>Messaging</span>
                  </div>
                </NavLink>
              </li>
              <li className={classes.notifications}>
                <NavLink
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.innerWidth <= 1080) {
                      setShowNavigationMenu(false);
                    }
                  }}
                  to="/notifications"
                  className={({ isActive }) => (isActive ? classes.active : "")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    focusable="false"
                  >
                    <path d="M22 19h-8.28a2 2 0 11-3.44 0H2v-1a4.52 4.52 0 011.17-2.83l1-1.17h15.7l1 1.17A4.42 4.42 0 0122 18zM18.21 7.44A6.27 6.27 0 0012 2a6.27 6.27 0 00-6.21 5.44L5 13h14z"></path>
                  </svg>

                  <div>
                    {nonReadNotificationCount > 0 ? (
                      <span className={classes.badge}>
                        {nonReadNotificationCount}
                      </span>
                    ) : null}
                    <span>Notifications</span>
                  </div>
                </NavLink>
              </li>
            </ul>
          ) : null}

          <button
            onClick={() => {
              setShowNavigationMenu((prev) => !prev);
              setShowProfileMenu(false);
            }}
            className={classes.toggle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              fill="currentColor"
            >
              <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
            </svg>
            <span>Menu</span>
          </button>
          {user ? (
            <Profile
              setShowNavigationMenu={setShowNavigationMenu}
              showProfileMenu={showProfileMenu}
              setShowProfileMenu={setShowProfileMenu}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
