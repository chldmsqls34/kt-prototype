"use client";

import { PostDetail } from "@/types";
import { UserIcon } from "@heroicons/react/20/solid";
import { CalendarDaysIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface PostDetailBoxProps {
  post: PostDetail;
}

export default function PostDetailBox({post}: PostDetailBoxProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center">
      <div className="w-full py-6">
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
          {
            post.images?.map((image, index) => (
              <img key={index} src={image} alt="post" className="mt-5"/>
            ))
          }
        </div>
        <div className="flex justify-end items-center mt-5 border-t-2 border-[--main-red-color] pt-3">
          <button
            onClick={() => router.push('/fan/board')}
            className="bg-[--black-color-600] text-white text-sm px-4 py-2 rounded hover:bg-gray-500"
          >
            목록보기
          </button>
        </div>

      </div>
    </div>

  );
}