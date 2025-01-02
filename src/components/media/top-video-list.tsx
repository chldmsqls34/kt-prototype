"use client";
import { Videos } from "@/services/video-action";
import { useRouter } from "next/navigation";

interface TopVideoListProps {
  videos: Videos[];
}

export default function TopVideoList({videos}: TopVideoListProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {videos.map((photo: Videos, index: number) => (
        <div
          key={`${photo.artcSeq}-${index}`}
          className="flex flex-col overflow-hidden cursor-pointer"
          onClick={() => router.push(`/media/highlight/${photo.artcSeq}`)}
        >
          <div className="relative pt-[56.25%]">
            <img
              src={photo.imgFilePath || "/images/placeholder-img.png"}
              alt={`post-image-${photo.artcSeq}`}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/placeholder-img.png";
              }}
            />
          </div>
          <div className="p-2">
            <p className="text-sm font-semibold mb-1">{photo.artcTitle}</p>
            <p className="text-xs text-gray-400">{new Date(photo.regDttm).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}