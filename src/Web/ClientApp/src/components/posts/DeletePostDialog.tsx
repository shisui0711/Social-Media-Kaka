
import React from "react";
import { useDeletePostMutation } from "./mutations";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { Separator } from "../ui/separator";
import { PostDto } from "@/app/web-api-client";

const DeletePostDialog = ({
  post,
  open,
  onClose,
}: {
  post: PostDto;
  open: boolean;
  onClose: () => void;
}) => {
  const mutation = useDeletePostMutation(post);

  const handleOpenChange = (open: boolean) => {
    if (!open || !mutation.isPending) {
      onClose();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary font-bold">
            Xóa bài viết này ?
          </DialogTitle>
          <Separator/>
          <DialogDescription className="text-destructive">
            Bạn có chắc muốn xóa bài viết này ? Hành động này không thể hoàn tác
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" className="flex gap-2" disabled={mutation.isPending}
            onClick={()=> mutation.mutate(post.id, { onSuccess: onClose})}
          >
            Xóa
            {mutation.isPending && <Loader className="animate-spin"/>}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePostDialog;
