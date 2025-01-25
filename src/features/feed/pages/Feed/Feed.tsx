import { useEffect, useState } from "react";
import LeftSideBar from "../../components/LeftSideBar/LeftSideBar";
import RightSideBar from "../../components/RightSideBar/RightSideBar";
import classes from "./Feed.module.scss";
import { useNavigate } from "react-router-dom";
import { useAuthentication, User } from "../../../authentication/contexts/AuthenticationContextProvider";
import Button from "../../../../components/Button/Button";
import { ErrorUtil } from "../../../../utils/errorUtils";
import handleAPI from "../../../../configs/handleAPI";
import Post from "../../components/Post/Post";

export interface PostModel {
  id: number;
  content: string;
  author: User;
  picture?: string;
  likes?: User[];
  comments?: Comment[];
  creationDate: string;
  updatedDate?: string;
}

const Feed = () => {
  const { user } = useAuthentication();
  const navigate = useNavigate();
  const [showPostingModal, setShowPostingModal] = useState(false);
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [error, setError] = useState("");
  const [feedContent, setFeedContent] = useState<"all" | "connexions">(
    "connexions"
  );

  useEffect(() => {
    const fetchPosts =async ()=>{
      try {
        const res = await handleAPI(`/feed${feedContent==="connexions"?"":"/posts"}`)
        setPosts(res.data.data)
      } catch (error) {
        if(ErrorUtil.isErrorResponse(error)){
          setError(error.message);
        }
      }
    }


    fetchPosts();
  }, [feedContent]);

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
              src={user?.profilePicture || "/avatar.png"}
              alt=""
            />
          </button>
          <Button variant="outline" onClick={() => setShowPostingModal(true)}>
            Start a post
          </Button>
          {/* <Madal
            title="Creating a post"
            onSubmit={handlePost}
            showModal={showPostingModal}
            setShowModal={setShowPostingModal}
          /> */}
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
