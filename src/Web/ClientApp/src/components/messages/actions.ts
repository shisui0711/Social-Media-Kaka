"use server";

import { createMessageSchema } from "@/lib/validation";
import { cookies } from "next/headers";
import { getApiClient } from "@/lib/apiClient";
import { ConversationDto } from "@/app/web-api-client";

export async function submitMessage({
  conversation,
  senderId,
  message,
}: {
  conversation: ConversationDto;
  senderId: string;
  message: string;
}) {
  const token = cookies().get("token")?.value;
  if (!token) throw new Error("Unauthorized");
  const { message: messageValidated } = createMessageSchema.parse({ message });
  const client = await getApiClient(token);
  const newMessage = await client
    .createMessage({
      conversationId: conversation.id,
      senderId,
      content: messageValidated,
    })
    .catch(() => {
      throw new Error("Error sending messaage");
    });
  return newMessage;
}

export async function ensureCreatedConversation(receiverId: string) {
  const token = cookies().get("token")?.value;
  if (!token) throw new Error("Unauthorized");
  const client = await getApiClient(token);
  const newConversation = await client
    .ensureCreatedConversation({ receiverId })
    .catch(() => {
      throw new Error("Error creating conversation");
    });
  return newConversation;
}

export async function deleteConversation(id: string) {
  const token = cookies().get("token")?.value;

  if (!token) throw new Error("Unauthorized");
  const client = await getApiClient(token);
  const deletedConversation = await client.removeConversation(id).catch(() => {
    throw new Error("Error deleting conversation");
  });
  return deletedConversation;
}

export async function addUserToConversation({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) {
  const token = cookies().get("token")?.value;

  if (!token) throw new Error("Unauthorized");
  const client = await getApiClient(token);
  await client.addUserToGroup({ conversationId, userId });
}
