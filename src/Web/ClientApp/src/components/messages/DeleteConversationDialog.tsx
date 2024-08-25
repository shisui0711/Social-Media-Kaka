
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Loader } from "lucide-react";
import { useDeleteConversationMutation } from "./mutations";
import { ConversationDto } from "@/app/web-api-client";

interface Props {
  conversation: ConversationDto;
  open: boolean;
  onClose: () => void;
}

export default function DeleteConversationDialog({
  conversation,
  open,
  onClose,
}: Props) {
  const mutation = useDeleteConversationMutation();

  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa đoạn chat ?</DialogTitle>
          <DialogDescription>
            Bạn chắc chắn muốn xóa đoạn chat này chứ ? Thao tác này không thể hoàn tác
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate(conversation.id, { onSuccess: onClose })}
            disabled={mutation.isPending}
            className="flex gap-2"
          >
            Xóa
            {mutation.isPending && (
              <Loader className="animate-spin" />
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}