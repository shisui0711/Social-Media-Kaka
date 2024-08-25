import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import { Separator } from "../ui/separator";
import CopyLink from "../share/CopyLink";
import { useToast } from "../ui/use-toast";
import { PostDto } from "@/app/web-api-client";

const ShareButton = ({post}:{post:PostDto}) => {
  const { toast} = useToast()
  const handleCoppy = async () => {
    try {
      await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post.id}`)
    toast({
      title: "Đã sao chép",
      description: "Đường dẫn đã được sao chép vào bộ nhớ đệm",
      className: "text-white bg-primary"
      })
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra. Vui lòng thử lại.",
        variant: "destructive"
      }
      )
    }
    }
  return (
    <Dialog>
      <DialogTrigger><ExternalLink /></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary text-center">Chia sẻ</DialogTitle>
          <Separator/>
          <DialogDescription className="flex flex-wrap gap-2 items-center">
            <CopyLink onClick={handleCoppy} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;
