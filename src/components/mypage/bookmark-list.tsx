"use client";
import { BookmarkListItem } from "@/types/bookmark";
import { useRouter } from "next/navigation";

interface BookmarkListProps {
  bookmarks: BookmarkListItem[];
}

export default function BookmarkList({bookmarks}:BookmarkListProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {bookmarks.map((bookmark: BookmarkListItem) => (
          <div
            key={bookmark.id}
            className="flex flex-col overflow-hidden cursor-pointer"
            onClick={() => router.push(`/media/highlight/${bookmark.videoId}`)}
          >
            <div className="relative pt-[56.25%]">
              <img
                src={bookmark.videoThumbnail || "/images/placeholder-img.png"}
                alt={`post-image-${bookmark.id}`}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                loading="lazy"

              />
            </div>
            <div className="p-2">
              <p className="text-sm font-semibold mb-1">{bookmark.videoTitle}</p>
              <p className="text-xs text-gray-400">{new Date(bookmark.videoReg).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}