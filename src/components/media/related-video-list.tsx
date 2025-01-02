"use client";
import { Videos } from "@/services/video-action";
import Link from "next/link";

interface RelatedVideoListProps {
  videos: Videos[];
}

export default function RelatedVideoList({videos}: RelatedVideoListProps) {
  return (
    <div className="flex flex-col space-y-2">
      {videos.map(
        (video, index) =>
          video && (
            <Link
              key={index}
              href={`/media/highlight/${video.artcSeq}`}
              className="flex items-center space-x-4 p-2"
            >
              <div className="w-44 h-24 flex-shrink-0">
                <img
                  src={video.imgFilePath || "/images/placeholder-img.png"}
                  alt={video.artcTitle}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="flex flex-col flex-1 space-y-4">
                <p className="font-bold line-clamp-1">{video.artcTitle}</p>
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <p>
                    조회수 {video.viewCnt}회
                  </p>
                  <span className="mx-2 text-gray-400">•</span>
                  <p>{new Date(video.regDttm).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
          )
      )}
    </div>
  );
}