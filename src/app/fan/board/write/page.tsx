import CreatePostForm from "@/components/board/create-post-form";
import { Banner } from "@/components/common/banner";
import TabMenu from "@/components/common/tab-menu2";
import Breadcrumbs from "@/components/tailwind-ui/breadcrumbs/simple-with-chevrons";
import { FAN_BANNER_DATA } from "@/contants";

export default async function BoardWritePage(){

  return(
    <div className="w-full h-full">
      <Banner {...FAN_BANNER_DATA['/']}>
        <TabMenu tabs={FAN_BANNER_DATA['/'].tabs} />
      </Banner>
      <div className="flex w-full px-10 space-x-8 pb-16">
        <div className="flex-1 max-w-[1100px] mx-auto">
          <div className="mt-[50px] flex w-full justify-end">
            <Breadcrumbs pages={['HOME', 'FAN', '팬 소통공간', '작성하기']} />
          </div>
          <CreatePostForm/>
        </div>
      </div>
    </div>
  );
}