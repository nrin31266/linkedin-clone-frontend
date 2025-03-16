import { useEffect, useState } from "react";
import LeftSideBar from "../../components/LeftSideBar/LeftSideBar";
import RightSideBar from "../../components/RightSideBar/RightSideBar";
import classes from "./Feed.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthentication, User } from "../../../authentication/contexts/AuthenticationContextProvider";
import Button from "../../../../components/Button/Button";

import handleAPI from "../../../../configs/handleAPI";
import Post from "../../components/Post/Post";
import { CommentModel } from "../../components/Comment/Comment";
import Modal from "../../components/Modal/Modal";

export function PostPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { id } = useParams();

  useEffect(() => {
    handleAPI<Post>({
      endpoint: `/feed/posts/${id}`,
      onSuccess: (post) => setPosts([post]),
      onFailure: (error) => console.log(error),
    });
  }, [id]);

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <LeftSideBar />
      </div>
      <div className={classes.center}>
        {posts.length > 0 && <Post setPosts={setPosts} post={posts[0]} />}
      </div>
      <div className={classes.right}>
        <RightSideBar />
      </div>
    </div>
  );
}

interface Post {
  id: number;
  content: string;
  author: User;
  picture?: string;
  likes?: User[];
  comments?: CommentModel[];
  creationDate: string;
  updatedDate?: string;
}

const Feed = () => {
  const { user } = useAuthentication();
  const navigate = useNavigate();
  const [showPostingModal, setShowPostingModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const [feedContent, setFeedContent] = useState<"all" | "connexions">(
    "all"
  );

  useEffect(() => {
    const fetchPosts = async () => {
      await handleAPI<Post[]>({
        endpoint: `/feed${feedContent === "connexions" ? "" : "/posts"}`,
        method: "get",
        onSuccess: (data) => {
          setPosts(data);
        },
        onFailure: (error) => {
          setError(error);
        }
      });
    };
  
    fetchPosts();
  }, [feedContent]);
  
  const handlePost = async (content: string, picture: string) => {
    await handleAPI<Post>({
      endpoint: "/feed/posts",
      body: { content, picture: picture || null },
      method: "post",
      onSuccess: (data) => {
        setPosts((prev) => [...prev, data]);
      },
      onFailure: (error) => {
        console.error("Failed to post:", error);
      }
    });
  };
  

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <LeftSideBar />
      </div>
      <div className={classes.center}>
        <div className={classes.posting}>
          <button
            onClick={() => {
              navigate(`/profile/${user?.id}`);
            }}
          >
            <img
              className={`${classes.top} ${classes.avatar}`}
              src={user?.profilePicture || "/avatar.jpg"}
              alt=""
            />
          </button>
          <Button variant="outline" onClick={() => setShowPostingModal(true)}>
            Start a post
          </Button>
          <Modal
            title="Creating a post"
            onSubmit={handlePost}
            showModal={showPostingModal}
            setShowModal={setShowPostingModal}
          />
        </div>
        {error && <div className={classes.error}>{error}</div>}
        <div className={classes.header}>
          <button
            className={feedContent === "all" ? classes.active : ""}
            onClick={() => setFeedContent("all")}
          >
            All
          </button>
          <button
            className={feedContent === "connexions" ? classes.active : ""}
            onClick={() => setFeedContent("connexions")}
          >
            Feed
          </button>
        </div>
        <div className={classes.feed}>
          {posts.map((post) => (
            <Post key={post.id} post={post} setPosts={setPosts} />
          ))}
        </div>
      </div>
      <div className={classes.right}>
        <RightSideBar />
      </div>
    </div>
  );
};

export default Feed;
