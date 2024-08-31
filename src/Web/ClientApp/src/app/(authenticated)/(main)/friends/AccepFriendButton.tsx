import { useApiClient } from '@/app/hooks/useApiClient'
import { PaginatedListOfUserDto, UserDto } from '@/app/web-api-client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useAuthorization } from '@/providers/AuthorizationProvider'
import { useSignalR } from '@/providers/SignalRProvider'
import { InfiniteData, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'

const AccepFriendButton = ({user}:{user:UserDto}) => {
  const client = useApiClient();
  const queryClient = useQueryClient()
  const queryKey: QueryKey = ["friends-received"]
  const { toast } = useToast();
  const { sendNotification } = useSignalR()
  const { user: signedInUser } = useAuthorization()
  const { mutate } = useMutation({
    mutationFn: () => client.addFriend(user.id),
    onMutate: async () => {
      await queryClient.cancelQueries({queryKey})
      queryClient.setQueriesData<InfiniteData<PaginatedListOfUserDto,string>|null>({queryKey},(oldData)=> {
        if(!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              pageNumber: page.pageNumber,
              items: page.items.filter((user) => user.id !== user.id),
              hasNextPage: page.hasNextPage,
              hasPreviousPage: page.hasPreviousPage,
              totalCount: page.totalCount - 1,
              totalPages: page.totalPages
            }))
          }
      })
      await queryClient.cancelQueries({queryKey: ["friends-all"]})
      queryClient.setQueriesData<InfiniteData<PaginatedListOfUserDto,string>|null>({queryKey: ["friends-all"]},(oldData)=> {
        const firstPage = oldData?.pages[0];
        if (firstPage && firstPage.items) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                items: [user, ...firstPage.items],
                pageNumber: firstPage.pageNumber,
                totalPages: firstPage.totalPages,
                totalCount: firstPage.totalCount + 1,
                hasNextPage: firstPage.hasNextPage,
                hasPreviousPage: firstPage.hasPreviousPage,
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      })
    },
    onSuccess(){
      sendNotification(user.id, `${signedInUser.displayName} đã chấp nhận lời mời kết bạn`)
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
      className="border-primary border-2 w-full"
      onClick={() => mutate()}
    >
      Xác nhận
    </Button>
  )
}

export default AccepFriendButton