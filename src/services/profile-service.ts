import { ProfileDetail } from "@/types";
import { BookmarkListItem } from "@/types/bookmark";
import { createClient } from "@/utils/supabase/server";


export async function fetchProfile():Promise<ProfileDetail | null> {
  try {
    const supabase = await createClient();
    const {data:userData} = await supabase.auth.getUser();
    const userId = userData.user?.id;
    const { data:memberData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!memberData) {
      return null;
    }
    const clientData:ProfileDetail = {
      id: memberData.id,
      nickname: memberData.nickname,
    };
    return clientData;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchBookmarkList() {
  try {
    const supabase = await createClient();
    const {data:userData} = await supabase.auth.getUser();
    const userId = userData.user?.id;
    const { data:bookmarkData } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId);

    if (!bookmarkData) {
      return [];
    }
    const clientData = bookmarkData.map((data) => ({
      id: data.id,
      userId: data.user_id,
      videoId: data.video_id,
      videoTitle: data.video_title,
      videoThumbnail: data.video_thumbnail,
      videoReg: data.video_reg,
    }));
    return clientData as BookmarkListItem[];
  } catch (error) {
    console.error(error);
    return [];
  }
}