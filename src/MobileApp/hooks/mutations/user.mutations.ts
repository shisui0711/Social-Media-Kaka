import { FollowInfo, FriendInfo } from "@/lib/api-client";
import { useAuthorizeApiClient } from "@/store";
import { useQuery } from "@tanstack/react-query";

export const useFollowerInfo = (userId: string, initialState: FollowInfo) => {
  const { client } = useAuthorizeApiClient();
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () => client.getFollowInfo(userId),
    initialData: initialState,
    staleTime: Infinity,
  });
  return query;
};

export const useFriendInfo = (userId: string, initialState: FriendInfo) => {
  const { client } = useAuthorizeApiClient();
  const query = useQuery({
    queryKey: ["friend-info", userId],
    queryFn: () => client.getFriendInfo(userId),
    initialData: initialState,
    staleTime: Infinity,
  });
  return query;
};
