import React from "react";
import ReactNativeModal from "react-native-modal";

import { PostDto } from "@/lib/api-client";
import { useDeletePostMutation } from "@/hooks/mutations/post.mutations";
import CustomButton from "../CustomButton";
import { Loader2 } from "lucide-react-native";
import { Text, View } from "react-native";
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
  return (
    <ReactNativeModal
      isVisible={open}
      onBackdropPress={() => {
        onClose();
      }}
    >
      <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
        <Text className="text-2xl text-center font-InterBold mt-5">
          Xóa bài viết này ?
        </Text>
        <Text className="text-md text-muted-foreground font-InterMedium text-center mt-3">
          Bạn có chắc muốn xóa bài viết này ? Hành động này không thể hoàn tác
        </Text>
        <View className="flex items-center gap-3 justify-center">
          <CustomButton
            title="Xóa"
            bgVariant="destructive"
            disabled={mutation.isPending}
            onPress={() => mutation.mutate(post.id, { onSuccess: onClose })}
            IconRight={() => (
              <Loader2
                className={`animate-spin ${!mutation.isPending && "hidden"}`}
              />
            )}
          />
          <CustomButton
            title="Hủy"
            bgVariant="outline"
            onPress={onClose}
            disabled={mutation.isPending}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default DeletePostDialog;
