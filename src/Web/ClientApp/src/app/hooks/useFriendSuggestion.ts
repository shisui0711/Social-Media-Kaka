import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";


export default function useFriendSuggestion(){
  const client = useApiClient();
  const query = useQuery({
    queryKey: ["friend-suggestion"],
    queryFn: () => client.getSuggestionFollow(),
    staleTime: Infinity
  })

  return query
}