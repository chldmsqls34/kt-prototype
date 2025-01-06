"use client"
import { ProfileDetail } from "@/types";
import { useState } from "react";
import { updateNickname } from "@/services/auth-action";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface UserInfoProps {
  userData: ProfileDetail
}

const nicknameSchema = z.object({
  nickname: z.string().min(2, "닉네임을 2글자 이상 입력하세요").max(15, "닉네임은 15자 이내여야 합니다."),
});

type NicknameFormValues = z.infer<typeof nicknameSchema>;

export default function UserInfo({userData}:UserInfoProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors: updateErrors },
  } = useForm<NicknameFormValues>({
    resolver: zodResolver(nicknameSchema),
  });

  const onUpdateSubmit = async (data: NicknameFormValues) => {
    try {
      const formData = new FormData();
      formData.append("nickname", data.nickname);
      const result = await updateNickname(formData);
      if (result && result.errors) {
        alert("닉네임 변경 중 문제가 발생했습니다.");
        return;
      }
      alert("닉네임이 변경되었습니다.");
      setIsEditing(false);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };


  return(
    <div className="space-y-4">
      <div className="flex items-center space-x-10 border-b border-gray-200 pb-6">
        <p className="text-sm font-semibold text-gray-800">이메일</p>
        <p className="text-sm">{userData.email}</p>
      </div>

      <div className="flex items-center space-x-10 border-b border-gray-200 pb-6">
        <p className="text-sm font-semibold text-gray-800">닉네임</p>
        {isEditing ? (
          <form className="flex items-center space-x-3" onSubmit={handleSubmit(onUpdateSubmit)}>
            <input
              {...register("nickname")}
              id="nickname"
              className="p-2 border border-gray-300 rounded-md text-sm"
              name="nickname"
              type="text"
              defaultValue={userData.nickname}
              required
            />
            {updateErrors.nickname && (
              <p className="mt-2 text-sm text-red-500">{updateErrors.nickname.message}</p>
            )}
            <button
              type="submit"
              className="px-4 py-2 text-sm border bg-[--black-color-500] text-white rounded-md hover:bg-gray-400"
            >
              저장
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm border bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              onClick={toggleEditing}
            >
              취소
            </button>
          </form>
        ) : (
          <>
            <p className="text-sm">{userData.nickname}</p>
            <button
              className="px-4 py-2 text-sm border bg-[--black-color-500] text-white rounded-md hover:bg-gray-400"
              onClick={toggleEditing}
            >
              변경
            </button>
          </>
        )}
      </div>
    </div>
  )
}