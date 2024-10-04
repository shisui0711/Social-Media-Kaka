import React from "react";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { useAuthorizeApiClient } from "@/store";
import { FollowInfo } from "@/lib/api-client";
import { useSignalR } from "./providers/SignalrProvider";
import { useUser } from "./providers/AuthorizationProvider";
import useFollowerInfo from "@/hooks/mutations/user.mutations";
import CustomButton from "./CustomButton";

interface FollowButtonProps {
  userId: string;
  initialState: FollowInfo;
}

const FollowButton = ({ userId, initialState }: FollowButtonProps) => {
  const signedInUser = useUser();
  const { client } = useAuthorizeApiClient();
  const { data } = useFollowerInfo(userId, initialState);
  const { sendNotification } = useSignalR();

  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? client.unFollowUser(userId)
        : client.followUser(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<FollowInfo>(queryKey);

      queryClient.setQueryData<FollowInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));
      return { previousState };
    },
    onSuccess() {
      if (data.isFollowedByUser) {[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]
        sendNotification(userId, `${signedInUser.displayName} đã theo dõi bạn`);
      }
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.log(error);
      if (error.message.includes("429"))
        toast.error("Thao tác quá nhanh. Hãy chậm lại.");
      else {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    },
  });
  return (
    <CustomButton
      title={data.isFollowedByUser ? "Đã theo dõi" : "Theo dõi"}
      bgVariant={data.isFollowedByUser ? "outline" : "primary"}
      onPress={() => mutate()}
    />
  );
};

export default FollowButton;
