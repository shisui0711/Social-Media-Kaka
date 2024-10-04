import { useAuthorizeApiClient } from "@/store";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const { client } = useAuthorizeApiClient();
  const { data, isLoading } = useQuery({
    queryKey: ["my-info"],
    queryFn: () => client.getMyInfo(),
    refetchOnWindowFocus: false,
  });

  if (data) return { user: data, isLoading };
  return { user: null, isLoading };
};
