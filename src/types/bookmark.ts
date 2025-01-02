export interface BookmarkEntity {
  id: number;
  user_id: string;
  video_id: number;
  video_title: string;
  video_thumbnail: string;
  video_reg: number;
}

export interface BookmarkListItem {
  id: number;
  userId: string;
  videoId: number;
  videoTitle: string;
  videoThumbnail: string;
  videoReg: number;
}