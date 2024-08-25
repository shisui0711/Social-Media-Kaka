import { Copy } from "lucide-react";
import React from "react";

const CopyLink = ({onClick}:{onClick?: React.MouseEventHandler<HTMLDivElement>}) => {
  return (
    <div className="bg-gray-300 p-3 cursor-pointer rounded-2xl" onClick={onClick}>
        <Copy size={30} />
    </div>
  );
};

export default CopyLink;
