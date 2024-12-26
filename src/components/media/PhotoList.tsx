"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface Photo {
  artcNextSeq: number;
  artcPrevSeq: number;
  artcSeq: number;
  artcSubTitle: string;
  artcTitle: string;
  boardCatSeq: number;
  boardCode: string;
  contentsDate: string;
  delYn: string;
  endDttm: number;
  imgFilePath: string;
  maxArticlePerPage: number;
  regDttm: number;
  regr: string;
  startDttm: number;
  totalPage: number;
  updDttm: number;
  updr: string;
  useYn: string;
  viewCnt: number;
}


export default function PhotoList() {
  const [photoList, setPhotoList] = useState<Photo[]>(); // 초기 데이터
  const [count, setCount] = useState(9); // 초기 데이터 개수로 설정
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 데이터 로드 함수
  const loadMorePhotos = useCallback(async () => {
    if (isLoading) return; // 중복 요청 방지
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/photolist?count=${count}`);
      const newPhotos = await res.json();
      setPhotoList(newPhotos.data.list); // 서버에서 최신 데이터 세트를 반환하므로 덮어씁니다
      console.log("Previous count:", count);
      setCount((prev) => prev + 9);
      console.log("Updated count:", count);
    } catch (error) {
      console.error("Failed to load more photos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [count, isLoading]);
  
  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePhotos();
        }
      },
      { threshold: 1.0 }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [loadMorePhotos]);

  return (
    <div className="mt-10">
      {photoList && photoList.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {photoList.map((photo: Photo, index: number) => (
            <div key={index} className="flex justify-center">
              <Image
                src={photo.imgFilePath}
                alt={`post-image-${index}`}
                width={200}
                height={120}
                unoptimized
                className="rounded-md shadow-lg"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No results found.</div>
      )}

      <div ref={observerRef} className="py-5 text-center">
        {isLoading ? (
          <p className="text-blue-500">Loading...</p>
        ) : (
          <p className="text-gray-500">Scroll down to load more</p>
        )}
      </div>
    </div>


  );
}