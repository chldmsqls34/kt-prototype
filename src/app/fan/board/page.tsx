import BoardSearchBar from "@/components/board/board-search-bar";
import { CreatePost } from "@/components/board/post-buttons";
import PostCard from "@/components/board/post-card";
import { Banner } from "@/components/common/banner";
import Pagination from "@/components/common/pagination";
import TabMenu from "@/components/common/tab-menu2";
import Breadcrumbs from "@/components/tailwind-ui/breadcrumbs/simple-with-chevrons";
import { FAN_BANNER_DATA } from "@/contants";
import { fetchFilteredPost, fetchPostsPages } from "@/services/post-service";


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
  const totalPages = await fetchPostsPages(query);
  const data = await fetchFilteredPost(query, currentPage, type);

  return(
    <div className="w-full">
      <Banner {...FAN_BANNER_DATA['/']}>
        <TabMenu tabs={FAN_BANNER_DATA['/'].tabs} />
      </Banner>
      <div className="w-[1100px] h-full mx-auto">
        <div className="mt-[50px] flex w-full justify-between">
          <BoardSearchBar/>
          <Breadcrumbs pages={['HOME', 'FAN', '팬 소통공간']} />
        </div>
        <PostCard posts={data}/>
        {totalPages && <Pagination totalPages={totalPages} />}
        <div className="py-4 flex justify-end">
          <CreatePost/>
        </div>
      </div>
    </div>
  );
}