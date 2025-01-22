import { Dispatch, SetStateAction } from "react";
import classes from "./Post.module.scss";
import { User } from "../../../authentication/contexts/AuthenticationContextProvider";

export interface Post {
  id: number;
  content: string;
  author: User;
  picture?: string;
  likes?: User[];
  comments?: Comment[];
  creationDate: string;
  updatedDate?: string;
}
interface PostProps {
  post: Post;
  setPosts: Dispatch<SetStateAction<Post[]>>;
}

const Post = ({post, setPosts}  : PostProps) => {
  return <div className={classes.root}>Post</div>;
};

export default Post;
