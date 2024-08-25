"use server";

import { createCommentSchema } from "@/lib/validation";
import { cookies } from "next/headers";
import { CommentDto, PostDto } from "@/app/web-api-client";
import { getApiClient } from "@/lib/apiClient";

export async function submitComment({
  post,
  content,
}: {
  post: PostDto;
  content: string;
}) {
  const token = cookies().get("token")?.value;
  if (!token) throw new Error("Unauthorized");
  const client = getApiClient(token);
  const { content: contenValidated } = createCommentSchema.parse({ content });

  const comment = await client.createComment({
    postId: post.id,
    content: contenValidated,
  }).catch(() => {
    throw new Error("Error creating comment")
  });
  return comment;
}

export async function submitNestedComment({
  comment,
  content,
}: {
  comment: CommentDto;
  content: string;
}) {
  const token = cookies().get("token")?.value;
  if (!token) throw new Error("Unauthorized");
  const client = getApiClient(token);
  const { content: contenValidated } = createCommentSchema.parse({ content });

  const newComment = await client.createNestedComment({
    commentId: comment.id,
    content: contenValidated,
  }).catch(() => {
    throw new Error("Error creating comment")
  });
  return newComment;
}

export async function deleteComment(id: string) {
  const token = cookies().get("token")?.value;

  if (!token) throw new Error("Unauthorized");
  const client = getApiClient(token);


  const comment = await client.removeComment(id).catch(() => {
    throw new Error("Error remove comment")
  });
  return comment;
}
