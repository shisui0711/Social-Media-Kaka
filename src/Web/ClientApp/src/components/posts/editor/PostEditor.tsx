"use client";

import React, { ClipboardEvent, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKid from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import UserAvatar from "@/components/UserAvatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader, SmilePlus, X } from "lucide-react";
import { useSubmitPostMutation } from "./mutations";
import useMediaUpload from "./useMediaUpload";
import { Attachment } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { UploadProgress } from "@/components/ui/UploadProgress";
import { useDropzone } from "@uploadthing/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmojiPicker from "emoji-picker-react";

const PostEditor = () => {
  const { user } = useAuthorization();

  const mutation = useSubmitPostMutation();

  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    resetMediaUploads,
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  const { onClick, ...rootProps } = getRootProps();

  const closeButton = useRef<HTMLButtonElement | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKid.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: `${user.displayName} ơi, Hãy viết suy nghĩ của bạn ?`,
      }),
    ],
  });

  const content =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const handleEmojiClick = (emoji: string) => {
    editor?.chain().focus().insertContent(emoji).run();
  }

  const onSubmit = () => {
    try {
      mutation.mutate(
        {
          content,
          medias: attachments
            .filter((x) => x.mediaUrl !== undefined)
            .map((a) => ({
              mediaUrl: a.mediaUrl!,
              type: a.type.split("/")[0].toUpperCase(),
            })),
        },
        {
          onSuccess: (data) => {
            editor?.commands.clearContent();
            resetMediaUploads();
            closeButton.current?.click();
          },
        }
      );
    } catch (error) {
      console.log("Error create post: ", error);
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[];
    startUpload(files);
  };
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5 items-center">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden md:inline" />
        <Dialog>
          <DialogTrigger asChild>
            <div className="bg-background py-3 px-5 w-full rounded-full flex flex-col lg:flex-row text-muted-foreground">
              <span>{`${user.displayName} ơi, `}</span>
              <span>Hãy viết suy nghĩ của bạn ?</span>
            </div>
          </DialogTrigger>
          <DialogContent
            onCloseClick={() => {
              editor?.commands.clearContent();
              resetMediaUploads();
            }}
          >
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-semibold text-primary text-center">
                Tạo bài viết
              </h1>
              <Separator className="my-3" />
              <div className="flex items-center justify-start gap-3">
                <UserAvatar
                  avatarUrl={user.avatarUrl}
                  className="size-7 md:size-14"
                />
                <div className="flex flex-col gap-2">
                  <span>{user.displayName}</span>
                </div>
              </div>
              <div {...rootProps} className="w-full outline-none">
                <EditorContent
                  editor={editor}
                  className={cn(
                    "w-full max-h-[10rem] md:max-h-[12rem] overflow-y-auto bg-background rounded-2xl my-2 p-3",
                    isDragActive && "outline-dashed"
                  )}
                  onPaste={onPaste}
                />
                <input {...getInputProps()} />
              </div>
              {!!attachments.length && (
                <ListAttachmentPreview
                  attachments={attachments}
                  removeAttachment={removeAttachment}
                />
              )}
              {isUploading && (
                <div className="my-3 flex gap-2">
                  <UploadProgress
                    value={uploadProgress ?? 10}
                    max={100}
                    className="w-full"
                  />
                  <Loader className="size-5 animate-spin text-primary" />
                </div>
              )}
              <Separator />
              <div className="flex gap-3 items-center justify-between">
                <AddAttachmentsButton
                  onFilesSelected={startUpload}
                  disabled={isUploading || attachments.length >= 5}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost"
                      size="icon"
                    >
                      <SmilePlus className="text-yellow-500" />
                    </Button>
                    </DropdownMenuTrigger>
                  <DropdownMenuContent side="right">
                    <EmojiPicker onEmojiClick={(e)=>handleEmojiClick(e.emoji)}/>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Separator className="mb-3" />
              <Button
                onClick={onSubmit}
                disabled={!content.trim() || mutation.isPending || isUploading}
                className="w-full flex gap-2"
              >
                Đăng
                {mutation.isPending && <Loader className="animate-spin" />}
              </Button>
              <DialogClose ref={closeButton}></DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PostEditor;

interface AddAttachmentsButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

const AddAttachmentsButton = ({
  onFilesSelected,
  disabled,
}: AddAttachmentsButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="!text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        multiple
        ref={fileInputRef}
        className="hidden sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
};

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}

const AttachmentPreview = ({
  attachment: { file, mediaId, isUploading },
  onRemoveClick,
}: AttachmentPreviewProps) => {
  const src = URL.createObjectURL(file);

  return (
    <div className={cn("relative ", isUploading && "opacity-50")}>
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt={file.name}
          width={500}
          height={500}
          className="w-full rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X className="size-3 md:size-5" />
        </button>
      )}
    </div>
  );
};

interface ListAttachmentPreviewProps {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void;
}

const ListAttachmentPreview = ({
  attachments,
  removeAttachment,
}: ListAttachmentPreviewProps) => {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-3 overflow-y-auto min-h-[8rem] max-h-[16rem]"
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
        />
      ))}
    </div>
  );
};
