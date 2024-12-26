import BoardSearchBar from "@/components/board/board-search-bar";
import PhotoList from "@/components/media/photo-list";
import Breadcrumbs from "@/components/tailwind-ui/breadcrumbs/simple-with-chevrons";
import { getPhotos } from "@/services/photo-action";

const INITIAL_NUMBER_OF_PHOTOS = 12

export default async function PhotoPage() {
  const initialPhotos = await getPhotos(0, INITIAL_NUMBER_OF_PHOTOS)

  return (
      <div className="flex w-full px-10 pb-16">
        <div className="flex-1 max-w-[1100px] mx-auto">
          <div className="mt-[50px] flex w-full justify-between">
            <BoardSearchBar/>
            <Breadcrumbs pages={['HOME', 'MEDIA', 'wiz 포토']} />
          </div>
          <PhotoList initialPhotos={initialPhotos}/>
        </div>
      </div>
  );
}