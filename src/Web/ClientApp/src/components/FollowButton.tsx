"use client";

import useFollowerInfo from "@/app/hooks/useFollowerInfo";
import React from "react";
import { useToast } from "./ui/use-toast";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import { useSignalR } from "@/providers/SignalRProvider";
import { FollowInfo } from "@/app/web-api-client";
import { useApiClient } from "@/app/hooks/useApiClient";

interface FollowButtonProps {
  userId: string;
  initialState: FollowInfo;
}

const FollowButton = ({ userId, initialState }: FollowButtonProps) => {
  const { user: signedInUser} = useAuthorization();
  const client = useApiClient();
  const { data } = useFollowerInfo(userId, initialState);
  const { toast } = useToast();
  const { sendNotification } = useSignalR()

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
      return {previousState}
    },
    onSuccess(){
      if(data.isFollowedByUser){
        sendNotification(userId, `${signedInUser.displayName} đã theo dõi bạn`)
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
      variant={data.isFollowedByUser ? "outline" : "default"}
      className="border-primary border-2"
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? "Đã theo dõi" : "Theo dõi"}
    </Button>
  );
};

export default FollowButton;
