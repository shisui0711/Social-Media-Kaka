import React from "react";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { FriendInfo } from "@/lib/api-client";
import { useAuthorizeApiClient } from "@/store";
import { toast } from "sonner-native";
import { useFriendInfo } from "@/hooks/mutations/user.mutations";
import { useSignalR } from "./providers/SignalrProvider";
import { useUser } from "./providers/AuthorizationProvider";
import CustomButton from "./CustomButton";

interface Props {
  userId: string;
  initialState: FriendInfo;
}

const FriendButton = ({ userId, initialState }: Props) => {
  const signedInUser = useUser();
  const { client } = useAuthorizeApiClient();
  const { data } = useFriendInfo(userId, initialState);
  const { sendNotification, sendFriendRequest } = useSignalR();

  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["friend-info", userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isSended ? client.unFriend(userId) : client.addFriend(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<FriendInfo>(queryKey);

      queryClient.setQueryData<FriendInfo>(queryKey, () => ({
        friends: previousState?.friends || 0,
        isSended: !previousState?.isSended,
        isFriend: !!previousState?.isFriend,
      }));
      return { previousState };
    },
    onSuccess() {
      if (!data.isFriend && data.isSended) {
        sendNotification(
          userId,
          `${signedInUser.displayName} đã gửi lời mời kết bạn`
        );
        sendFriendRequest(userId);
      } else if (data.isFriend) {
        sendNotification(
          userId,
          `${signedInUser.displayName} đã chấp nhận lời mời kết bạn`
        );
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
      title={
        data.isFriend ? "Bạn bè" : data.isSended ? "Hủy kết bạn" : "Kết bạn"
      }
      bgVariant={
        data.isFriend ? "primary" : data.isSended ? "outline" : "primary"
      }
      onPress={() => mutate()}
    />
  );
};

export default FriendButton;
