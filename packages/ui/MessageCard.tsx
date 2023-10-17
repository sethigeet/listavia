import { FC } from "react";
import { DeleteIcon } from "./icons";

export interface Message {
  msg: string;
  timeCreated: string;
}

interface MessageCardProps {
  msg: Message;
}

export const MessageCard: FC<MessageCardProps> = ({ msg }) => {
  return (
    <div className="card bg-primary/10">
      <div className="card-body">
        {/* <h2 className="card-title">{msg.msg}</h2> */}
        <p className="">{msg.msg}</p>
        <div className="card-actions justify-between">
          <span className="mt-auto text-xs text-base-content">{msg.timeCreated}</span>
          <button className="text-md btn btn-ghost text-error">
            Delete <DeleteIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
