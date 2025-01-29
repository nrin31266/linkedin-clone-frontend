import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import classes from "./Post.module.scss";
import {
  useAuthentication,
  User,
} from "../../../authentication/contexts/AuthenticationContextProvider";
import { data, useNavigate } from "react-router-dom";
import { PostModel } from "../../pages/Feed/Feed";
import handleAPI from "../../../../configs/handleAPI";
import { ErrorUtil } from "../../../../utils/errorUtils";
import Input from "../../../../components/Input/Input";
import { DateUtils } from "../../../../utils/dateUtils";
import Comment from "../Comment/Comment";
import Modal from "../Modal/Modal";

interface PostProps {
  post: PostModel;
  setPosts: Dispatch<SetStateAction<PostModel[]>>;
}

const Post = ({ post, setPosts }: PostProps) => {
  const navigate = useNavigate();
  const { user } = useAuthentication();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [postLiked, setPostLiked] = useState<boolean>(
    !!post.likes?.some((like) => like.id === user?.id)
  );
  useEffect(() => {
    setPostLiked(!!post.likes?.some((like) => like.id === user?.id));
  }, [post.likes, user?.id]);

  const deletePost = async (id: number) => {
    try {
      // await handleAPI("", undefined, "delete");
      setPosts((pre) => pre.filter((item) => item.id != id));
    } catch (error) {
      console.log(error);
    }
  };

  const like = async () => {
    setPostLiked((pre) => !pre);
    try {
      await handleAPI(`/feed/posts/${post.id}/like`, undefined, "put");
    } catch (error) {
      if (ErrorUtil.isErrorResponse(error)) {
        setPostLiked((pre) => !pre);
      }
    }
  };

  const editComment = async (id: number, updateContent: string) => {
    try {
      await handleAPI(
        `/feed/posts/${id}/comment`,
        { content: updateContent },
        "put"
      );
      setPosts((pre) =>
        pre.map((p) => {
          if (p.id === post.id) {
            return {
              ...p,
              comments: p.comments?.map((cm) => {
                if (cm.id === id) {
                  return {
                    ...cm,
                    updatedDate: new Date().toISOString(),
                    content: updateContent,
                  };
                } else {
                  return cm;
                }
              }),
            };
          } else {
            return p;
          }
        })
      );
    } catch (error) {
      if (ErrorUtil.isErrorResponse(error)) {
        console.log(error.message);
      }
    }
  };

  const deleteComment = async (id: number) => {
    try {
      await handleAPI(`/feed/posts/${id}/comment`, undefined, "delete");
      setPosts((pre) =>
        pre.map((p) => {
          if (p.id === post.id) {
            return {
              ...p,
              comments: p.comments?.filter((cm) => cm.id !== id),
            };
          } else {
            return p;
          }
        })
      );
    } catch (error) {
      if (ErrorUtil.isErrorResponse(error)) {
        console.log(error.message);
      }
    }
  };

  const postComment = async (e: FormEvent<HTMLFormElement>) => {
    e.currentTarget.focus();
    e.preventDefault();
    if (!content.trim()) {
      return;
    }

    try {
      const res = await handleAPI(
        `/feed/posts/${post.id}/comment`,
        { content: content },
        "post"
      );
      setContent("");

      setPosts((pre) =>
        pre.map((p) => {
          if (p.id === post.id) {
            return {
              ...p,
              comments: p.comments
                ? [res.data.data, ...p.comments]
                : [res.data.data],
            };
          } else {
            return p;
          }
        })
      );
    } catch (error) {
      if (ErrorUtil.isErrorResponse(error)) {
        console.log(error.message);
      }
    }
  };

  const editPost = async (content: string, picture: string) => {
    const res = await handleAPI(
      `/feed/posts/${post.id}`,
      { content: content, picture: picture },
      "put"
    );

    setPosts((pre) =>
      pre.map((p) => {
        if (p.id === post.id) {
          return res.data.data;
        } else {
          return p;
        }
      })
    );
  };

  return (
    <>
      {editing ? (
        <Modal
          title="Editing your post"
          content={post.content}
          picture={post.picture}
          onSubmit={editPost}
          showModal={editing}
          setShowModal={setEditing}
        />
      ) : null}

      <div className={classes.root}>
        <div className={classes.top}>
          <div className={classes.author}>
            <button
              onClick={() => {
                navigate(`/profile/${post.id}`);
              }}
            >
              <img
                src={post.author.profilePicture || "/avatar.svg"}
                alt=""
                className={classes.avatar}
              />
            </button>
            <div>
              <div className={classes.name}>
                {post.author.firstName + " " + post.author.lastName}
              </div>
              <div className={classes.title}>
                {post.author.position + " at " + post.author.company}
              </div>
              <div className={classes.date}>
                {DateUtils.timeAgo(
                  new Date(post.updatedDate ?? post.creationDate)
                )}
                {post.updatedDate ? "Edited" : ""}
              </div>
            </div>
          </div>
          <div>
            {post.author.id == user?.id && (
              <button
                className={`${classes.toggle} ${
                  showMenu ? classes.active : ""
                }`}
                onClick={() => setShowMenu(!showMenu)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
                  <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                </svg>
              </button>
            )}
            {showMenu && (
              <div className={classes.menu}>
                <button onClick={() => setEditing(true)}>Edit</button>
                <button onClick={() => deletePost(post.id)}>Delete</button>
              </div>
            )}
          </div>
        </div>
        <div className={classes.content}>{post.content}</div>
        {post.picture && <img src={post.picture} className={classes.picture} />}
        <div className={classes.stats}>
          {post.likes && post.likes.length > 0 ? (
            <div className={classes.stat}>
              <span>
                {postLiked
                  ? "You "
                  : post.likes[0].firstName +
                    " " +
                    post.likes[0].lastName +
                    " "}
              </span>
              {post.likes.length - 1 > 0 ? (
                <span>
                  and {post.likes.length - 1}{" "}
                  {post.likes.length - 1 === 1 ? "other" : "others"}
                </span>
              ) : null}{" "}
              liked this
            </div>
          ) : (
            <div></div>
          )}
          {post.comments && post.comments.length > 0 ? (
            <button
              className={classes.stat}
              onClick={() => setShowComments((prev) => !prev)}
            >
              <span>{post.comments.length} comments</span>
            </button>
          ) : (
            <div></div>
          )}
        </div>
        <div className={classes.actions}>
          <button
            onClick={() => {
              like();
            }}
            className={postLiked ? classes.active : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
            >
              <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
            </svg>
            <span>Like</span>
          </button>
          <button
            onClick={() => {
              setShowComments((prev) => !prev);
            }}
            className={showComments ? classes.active : ""}
          >
            <svg
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9l.3-.5z" />
            </svg>
            <span>Comment</span>
          </button>
        </div>
        {showComments ? (
          <div className={classes.comments}>
            <form onSubmit={postComment}>
              <Input
                onChange={(e) => setContent(e.target.value)}
                value={content}
                placeholder="Add a comment..."
                name="content"
                style={{ marginBlock: 0 }}
              />
            </form>
            {post.comments?.map((comment: any) => (
              <Comment
                editComment={editComment}
                deleteComment={deleteComment}
                key={comment.id}
                comment={comment}
              />
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Post;
