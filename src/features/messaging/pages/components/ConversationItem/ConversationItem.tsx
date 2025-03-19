import classes from "./ConversationItem.module.scss";
import Conversation from "./../../Conversation/Conversation";
import { IConversation } from "../Conversations/Conversations";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthentication } from "../../../../authentication/contexts/AuthenticationContextProvider";
import { useWebSocket } from "../../../../ws/Ws";

interface ConversationItemProps {
  conversation: IConversation;
}

const ConversationItem = (props: ConversationItemProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthentication();
  const [conversation, setConversation] = useState<IConversation>(
    props.conversation
  );
  const ws = useWebSocket();

  const unreadMessagesCount = conversation.messages.filter(
    (message) => !message.isRead
  ).length;

  useEffect(() => {
    const subscription =  ws?.subscribe(`/topic/conversations/${conversation.id}/message`, (data) => {
      const message = JSON.parse(data.body)
      setConversation((pre)=>{
        const index = pre.messages.findIndex((m) => m.id === message.id);
        if (index === -1) {
          return {...pre, messages: [...pre.messages, message]}
        }else{
            return {...pre, messages: pre.messages.map((m) => (m.id === message.id ? message : m))}
        }
      })
    })

    return ()=> subscription?.unsubscribe()
  }, [user?.id, ws]);

  const conversationUserToDisplay =
    conversation.author.id === user?.id
      ? conversation.recipient
      : conversation.author;
  return (
    <button
      className={`${classes.root} ${
        id && Number(id) === conversation.id && classes.selected
      } ${unreadMessagesCount > 0 && classes.unread}`}
      onClick={() => navigate(`/messaging/conversation/${conversation.id}`)}
    >
      <img
        src={conversationUserToDisplay.profilePicture || "/avatar.jpg"}
        className={classes.avatar}
        alt=""
      />
      {unreadMessagesCount > 0 && (
        <div className={classes.messagesCount}>{unreadMessagesCount}</div>
      )}
      <div>
        <div className={classes.name}>
          {conversationUserToDisplay.firstName +
            " " +
            conversationUserToDisplay.lastName}
        </div>
        <div className={classes.content}>
          {conversation.messages[conversation.messages.length - 1].content}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
