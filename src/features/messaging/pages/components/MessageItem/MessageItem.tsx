
import classes from './MessageItem.module.scss';
import { useAuthentication, User } from '../../../../authentication/contexts/AuthenticationContextProvider';
import { IMessage } from '../Conversations/Conversations';
import TimeAgo from '../../../../../components/TimeAgo/TimeAgo';
import { useEffect, useRef } from 'react';
import handleAPI from '../../../../../configs/handleAPI';
import { useWebSocket } from '../../../../ws/Ws';

interface IProps{
    message: IMessage
    userMessage: User | null
    updateMessage: (message: IMessage) => void
}
enum MessageHandleType {
  READ = "READ",
  REACT_EMOJI = "REACT_EMOJI",
  USER_TYPING= "USER_TYPING"
}

interface IMessageHandle<T=unknown>{
  type: MessageHandleType
  data?: T
}

const MessageItem = ({updateMessage,message, userMessage} : IProps) => {

    const {user} = useAuthentication();
    const ws = useWebSocket();

    useEffect(() => {
      const subscription =  ws?.subscribe(`/topic/messages/${message.id}`, (data) => {
        const messageHandle: IMessageHandle = JSON.parse(data.body)
        
        if(messageHandle.type === MessageHandleType.READ){
          updateMessage({...message, isRead: true})
        }
      })
  
      return ()=> subscription?.unsubscribe()
    }, []);

    const messageRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!message.isRead && userMessage?.id === message.receiver.id) {
        handleAPI<void>({
          endpoint: `/messaging/conversations/messages/${message.id}`,
          method: "put",
          onSuccess: () => {},
          onFailure: (error) => console.log(error),
        });
      }
    }, [message.id, message.isRead, message.receiver.id, userMessage?.id]);
  
    useEffect(() => {
      messageRef.current?.scrollIntoView();
    }, []);
    return (
      <div
        ref={messageRef}
        className={`${classes.root} ${
          message.sender.id === userMessage?.id ? classes.sent : classes.received
        }`}
      >
        <div className={`${classes.message} `}>
          <div className={classes.top}>
            <img
              className={classes.avatar}
              src={message.sender.profilePicture || "/avatar.jpg"}
              alt={`${message.sender.firstName} ${message.sender.lastName}`}
            />
            <div>
              <div className={classes.name}>
                {message.sender.firstName} {message.sender.lastName}
              </div>
  
              <TimeAgo date={message.createdAt} />
            </div>
          </div>
          <div className={classes.content}>{message.content}</div>
        </div>
        {message.sender.id == userMessage?.id && (
          <div className={classes.status}>
            {!message.isRead ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                </svg>
                <span>Sent</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                  <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                </svg>
                <span>Read</span>
              </>
            )}
          </div>
        )}
      </div>
    );
};

export default MessageItem;