import { User } from "../../../../authentication/contexts/AuthenticationContextProvider";
import MessageItem from "../MessageItem/MessageItem";
import classes from "./Messages.module.scss";

export interface IMessage {
  id: number;
  sender: User;
  receiver: User;
  content: string;
  isRead: boolean;
  createdAt: string;
}
interface IProps {
  messages: IMessage[];
  user: User | null;
  setMessages: (messages: IMessage[]) => void;
}

const Messages = ({ setMessages,messages, user }: IProps) => {
  return (
    <div className={classes.root}>
      {messages.map((message, index) => (
        <MessageItem
          key={index}
          updateMessage={(message) => {
            const newMessages = messages.map((m) =>
              m.id === message.id ? message : m
            );
            setMessages(newMessages);
          }}
          userMessage={user}
          message={message}
        />
      ))}
    </div>
  );
};

export default Messages;
