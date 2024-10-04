import { Ellipsis, Trash2, User, UserRoundPlus } from "lucide-react";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import Link from "next/link";
import DeleteConversationDialog from "./DeleteConversationDialog";
import { ConversationDto } from "@/app/web-api-client";
import SearchFriendDialog from "./SearchFriendDialog";
import { useMutation } from "@tanstack/react-query";
import { addUserToConversation } from "./actions";
import { useToast } from "../ui/use-toast";
type Props = {
  conversation: ConversationDto;
  className?: string;
};

const ConversationMoreButton = ({ conversation, className }: Props) => {
  const { user } = useAuthorization();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSearchFriendDialog, setShowSearchFriendDialog] = useState(false);
  const collaborator = conversation.conversationMembers.filter(
    (x) => x.userId !== user.id
  )[0];

  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: addUserToConversation,
    onSuccess() {
      toast({
        description: "Thêm thành viên thành công",
        className: "bg-primary text-white",
      });
    },
    onError() {
      toast({
        variant: "destructive",
        description: "Đã xảy ra lỗi. Vui lòng thử lại",
      });
    },
  });
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis size={30} className={className} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowSearchFriendDialog(true)}>
            <span className="flex items-center gap-3">
              <UserRoundPlus className="size-4" />
              Thêm thành viên
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={`/profile/${collaborator?.userId}`}
              className="flex items-center gap-2"
            >
              <User />
              Xem trang cá nhân
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <span className="flex items-center gap-3 text-destructive">
              <Trash2 className="size-4" />
              Xóa đoạn chát
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SearchFriendDialog
        title="Thêm bạn bè vào đoạn chat"
        placeholder="Tìm kiếm bạn bè..."
        open={showSearchFriendDialog}
        onClose={() => setShowSearchFriendDialog(false)}
        onUserClick={(userId) => {
          mutation.mutate({ conversationId: conversation.id, userId: userId });
          setShowSearchFriendDialog(false);
        }}
      />
      <DeleteConversationDialog
        conversation={conversation}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};

export default ConversationMoreButton;
