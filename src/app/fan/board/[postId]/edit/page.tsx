import EditPostForm from "@/components/board/edit-post-form";
import { Banner } from "@/components/common/banner";
import TabMenu from "@/components/common/tab-menu2";
import Breadcrumbs from "@/components/tailwind-ui/breadcrumbs/simple-with-chevrons";
import { FAN_BANNER_DATA } from "@/contants";
import { fetchPostById } from "@/services/post-service";
import { notFound } from "next/navigation";

export default async function BoardEditPage({
  params
}:{
  params: { 
    postId: number;
  }
}){
  const {postId} = params;

  const post = await fetchPostById(postId,1);
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
          <EditPostForm post={post}/>
        </div>
      </div>
    </div>
  );
}