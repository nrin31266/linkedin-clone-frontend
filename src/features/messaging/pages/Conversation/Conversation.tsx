import { useNavigate, useParams } from "react-router-dom";
import classes from "./Conversation.module.scss";
import {
  FormEvent,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useAuthentication,
  User,
} from "../../../authentication/contexts/AuthenticationContextProvider";
import { IConversation } from "../components/Conversations/Conversations";
import Conversations from "./../components/Conversations/Conversations";
import { useWebSocket } from "../../../ws/Ws";
import handleAPI from "../../../../configs/handleAPI";
import Input from "../../../../components/Input/Input";
import Messages, { IMessage } from "../components/Messages/Messages";


const Conversation = () => {
  const { id } = useParams();
  const [postingMessage, setPostingMessage] = useState(false);
  const [content, setContent] = useState("");
  const [suggestingUser, setSuggestingUser] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [conversation, setConversation] = useState<IConversation | null>(null);
 



  const [conversations, setConversations] = useState<IConversation[]>([]);

  // const audioContext = new AudioContext();
  const ws = useWebSocket();
  const navigate = useNavigate();
  const isCreatingNewConversation = id === "new";
  const { user } = useAuthentication();
  const conversationUserToDisplay =
    user?.id === conversation?.author.id
      ? conversation?.recipient
      : conversation?.author;

  useEffect(() => {
    handleAPI<IConversation[]>({
      endpoint: "/messaging/conversations",

      onSuccess(data) {
        setConversations(data);
      },
      onFailure(error) {
        console.log(error);
      },
    });
  }, []);

  useEffect(() => {
    const subscription = ws?.subscribe(
      `/topic/users/${user?.id}/conversations`,
      (data) => {
        const conversation = JSON.parse(data.body);
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
        });
      }
    );
    return () => subscription?.unsubscribe();
  }, [ws, user?.id]);

  useEffect(() => {
    if (id === "new") {
      setConversation(null);
      handleAPI<User[]>({
        endpoint: "/authentication/users",
        onSuccess(data) {
          setSuggestingUser(data);
        },
        onFailure(error) {
          console.log(error);
        },
      });
    } else {
      handleAPI<IConversation>({
        endpoint: `/messaging/conversations/${id}`,
        onSuccess(data) {
          setConversation(data);
        },
        onFailure(error) {
          console.log(error);
          navigate("/messaging");
        },
      });
    }
  }, [id, navigate]);

  useEffect(() => {
    const subscription = ws?.subscribe(
      `/topic/conversations/${conversation?.id}/messages`,
      (data) => {
        const message = JSON.parse(data.body);
        console.log("Received message:", message);
        setConversation((pre) => {
          if (!pre) return null;
          const index = pre.messages.findIndex((m) => m.id === message.id);
          if (index === -1) {
            return { ...pre, messages: [...pre.messages, message] };
          } else {
            return {
              ...pre,
              messages: pre.messages.map((m) =>
                m.id === message.id ? message : m
              ),
            };
          }
        });
      }
    );
    return () => subscription?.unsubscribe();
  }, [ws, conversation?.id]);

  const addMessageToConversation = async (e: FormEvent<HTMLFormElement>) => {
    setPostingMessage(true);
    await handleAPI<void>({
      endpoint: `/messaging/conversations/${conversation?.id}/message`,
      body: {
        content,
        receiverId:
          conversation?.recipient.id === user?.id
            ? conversation?.author.id
            : conversation?.recipient.id,
      },
      method: "post",
      onSuccess: () => {},
      onFailure: (error) => {
        console.log(error);
      },
      onFinally: () => {
        setPostingMessage(false);
      },
    });
  };

  const createConversation = async (e: FormEvent<HTMLFormElement>) => {
    const rq = {
      content,
      receiverId: selectedUser?.id,
    };

    await handleAPI<IConversation>({
      endpoint: "/messaging/conversations",
      body: rq,
      method: "post",
      onSuccess: (conversation) => {
        navigate(`/messaging/conversation/${conversation.id}`);
      },
      onFailure: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <div
      className={`${classes.root} ${
        isCreatingNewConversation ? classes.new : ""
      }`}
    >
      {(conversation || isCreatingNewConversation) && (
        <>
          <div className={classes.top}>
            <button

              onClick={() => navigate("/messaging")}
              className={classes.back}
            >
              <img src="/back.png" alt="" />
            </button>
            {conversation ? (
              <div className={classes.info}>
                <img
                  src={
                    conversationUserToDisplay?.profilePicture ?? "/avatar.jpg"
                  }
                  alt=""
                  className={classes.avatar}
                />
                <div>
                  <div className={classes.name}>
                    {conversationUserToDisplay?.firstName +
                      " " +
                      conversationUserToDisplay?.lastName}
                  </div>
                  <div className={classes.title}>
                    {conversationUserToDisplay?.position +
                      " at " +
                      conversationUserToDisplay?.company}
                  </div>
                </div>
              </div>
            ) : (
              <div className={classes.new}>
                <span>
                  Starting a new conversation{selectedUser && " with:"}
                </span>
              </div>
            )}
          </div>
          {isCreatingNewConversation && (
            <>
              <form className={`${classes.formNew} ${classes.new}`}>
                {!selectedUser ? (
                  <>
                    <Input
                      type="text"
                      name="recipient"
                      placeholder="Type a name"
                      onChange={(e) => setSearch(e.target.value)}
                      value={search}
                    />
                    {!selectedUser && !conversation && (
                      <div className={classes.suggestions}>
                        {suggestingUser
                          .filter((user) =>
                            (user.firstName + " " + user.lastName)
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          )
                          .map((u, i) => (
                            <button
                            key={i}
                              onClick={(e) => {
                                e.preventDefault();
                                const conversation = conversations.find(
                                  (c) =>
                                    c.author.id === u.id ||
                                    c.recipient.id === u.id
                                );
                                if (conversation) {
                                  navigate(`/messaging/conversation/${conversation.id}`);
                                } else {
                                  setSelectedUser(u);
                                }
                              }}
                            >
                              <img
                                src={u.profilePicture ?? "/avatar.jpg"}
                                alt=""
                                className={classes.avatar}
                              />
                              <div>
                                <div className={classes.name}>
                                  {u.firstName + " " + u.lastName}
                                </div>
                                <div className={classes.title}>
                                  {u.position + " at " + u.company}
                                </div>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {selectedUser && (
                      <div className={classes.top}>
                        <img
                          className={classes.avatar}
                          src={selectedUser.profilePicture}
                          alt=""
                        />
                        <div>
                          <div className={classes.name}>
                            {selectedUser.firstName} {selectedUser.lastName}
                          </div>
                          <div className={classes.title}>
                            {selectedUser.position} at {selectedUser.company}
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedUser(null)}
                          className={classes.close}
                        >
                          x
                        </button>
                      </div>
                    )}
                  </>
                )}
              </form>
            </>
          )}

          {conversation && (
            <Messages setMessages={(messages)=>{setConversation({...conversation, messages})}} messages={conversation.messages} user={user} />
          )}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (conversation) {
                await addMessageToConversation(e);
              } else {
                await createConversation(e);
              }
              setContent("");
              setSelectedUser(null);
            }}
            className={classes.formSend}
          >
            <input
              type="text"
              value={content}
              name="content"
              className={classes.textarea}
              placeholder="Type a message"
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              className={classes.send}
              disabled={content.trim() === "" || postingMessage}
              type="submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="currentColor"
              >
                <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376l0 103.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
              </svg>
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Conversation;
