import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";

const useNotification = () => {
  const queryClient = useQueryClient();
  const client = useApiClient();

  const { mutate:markAsReadNotifications } = useMutation({
    mutationFn: () => client.markasSeenAllMyNotification(),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      });
    },
    onError(error) {
      console.error("Failed to mark notifications as read", error);
    },
  });

  const { mutate:markAsReadNotification } = useMutation({
    mutationFn: (notificationId: string) => client.markAsSeenMyNotification(notificationId)
  })

  return { markAsReadNotification, markAsReadNotifications}
};

export default useNotification;
