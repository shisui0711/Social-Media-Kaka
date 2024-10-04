import { useFollowerInfo } from "@/hooks/mutations/user.mutations";
import { FollowInfo } from "@/lib/api-client";
import { formatNumber } from "@/lib/utils";
import React from "react";

interface FollowerCountProps {
  userId: string;
  initialState: FollowInfo;
}

const FollowerCount = ({ userId, initialState }: FollowerCountProps) => {
  const { data } = useFollowerInfo(userId, initialState);

  return (
    <span>
      Người theo dõi:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
};

export default FollowerCount;
