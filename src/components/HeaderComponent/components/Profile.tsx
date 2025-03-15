import { Dispatch, SetStateAction } from "react";
import classes from "./Profile.module.scss";
import { useAuthentication } from "../../../features/authentication/contexts/AuthenticationContextProvider";
import Button from "../../Button/Button";
import { Link, useNavigate } from "react-router-dom";

interface IProfileProps {
  showProfileMenu: boolean;
  setShowNavigationMenu: Dispatch<SetStateAction<boolean>>;
  setShowProfileMenu: Dispatch<SetStateAction<boolean>>;
}

const Profile = ({
  setShowNavigationMenu,
  setShowProfileMenu,
  showProfileMenu,
}: IProfileProps) => {
  const { logout, user } = useAuthentication();
  const navigate = useNavigate();

  return (
    <div className={classes.root}>
      <button
        className={classes.toggle}
        onClick={() => {
          setShowProfileMenu((pre) => !pre);
        }}
      >
        <img
          className={`${classes.avatar} ${classes.top}`}
          src={user?.profilePicture || "avatar.jpg"}
          alt=""
        />
        <div className={classes.name}>
          <div>{user?.firstName + " " + user?.lastName?.charAt(0) + "."}</div>
        </div>
      </button>

      {showProfileMenu && (
        <>
          <div className={classes.menu}>
            <div className={classes.content}>
              <img
                className={`${classes.right} ${classes.avatar}`}
                src={user?.profilePicture || "/avatar.jpg"}
              />
              <div className={classes.left}>
                <div className={classes.name}>
                  {user?.firstName + " " + user?.lastName}
                </div>
                <div className={classes.title}>
                  {user?.position + " at " + user?.company}
                </div>
              </div>
            </div>
            <div className={classes.links}>
              <Button
                size="small"
                variant="outline"
                onClick={() => {
                  navigate("/profile");
                }}
              >
                View Profile
              </Button>
              <Link to={"/sittings"}>Sitting & Privacy</Link>
              <Link to={"/login"} onClick={logout}>Logout</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
