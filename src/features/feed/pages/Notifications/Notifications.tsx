import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import classes from './Notifications.module.scss';
import { User } from '../../../authentication/contexts/AuthenticationContextProvider';
import handleAPI from '../../../../configs/handleAPI';
import LeftSideBar from '../../components/LeftSideBar/LeftSideBar';
import RightSideBar from '../../components/RightSideBar/RightSideBar';
import { useNavigate } from 'react-router-dom';
import TimeAgo from '../../../../components/TimeAgo/TimeAgo';

enum NotificationType {
  LIKE = "LIKE",
  COMMENT = "COMMENT",
}
export interface Notification {
  id: number;
  recipient: User;
  actor: User;
  isRead: boolean;
  type: NotificationType;
  resourceId: number;
  creationDate: string;
}
const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
 
  useEffect(() => {
    const fetchNotifications = async () =>{
      await handleAPI<Notification[]>({
        endpoint: "/notifications",
        onSuccess: (data) => {

          console.log(data)
          setNotifications(data);
        },
        onFailure: (error) => console.log("Error fetching notifications:", error)
      })
    }

    fetchNotifications();
  }, []);

  return (
    <div className={classes.root}>
       <div className={classes.left}>
         <LeftSideBar />
       </div>
       <div className={classes.center}>
         {notifications.map((notification) => (
           <Notification
             key={notification.id}
             notification={notification}
             setNotifications={setNotifications}
           />
         ))}
         {notifications.length === 0 && (
           <p
             style={{
               padding: "1rem",
             }}
           >
             No notifications
           </p>
         )}
       </div>
       <div className={classes.right}>
         <RightSideBar />
       </div>
     </div>
  );
};

export default Notifications;

function Notification({
  notification,
  setNotifications,
}: {
  notification: Notification;

  setNotifications: Dispatch<SetStateAction<Notification[]>>;
}) {
  const navigate = useNavigate();
  
  function markNotificationAsRead(notificationId: number) {
    handleAPI({
      endpoint: `/notifications/${notificationId}`,
      method: "put",
      onSuccess: () => {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId ? { ...notification, isRead: true } : notification
          )
        );
      },
      onFailure: (error) => console.log(error),
    });
  }

  console.log(notification)
  return (
    <button
      onClick={() => {
        markNotificationAsRead(notification.id);
        navigate(`/posts/${notification.resourceId}`);
        
      }}
      className={
        notification.isRead ? classes.notification : `${classes.notification} ${classes.unread}`
      }
    >
      <img src={notification.actor.profilePicture} alt="" className={classes.avatar} />

      <p
        style={{
          marginRight: "auto",
        }}
      >
        <strong>{notification.actor.firstName + " " + notification.actor.lastName}</strong>{" "}
        {notification.type === NotificationType.LIKE ? "liked" : "commented on"} your post.
      </p>
      <TimeAgo date={notification.creationDate}/>
    </button>
  );
}