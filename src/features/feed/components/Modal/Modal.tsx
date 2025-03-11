import { Dispatch, SetStateAction, useState } from "react";
import classes from "./Modal.module.scss";
import Button from "../../../../components/Button/Button";
import Input from "../../../../components/Input/Input";
import handleAPI from "../../../../configs/handleAPI";

interface Props {
  showModal: boolean;
  content?: string;
  picture?: string;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  onSubmit: (content: string, picture: string) => Promise<void>;
  title: string;
}

const Modal = ({
  onSubmit,
  setShowModal,
  showModal,
  title,
  content,
  picture,
}: Props) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!showModal) {
    return null;
  }

  return (
    <div className={classes.root}>
      <div className={classes.modal}>
        <div className={classes.header}>
          <h3 className={classes.title}>{title}</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const content = e.currentTarget.content.value;
            const picture = e.currentTarget.picture.value;

            if (!content) {
              setError("Content is required");
              setIsLoading(false);
              return;
            }

            await handleAPI<void>({
              endpoint: "/feed/posts",
              body: { content, picture: picture || null },
              method: "post",
              onSuccess: () => {
                setShowModal(false);
              },
              onFailure: (error) => {
                setError(error);
              },
              onFinally: () => {
                setIsLoading(false);
              },
            });
          }}
        >
          <div className={classes.body}>
            <textarea
              placeholder="What do you want to talk about?"
              onFocus={() => setError("")}
              onChange={() => setError("")}
              name="content"
              defaultValue={content}
            />
            <Input
              defaultValue={picture}
              onFocus={() => setError("")}
              onChange={() => setError("")}
              placeholder="Image URL (optional)"
              name="picture"
              style={{
                marginBlock: 0,
              }}
            />
          </div>
          {error && <div className={classes.error}>{error}</div>}
          <div className={classes.footer}>
            <Button size="medium" type="submit" disabled={isLoading}>
              Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
