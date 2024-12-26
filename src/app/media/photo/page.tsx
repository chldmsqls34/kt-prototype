import BoardSearchBar from "@/components/board/board-search-bar";
import { Banner } from "@/components/common/banner";
import TabMenu from "@/components/common/tab-menu2";
import PhotoList from "@/components/media/PhotoList";
import Breadcrumbs from "@/components/tailwind-ui/breadcrumbs/simple-with-chevrons";
import { MEDIA_BANNER_DATA } from "@/contants";

export default async function PhotoPage() {


  return (
    <div className="w-full h-full">
      <Banner {...MEDIA_BANNER_DATA['/photos']}>
        <TabMenu tabs={MEDIA_BANNER_DATA['/photos'].tabs} />
      </Banner>
      <div className="flex w-full px-10 pb-16">
        <div className="flex-1 max-w-[1100px] mx-auto">
          <div className="mt-[50px] flex w-full justify-between">
            <BoardSearchBar/>
            <Breadcrumbs pages={['HOME', 'MEDIA', 'wiz 포토']} />
          </div>
          <PhotoList/>
        </div>

      </div>
    </div>
  );
}