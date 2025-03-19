import { CSSProperties, useEffect, useState } from 'react';
import classes from './Conversations.module.scss';
import { User } from '../../../../authentication/contexts/AuthenticationContextProvider';
import ConversationItem from '../ConversationItem/ConversationItem';
import handleAPI from '../../../../../configs/handleAPI';
import Conversation from './../../Conversation/Conversation';


export interface IConversation{
    id: number,
    author: User,
    recipient: User,
    messages: IMessage[]

}

export interface IMessage{
    id: number
  sender: User
  receiver: User
  content: string
  isRead: boolean
  createdAt: string
}

interface ConversationsProps {
  style?: CSSProperties 
}

const Conversations = ({style}: ConversationsProps) => {

    const [conversations, setConversations] = useState<IConversation[]>([]);
    useEffect(() => {
      const fetchConversations = async () => {
        await handleAPI<IConversation[]>({
          endpoint: "/messaging/conversations",
          method: "get",
          onSuccess: (data) => {
            setConversations(data);
          },
          onFailure: (error) => {
            console.log(error);
          },
        });
      }

      fetchConversations();
    }, []);

  return (
    <div className={`${classes.root}`} style={style || {}}>
      {
        conversations.map((conversation, index) =><ConversationItem conversation={conversation} key={index}/>)
      }
      {
        conversations.length === 0 && <div className={classes.welcome}>No conversations</div>
      }
    </div>
  );
};

export default Conversations;