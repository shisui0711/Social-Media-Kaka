
import { useQuery } from "@tanstack/react-query"
import { FollowInfo } from "../web-api-client"
import { useApiClient } from "./useApiClient"

const useFollowerInfo = (userId:string, initialState:FollowInfo) => {
  const client = useApiClient();
  const query = useQuery({
    queryKey: ['follower-info', userId],
    queryFn: () => client.getFollowInfo(userId),
    initialData: initialState,
    staleTime: Infinity
  })
  return query
}

export default useFollowerInfo