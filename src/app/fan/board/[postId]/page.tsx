import PostDetailBox from "@/components/board/post-detail-box";
import { Banner } from "@/components/common/banner";
import Pagination from "@/components/common/pagination";
import TabMenu from "@/components/common/tab-menu2";
import Breadcrumbs from "@/components/tailwind-ui/breadcrumbs/simple-with-chevrons";
import { FAN_BANNER_DATA } from "@/contants";
import { fetchCommentsPages, fetchPostById } from "@/services/post-service";
import { fetchProfile } from "@/services/profile-service";
import { notFound } from "next/navigation";

export default async function BoardDetailPage({
  params,searchParams,
}:{
  params: { 
    postId: number;
  },
  searchParams: {
    page?: number;
  };
}) {
  const {postId} = params;
  const currentPage = Number(searchParams?.page) || 1;
  const [post, totalPages, userData] = await Promise.all([
    fetchPostById(postId, currentPage),
    fetchCommentsPages(postId),
    fetchProfile(),
  ]);
  if(!post) {
    notFound();
  }
  return(
    <div className="w-full h-full">
      <Banner {...FAN_BANNER_DATA['/']}>
        <TabMenu tabs={FAN_BANNER_DATA['/'].tabs} />
      </Banner>
      <div className="flex w-full px-10 space-x-8 pb-16">
        <div className="flex-1 max-w-[1100px] mx-auto">
          <div className="mt-[50px] flex w-full justify-end">
            <Breadcrumbs pages={['HOME', 'FAN', '팬 소통공간']} />
          </div>
          <PostDetailBox post={post} userData={userData}/>
          {totalPages && <Pagination totalPages={totalPages} />}
        </div>
      </div>
    </div>
  );
}