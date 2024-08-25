import { Ellipsis, Trash2, User } from "lucide-react";
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
type Props = {
  conversation: ConversationDto;
  className?: string;
};

const ConversationMoreButton = ({ conversation,className }: Props) => {
  const { user } = useAuthorization()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const collaborator = conversation.conversationMembers.filter(x=>x.userId !== user.id)[0]
  return (
    <div >
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis size={30} className={className} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <span className="flex items-center gap-3 text-destructive">
              <Trash2 className="size-4" />
              Xóa đoạn chát
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/profile/${collaborator?.userId}`} className="flex items-center gap-2">
              <User />
              Xem trang cá nhân
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConversationDialog
        conversation={conversation}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};

export default ConversationMoreButton;
