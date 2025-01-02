import TopVideoList from "@/components/media/top-video-list";
import VideoList from "@/components/media/video-list";
import VideoSearchBar from "@/components/media/video-search-bar";
import Breadcrumbs from "@/components/tailwind-ui/breadcrumbs/simple-with-chevrons";
import { getTopVideos, getVideoList } from "@/services/video-action";

const INITIAL_NUMBER_OF_VIDEOS = 12

export default async function HighlightPage({
  searchParams,
}:{
  searchParams: {
    query?: string;
  };
}){
  const query = searchParams?.query || '';
  const initialVideos = await getVideoList(0, INITIAL_NUMBER_OF_VIDEOS, query);
  const videos = await getTopVideos();

  return(
    <div className="flex w-full px-10 pb-16">
      <div className="flex-1 max-w-[1100px] mx-auto">
        <div className="mt-[50px] flex w-full justify-end">
          <Breadcrumbs pages={['HOME', 'MEDIA', '하이라이트']} />
        </div>
        <div className="py-5 pb-10">
          <p className="text-sm font-semibold py-5">인기영상 TOP3</p>
          <TopVideoList videos={videos}/>
        </div>
        <VideoSearchBar/>
        {initialVideos.length > 0 && <VideoList initialVideos={initialVideos} query={query}/>}
      </div>
    </div>
  );
}