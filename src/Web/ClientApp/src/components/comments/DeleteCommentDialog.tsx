
import { CommentDto } from "@/app/web-api-client";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useDeleteCommentMutation } from "./mutations";
import { Loader } from "lucide-react";

interface DeleteCommentDialogProps {
  comment: CommentDto;
  open: boolean;
  onClose: () => void;
}

export default function DeleteCommentDialog({
  comment,
  open,
  onClose,
}: DeleteCommentDialogProps) {
  const mutation = useDeleteCommentMutation();

  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa bình luận ?</DialogTitle>
          <DialogDescription>
            Bạn chắc chắn muốn xóa bình luận này chứ ? Thao tác này không thể hoàn tác
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate(comment.id, { onSuccess: onClose })}
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