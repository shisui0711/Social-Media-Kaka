import React from "react";
import { PostDto } from "@/lib/api-client";
import { toast } from "sonner-native";
import { Text, View } from "react-native";

const ShareButton = ({ post }: { post: PostDto }) => {
  const handleCoppy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.EXPO_PUBLIC_BASE_WEB_URL}/posts/${post.id}`
      );
      toast.success("Đường dẫn đã được sao chép vào bộ nhớ đệm");
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    //TODO: change to modal
    <View>
      <Text>Modal</Text>
    </View>
  );
};

export default ShareButton;
