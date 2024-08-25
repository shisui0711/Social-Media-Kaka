
import { useQuery } from "@tanstack/react-query"
import { useApiClient } from "./useApiClient"
import { FriendInfo } from "../web-api-client";

const useFriendInfo = (userId:string, initialState:FriendInfo) => {
  const client = useApiClient();
  const query = useQuery({
    queryKey: ['friend-info', userId],
    queryFn: () => client.getFriendInfo(userId),
    initialData: initialState,
    staleTime: Infinity
  })
  return query
}

export default useFriendInfo