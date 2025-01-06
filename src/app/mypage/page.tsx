import { Banner } from "@/components/common/banner";
import Pagination from "@/components/common/pagination";
import TabMenu from "@/components/common/tab-menu2";
import BookmarkList from "@/components/mypage/bookmark-list";
import UserInfo from "@/components/mypage/user-info";
import Breadcrumbs from "@/components/tailwind-ui/breadcrumbs/simple-with-chevrons";
import { FAN_BANNER_DATA } from "@/contants";
import { fetchBookmarkList, fetchBookmarkPages, fetchProfile } from "@/services/profile-service";
import { notFound } from "next/navigation";

export default async function MyPage({
  searchParams,
}:{
  searchParams: {
    page?: number;
  };
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const [bookmarks, totalPages, userData] = await Promise.all([
    fetchBookmarkList(currentPage),
    fetchBookmarkPages(),
    fetchProfile(),
  ]);
  if(!userData){
    notFound();
  }


  return (
    <div className="w-full h-full">
      <Banner {...FAN_BANNER_DATA['/']}>
        <TabMenu tabs={FAN_BANNER_DATA['/'].tabs} />
      </Banner>
      <div className="flex w-full px-10 space-x-8 pb-16">
        <div className="flex-1 max-w-[1100px] mx-auto">
          <div className="mt-[50px] flex w-full justify-end pb-6">
            <Breadcrumbs pages={['HOME', 'MYPAGE']} />
          </div>
          <div className="border p-10">
            <p className="font-semibold pb-12">내 정보</p>
            <UserInfo userData={userData} />
            {bookmarks && (
              <div className="mt-6">
                <p className="text-sm font-bold">북마크한 영상 목록</p>
                <BookmarkList bookmarks={bookmarks} />
              </div>
            )}
            <div className="mt-8 flex justify-center">
              {totalPages && <Pagination totalPages={totalPages} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}