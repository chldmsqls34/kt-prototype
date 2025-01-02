'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface Videos {
  artcNextSeq: number;
  artcPrevSeq: number;
  artcSeq: number;
  artcTitle: string;
  boardCatSeq: number;
  boardCode: string;
  contentsDate: string;
  delYn: string;
  imgFilePath: string;
  maxArticlePerPage: number;
  refSeq: number;
  regDttm: number;
  regr: string;
  totalPage: number;
  updDttm: number;
  updr: string;
  useYn: string;
  videoLink: string;
  viewCnt: number;
}


// export const getVideos = async (offset: number, limit: number) => {
//   try {
//     const url = `${process.env.WIZ_API_URL}/v2/article/listByCategory?article.boardCode=010&search.pos=${offset}&search.max=${limit}`
//     const response = await fetch(url)
//     const result = await response.json();
//     console.log('getVideos의 결과:',result.data.list);
//     return result.data.list as Videos[];
//   } catch (error: unknown) {
//     console.log(error)
//     throw new Error(`An error happened: ${error}`)
//   }
// }

export const getVideoList = async (offset: number, limit: number, query?: string) => {
  try {
    const currentPage = Math.floor(offset / limit) + 1;
    const url = `${process.env.SERVER_API_URL}/article/wizhighlightlistpage?searchWord=${query}&itemCount=${limit}&pageNum=${currentPage}`
    const response = await fetch(url)
    const result = await response.json();
    console.log('getVideoList의 결과:',result.data.list);
    return result.data.list as Videos[];
  } catch (error: unknown) {
    console.log(error)
    throw new Error(`An error happened: ${error}`)
  }
}

export const getTopVideos = async () => {
  try {
    const url = `${process.env.SERVER_API_URL}/article/wizhighlight_top3`
    const response = await fetch(url,{cache: "no-cache"})
    const result = await response.json();
    console.log(result);
    return result.top3 as Videos[];
  } catch (error: unknown) {
    console.log(error)
    throw new Error(`An error happened: ${error}`)
  }
}

export const getVideoDetail = async (videoId:number) => {
  try {
    const url = `${process.env.SERVER_API_URL}/article/wizhighlightdetail?artcSeq=${videoId}`
    const response = await fetch(url)
    const result = await response.json();
    console.log(result);
    return result.data.article as Videos;
  } catch (error: unknown) {
    console.log(error)
    throw new Error(`An error happened: ${error}`)
  }
}

export async function addBookmark(videoId:number, videoTitle:string, videoThumbnail: string, videoReg: number) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData?.user) {
    return { message: '로그인이 필요합니다' };
  }

  const userId = userData.user.id;

  const { error: bookmarkError } = await supabase
    .from('bookmarks')
    .insert([
      {
        user_id: userId,
        video_id: videoId,
        video_title: videoTitle,
        video_thumbnail: videoThumbnail,
        video_reg: videoReg,
      },
    ])

  if (bookmarkError) {
    return { message: '북마크 저장에 실패했습니다' };
  }
  revalidatePath(`/media/highlight/${videoId}`)

}


export async function checkBookmarked(videoId: number) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData?.user) {
    return false;
  }

  const userId = userData.user.id;

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .match({ user_id: userId, video_id: videoId })
    .single();

  if (error) {
    console.error("Error fetching bookmark status:", error);
    return false;
  }
  return !!data;
}

export async function removeBookmark(videoId:number) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData?.user) {
    return { message: '로그인이 필요합니다' };
  }

  const userId = userData.user.id;

  const { error: bookmarkError } = await supabase
    .from('bookmarks')
    .delete()
    .match({ user_id: userId, video_id: videoId })

  if (bookmarkError) {
    return { message: '북마크 삭제에 실패했습니다' };
  }
  revalidatePath(`/media/highlight/${videoId}`)

}