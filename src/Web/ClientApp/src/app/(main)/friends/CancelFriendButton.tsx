import { useApiClient } from "@/app/hooks/useApiClient";
import { PaginatedListOfUserDto, UserDto } from "@/app/web-api-client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSignalR } from "@/providers/SignalRProvider";
import { InfiniteData, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

interface Props {
  userId: string,
  isSended?: boolean,
}

const CancelFriendButton = ({userId,isSended}:Props) => {
  const { toast } = useToast();
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { sendCancelFriend } = useSignalR()
  const queryKey: QueryKey = isSended ? ["friends-sended"] : ["friends-received"]
  const { mutate } = useMutation({
    mutationFn: () => client.unFriend(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({queryKey})
      queryClient.setQueriesData<InfiniteData<PaginatedListOfUserDto,string>|null>({queryKey},(oldData)=> {
        if(!oldData) return;
        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            pageNumber: page.pageNumber,
            items: page.items.filter((user) => user.id !== userId),
            hasNextPage: page.hasNextPage,
            hasPreviousPage: page.hasPreviousPage,
            totalCount: page.totalCount - 1,
            totalPages: page.totalPages
          }))
        }
      })
    },
    onSuccess(){
      sendCancelFriend(userId)
    },
    onError(error){
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
  })
  return (
    <Button
      variant="outline"
      className="border-primary border-2 w-full"
      onClick={() => mutate()}
    >
      Hủy
    </Button>
  );
};

export default CancelFriendButton;
