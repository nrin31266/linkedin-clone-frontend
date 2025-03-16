import { useEffect, useState } from "react";
import { DateUtils } from "../../utils/dateUtils";
import classes from "./TimeAgo.module.scss";

interface Props {
  date: string;
  isUpdate?: boolean;
}
const TimeAgo = ({ date, isUpdate }: Props) => {

const [time, setTime] = useState(new Date(date));

useEffect(() => {
  const interval = setInterval(()=>{
    setTime(new Date(date));
  }, 10000)

  return ()=> clearInterval(interval);
}, [date]);
  return (
    <div className={classes.root}>
      <div className={classes.date}>
        {DateUtils.timeAgo(time)}
        {isUpdate ? "Edited" : ""}
      </div>
    </div>
  );
};

export default TimeAgo;
