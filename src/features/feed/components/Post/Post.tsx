import { Dispatch, SetStateAction, useEffect, useState } from "react";
import classes from "./Post.module.scss";
import {
  useAuthentication,
  User,
} from "../../../authentication/contexts/AuthenticationContextProvider";
import { useNavigate } from "react-router-dom";
import { PostModel } from "../../pages/Feed/Feed";
import handleAPI from "../../../../configs/handleAPI";

interface PostProps {
  post: PostModel;
  setPosts: Dispatch<SetStateAction<PostModel[]>>;
}

const Post = ({ post, setPosts }: PostProps) => {
  const navigate = useNavigate();
  const { user } = useAuthentication();
  const [editing, setEditing] = useState(false);

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

  return (
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
              {post.updatedDate ? "Edited" : ""}
            </div>
          </div>
        </div>
        <div>
          {post.author.id == user?.id && (
            <button
              className={`${classes.toggle} ${showMenu ? classes.active : ""}`}
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
                : post.likes[0].firstName + " " + post.likes[0].lastName + " "}
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
    </div>
  );
};

export default Post;
