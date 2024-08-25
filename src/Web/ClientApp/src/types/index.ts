

export interface UserAvatarProps {
  avatarUrl?: string | undefined | null;
  size?: number;
  className?: string;
}

export type MessageBody = {
  message: string
}

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
  mediaUrl?:string;
  type: string;
}