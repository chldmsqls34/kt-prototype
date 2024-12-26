"use client";
import { PostDetail, ProfileDetail } from "@/types";
import { UserIcon } from "@heroicons/react/20/solid";
import { CalendarDaysIcon, CheckCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createComment, deleteComment, updateComment } from "@/services/comment-action";
import { useState } from "react";
import { deletePost } from "@/services/post-action";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface PostDetailBoxProps {
  post: PostDetail;
  userData: ProfileDetail | null;
}
const commentSchema = z.object({
  content: z.string().min(2, "내용을 2글자 이상 입력하세요").max(500, "내용은 500자 이내여야 합니다."),
});

type CommentFormValues = z.infer<typeof commentSchema>;

export default function PostDetailBox({post,userData}: PostDetailBoxProps) {
  const router = useRouter();
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  // 댓글 작성 폼
  const {
    register: createRegister,
    handleSubmit: handleCreateSubmit,
    reset: resetCreateForm,
    formState: { errors: createErrors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
  });

  // 댓글 수정 폼
  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    formState: { errors: editErrors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
  });

  const onCreateSubmit = async (data: CommentFormValues) => {
    if(!userData){
      alert('로그인이 필요합니다');
      return;
    }
    try {
      const formData = new FormData();
      formData.append("content", data.content);
      const result = await createComment(formData, post.id);
      if (result && result.errors) {
        alert("댓글 작성 중 문제가 발생했습니다.");
        return;
      }
      resetCreateForm();
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("댓글 작성 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const onEditSubmit = async (data: CommentFormValues, commentId: number) => {
    try {
      const formData = new FormData();
      formData.append("content", data.content);
      const result = await updateComment(formData, commentId);
      if (result && result.errors) {
        alert("댓글 수정 중 문제가 발생했습니다.");
        return;
      }
      setEditingCommentId(null);
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("댓글 수정 중 문제가 발생했습니다. 다시 시도해주세요.");
    }

  };

  const handleDeleteComment = async (commentId:number) => {
    const confirmed = window.confirm('정말로 이 댓글을 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleDeletePost = async (postId:number) => {
    const confirmed = window.confirm('정말로 이 게시글을 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }
    try {
      await deletePost(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full pt-6">
        <div className="flex justify-between items-center rounded-lg bg-[--white-color-200] p-4 border-t-2 border-[--main-red-color]">
          <div>
            <p>{post.title}</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-[--gray-color-100]">
            <div className="flex items-center gap-1">
              <UserIcon className="w-4 h-4" />
              <p>{post.author}</p>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDaysIcon className="w-4 h-4" />
              <p>{post.createdAt}</p>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4" />
              <p>{post.viewCount}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 p-4 min-h-[400px] text-sm">
          <p>{post.content}</p>
          {post.images?.map((image, index) => (
            <div key={index} className="flex py-5 justify-center">
              <Image
                src={image}
                alt={`post-image-${index}`}
                width={800}
                height={600}
                unoptimized
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end items-center mt-5 border-t-2 border-[--main-red-color] pt-3 space-x-4">
          {userData?.id === post.userId && (
            <>
              <button 
                onClick={()=>handleDeletePost(post.id)}
                className="bg-[--black-color-600] text-white text-sm px-4 py-2 rounded hover:bg-gray-500"
              >
                삭제하기
              </button>
              <button
                onClick={() => router.push(`/fan/board/${post.id}/edit`)}
                className="bg-[--black-color-600] text-white text-sm px-4 py-2 rounded hover:bg-gray-500"
              >
                수정하기
              </button>
            </>
          )}
          <button
            onClick={() => router.push('/fan/board')}
            className="bg-[--black-color-600] text-white text-sm px-4 py-2 rounded hover:bg-gray-500"
          >
            목록보기
          </button>
        </div>
        <div className="space-y-4 pt-8">
          <h1>댓글</h1>
          <form onSubmit={handleCreateSubmit(onCreateSubmit)}>
            <div className="flex space-x-2">
              <textarea
                {...createRegister("content")}
                rows={3}
                placeholder="내용을 입력하세요"
                className="block w-full resize-none p-5 text-sm border-2"
              />
              <button
                type="submit"
                className="bg-gray-600 text-white text-sm px-6 py-2 rounded hover:bg-gray-500"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
            {createErrors.content && (
              <p className="mt-2 text-xs text-red-500">{createErrors.content.message}</p>
            )}
          </form>

          <div className="pt-4">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="flex w-full">
                <div className="flex flex-col text-sm w-full border-t">
                  <div className="text-gray-800 w-full p-4 break-words space-y-8">
                    <div className="flex justify-between items-center mb-1">
                      {editingCommentId === comment.id ? (
                        <form
                          onSubmit={handleEditSubmit((data) => onEditSubmit(data, comment.id))}
                          className="w-full"
                        >
                          <textarea
                            {...editRegister("content")}
                            rows={3}
                            className="block w-full resize-none p-2 text-sm border"
                            defaultValue={comment.content}
                          />
                          {editErrors.content && (
                            <p className="mt-2 text-sm text-red-500">{editErrors.content.message}</p>
                          )}
                          <div className="flex gap-2 py-2">
                            <button
                              type="submit"
                              className="text-sm"
                            >
                              저장
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCommentId(null)}
                              className="text-sm"
                            >
                              취소
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="whitespace-pre-wrap">{comment.content}</div>
                      )}
                      {userData?.id === comment.userId && editingCommentId !== comment.id && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingCommentId(comment.id)}
                            className="text-sm"
                          >
                            수정
                          </button>
                          <button 
                            onClick={()=>handleDeleteComment(comment.id)}
                            className="text-sm"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-gray-600 font-semibold text-xs">{comment.author}</div>
                      <div className="text-gray-400 text-xs">{comment.createdAt}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>

  );
}