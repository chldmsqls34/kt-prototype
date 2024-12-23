"use client";
import { PostDetail, ProfileDetail } from "@/types";
import { UserIcon } from "@heroicons/react/20/solid";
import { CalendarDaysIcon, CheckCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createComment, deleteComment, updateComment } from "@/services/comment-action";
import { useState } from "react";

interface PostDetailBoxProps {
  post: PostDetail;
  userData: ProfileDetail | null;
}

export default function PostDetailBox({post,userData}: PostDetailBoxProps) {
  const router = useRouter();
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const postId = post.id;
    await createComment(formData, postId);
    form.reset();
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>, commentId: number) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    await updateComment(formData, commentId);
    setEditingCommentId(null); // 수정 상태 종료

  };

  const handleDeleteComment = async (commentId:number) => {
    const confirmed = window.confirm('정말로 이 댓글을 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }
    try {
      const result = await deleteComment(commentId);
      if(result&&result.message){
        alert(result.message);
        return;
      }
    } catch (error) {
      console.error('Error deleting project:', error);
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
            <button
              onClick={() => router.push(`/fan/board/${post.id}/edit`)}
              className="bg-[--black-color-600] text-white text-sm px-4 py-2 rounded hover:bg-gray-500"
            >
              수정하기
            </button>
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
          <form onSubmit={handleCreateSubmit}>
            <div className="flex space-x-2">
              <textarea
                id="content"
                name="content"
                rows={3}
                placeholder="내용을 입력하세요"
                className="block w-full resize-none p-5 text-sm border-2"
                required
              />
              <button
                type="submit"
                className="bg-gray-600 text-white text-sm px-6 py-2 rounded hover:bg-gray-500"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
          <div className="pt-4">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="flex w-full">
                <div className="flex flex-col text-sm w-full border-t">
                  <div className="text-gray-800 w-full p-4 break-words space-y-8">
                    <div className="flex justify-between items-center mb-1">
                      {editingCommentId === comment.id ? (
                        <form
                          onSubmit={(e) => handleEditSubmit(e, comment.id)}
                          className="w-full"
                        >
                          <textarea
                            id="editContent"
                            name="editContent"
                            rows={3}
                            className="block w-full resize-none p-2 text-sm border"
                            defaultValue={comment.content}
                            required
                          />
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