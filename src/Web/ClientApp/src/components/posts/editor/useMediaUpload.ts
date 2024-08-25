import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { Attachment } from "@/types";
import { useState } from "react";

export default function useMediaUpload() {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();
  const { startUpload, isUploading } = useUploadThing("attchement", {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();
        const fileName = `attachment_${crypto.randomUUID()}.${extension}`;
        return new File([file], fileName, {
          type: file.type,
        });
      });
      setAttachments(prev => [
        ...prev,
        ...renamedFiles.map(file => ({
          file,
          isUploading: true,
          type: file.type.split('/')[0].toUpperCase(),
        }))
      ])
      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      setAttachments(prev => prev.map(attachment => {
        const uploadResult = res.find(r=> r.name === attachment.file.name)
        if(!uploadResult) return attachment
        return {
          ...attachment,
          mediaUrl: uploadResult.serverData.mediaUrl,
          isUploading: false
        }
      }))
    },
    onUploadError(err) {
      setAttachments(prev => prev.filter(attachment => !attachment.isUploading))
      toast({
        variant: 'destructive',
        title: 'Lỗi khi tải tệp',
        description: err.message
      })
    }
  });
  
  const handleStartUpload = (files:File[]) => {
    if(isUploading){
      toast({
        variant: 'destructive',
        title: 'Vui lòng chờ đến khi tải xong tệp hiện tại',
      })
      return
    }

    if(attachments.length + files.length > 5){
      toast({
        variant: 'destructive',
        title: 'Bạn chỉ được tải lên tối đa 5 tệp cho bài viết.',
      })
    }

    startUpload(files);
  }

  const removeAttachment = (fileName:string) => {
    setAttachments(prev => prev.filter(attachment => attachment.file.name !== fileName))
  }

  const resetMediaUploads = () => {
    setAttachments([])
    setUploadProgress(undefined)
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    resetMediaUploads
  }
}
