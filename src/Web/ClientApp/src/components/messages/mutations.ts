import {
  InfiniteData,
  QueryFilters,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import {
  deleteConversation,
  ensureCreatedConversation,
  submitMessage,
} from "./actions";
import { usePathname, useRouter } from "next/navigation";
import { useSignalR } from "@/providers/SignalRProvider";
import {
  CommentDto,
  ConversationDto,
  MessageDto,
  PaginatedListOfConversationDto,
} from "@/app/web-api-client";

export function useSendMessageMutation() {
  const { toast } = useToast();
  const { sendMessage } = useSignalR();

  const mutation = useMutation({
    mutationFn: submitMessage,
    onSuccess: async (newMessage: MessageDto) => {
      sendMessage(newMessage);
    },
    onError: (error: any) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Có lỗi xảy ra. Vui lòng thử lại",
      });
    },
  });
  return mutation;
}

export function useEnsureCreatedMutation() {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ensureCreatedConversation,
    onSuccess: async (newConversation: ConversationDto) => {
      console.log("NewCon:", newConversation);
      const queryFilter = {
        queryKey: ["conversations"],
      } satisfies QueryFilters;
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<
        InfiniteData<PaginatedListOfConversationDto, string | null>
      >(queryFilter, (oldData) => {
        const firstPage = oldData?.pages[0];
        if (firstPage && firstPage.items) {
          if (firstPage.items.find((x) => x.id === newConversation.id))
            return oldData;
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                items: [newConversation, ...firstPage.items],
                pageNumber: firstPage.pageNumber + 1,
                totalPages: firstPage.totalPages,
                totalCount: firstPage.totalCount + 1,
                hasNextPage: firstPage.hasNextPage,
                hasPreviousPage: firstPage.hasPreviousPage,
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      });
      router.push(`/messages/${newConversation.id}`);
    },
    onError: (error: any) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Có lỗi xảy ra. Vui lòng thử lại",
      });
    },
  });
  return mutation;
}

export function useDeleteConversationMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: deleteConversation,
    onSuccess: async (deletedCoversation: CommentDto) => {
      const queryKey: QueryKey = ["conversations"];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<
        InfiniteData<PaginatedListOfConversationDto, string | null>
      >(queryKey, (oldData) => {
        if (!oldData) return;

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            pageNumber: page.pageNumber,
            items: page.items.filter((c) => c.id !== deletedCoversation.id),
            totalPages: page.totalPages,
            totalCount: page.totalCount - 1,
            hasNextPage: page.hasNextPage,
            hasPreviousPage: page.hasPreviousPage,
          })),
        };
      });
      if (pathname === `/messages/${deletedCoversation.id}`) {
        router.push("/messages");
      }
      toast({
        description: "Đã xóa đoạn chat",
        className: "bg-primary text-white",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Đã xảy ra lỗi. Vui lòng thử lại",
      });
    },
  });

  return mutation;
}
