import { User } from '../../../../authentication/contexts/AuthenticationContextProvider';
import MessageItem from '../MessageItem/MessageItem';
import classes from './Messages.module.scss';

export interface IMessage {
    id: number,
    sender: User
    receiver: User
    content: string
    isRead: boolean
    createdAt: string
}
interface IProps {
    messages: IMessage[],
    user: User | null,
}

const Messages = ({messages, user}: IProps) => {
  return (
    <div className={classes.root}>
      {messages.map((message, index) => <MessageItem key={index} message={message} user={user}/>) }
    </div>
  );
};

export default Messages;