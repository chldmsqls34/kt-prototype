"use client";
import { createPost } from "@/services/post-action";
import { useFormState } from "react-dom";
import { useState } from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function CreatePostForm() {
  const router = useRouter();
  const initialState = { message: '', errors: {} };
  const [state, formAction] = useFormState(createPost, initialState);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = e.target.files ? Array.from(e.target.files) : [];
    // 중복된 파일 제거 (파일명과 수정시간이 일치하는 파일 제외)
    const newFiles = files.filter(
      (file) =>
        !images.some((image) => image.file.name === file.name && image.file.lastModified === file.lastModified)
    );

    // 업로드 제한 (최대 3개)
    if (newFiles.length + images.length > 3) {
      alert("이미지는 최대 3개까지 업로드할 수 있습니다.");
      return;
    }
    const newImagePreviews = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImagePreviews]);
  };

  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    images.forEach((img) => formData.append("images", img.file));

    formAction(formData);
    setImages([]);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full py-10">
        <form onSubmit={handleSubmit} className="relative">
          <div className="rounded-lg bg-white outline outline-1 -outline-offset-1 outline-gray-300">
            <label htmlFor="title" className="sr-only">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="제목"
              className="block w-full p-5 font-medium text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 border-b"
              required
            />
            {state.errors?.title && (
              <p className="text-red-500 text-sm">{state.errors.title[0]}</p>
            )}
            <label htmlFor="content" className="sr-only">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={10}
              placeholder="내용을 입력하세요"
              className="block w-full resize-none p-5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
              defaultValue={''}
              required
            />
            {state.errors?.content && (
              <p className="text-red-500 text-sm">{state.errors.content[0]}</p>
            )}
          </div>

          <div className="px-3 py-3">
            <input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            {state.errors?.imageFiles && (
              <p className="text-red-500 text-sm mt-1">{state.errors.imageFiles[0]}</p>
            )}
            <div className="flex gap-2 mt-3">
              {images.map((img, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={img.preview}
                    alt="미리보기"
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          {state.message && (
            <div className="text-center text-red-500 text-sm">{state.message}</div>
          )}

          <div className="flex justify-between items-center mt-5 border-t border-gray-200 pt-3">
            <label htmlFor="file-input" className="flex items-center text-gray-500 hover:text-gray-600 cursor-pointer">
              <PaperClipIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              <span className="text-sm italic">파일 추가</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/fan/board')
                }}
                className="bg-[--black-color-600] text-white text-sm px-4 py-2 rounded hover:bg-gray-400"
              >
                목록보기
              </button>
              <button
                type="submit"
                className="bg-gray-600 text-white text-sm px-4 py-2 rounded hover:bg-gray-400"
              >
                작성하기
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

  );
}
