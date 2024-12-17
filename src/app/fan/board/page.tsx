import BoardSearchBar from "@/components/board/board-search-bar";
import LiveTalkToggle from "@/components/board/live-talk-toggle";
import { CreatePost } from "@/components/board/post-buttons";
import PostCard from "@/components/board/post-card";
import { Banner } from "@/components/common/banner";
import Pagination from "@/components/common/pagination";
import TabMenu from "@/components/common/tab-menu2";
import Breadcrumbs from "@/components/tailwind-ui/breadcrumbs/simple-with-chevrons";
import { FAN_BANNER_DATA } from "@/contants";
import { fetchFilteredPost, fetchPostsPages } from "@/services/post-service";
import { fetchProfile } from "@/services/profile-service";

export default async function FanBoardPage({
  searchParams,
}:{
  searchParams: {
    query?: string;
    page?: number;
    type?: 'title' | 'content';
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const type = searchParams?.type || 'title';
  const [totalPages,postData,userData] = await Promise.all([
    fetchPostsPages(query),
    fetchFilteredPost(query, currentPage, type),
    fetchProfile(),
  ]);

  return(
    <div className="w-full h-full">
      <Banner {...FAN_BANNER_DATA['/']}>
        <TabMenu tabs={FAN_BANNER_DATA['/'].tabs} />
      </Banner>
      <div className="flex w-full px-10 space-x-4 pb-16 lg:pl-20 xl:pl-52">
        <div className="flex-1 max-w-[1100px]">
          <div className="mt-[50px] flex w-full justify-between">
            <BoardSearchBar/>
            <Breadcrumbs pages={['HOME', 'FAN', '팬 소통공간']} />
          </div>
          <PostCard posts={postData}/>
          <div className="mt-4 flex justify-between items-center">
            <div className="mx-auto flex justify-center">
              {totalPages && <Pagination totalPages={totalPages} />}
            </div>
            <CreatePost />
          </div>
        </div>
        <LiveTalkToggle userData={userData} />
      </div>
    </div>
  );
}