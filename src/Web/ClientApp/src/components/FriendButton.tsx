"use client";

import React from "react";
import { useToast } from "./ui/use-toast";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import { useSignalR } from "@/providers/SignalRProvider";
import { FollowInfo, FriendInfo } from "@/app/web-api-client";
import { useApiClient } from "@/app/hooks/useApiClient";
import useFriendInfo from "@/app/hooks/useFriendInfo";

interface Props {
  userId: string;
  initialState: FriendInfo;
}

const FriendButton = ({ userId, initialState }: Props) => {
  const { user: signedInUser} = useAuthorization();
  const client = useApiClient();
  const { data } = useFriendInfo(userId, initialState);
  const { toast } = useToast();
  const { sendNotification } = useSignalR()

  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["friend-info", userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isSended
        ? client.unFriend(userId)
        : client.addFriend(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<FriendInfo>(queryKey);

      queryClient.setQueryData<FriendInfo>(queryKey, () => ({
        friends:
          (previousState?.friends || 0) +
          (previousState?.isFriend ? - 1 : 1),
        isSended: !previousState?.isSended,
        isFriend: !previousState?.isFriend
      }));
      return {previousState}
    },
    onSuccess(){
      if(data.isSended){
        sendNotification(userId, `${signedInUser.displayName} đã gửi lời mời kết bạn`)
      }else if(data.isFriend){
        sendNotification(userId, `${signedInUser.displayName} đã chấp nhận lời mời kết bạn`)
      }
    },
    onError(error,variables,context){
      queryClient.setQueryData(queryKey, context?.previousState)
      console.log(error)
      if(error.message.includes("429"))
        toast({
          title: "Thao tác quá nhanh. Hãy chậm lại.",
          variant: 'destructive'
        })
      else{
        toast({
          title: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
          variant: 'destructive'
        })
      }
    }
  });
  return (
    <Button
      variant={data.isFriend ? "default" : data.isSended ? "outline" : "default"}
      className="border-primary border-2"
      onClick={() => mutate()}
    >
      {data.isFriend ? "Bạn bè" : data.isSended ? "Hủy kết bạn" : "Kết bạn"}
    </Button>
  );
};

export default FriendButton;
