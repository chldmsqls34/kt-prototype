import NoPhotoList from "@/components/media/no-photo-list";
import PhotoList from "@/components/media/photo-list";
import PhotoSearchBar from "@/components/media/photo-search-bar";
import Breadcrumbs from "@/components/tailwind-ui/breadcrumbs/simple-with-chevrons";
import { getPhotos } from "@/services/photo-action";

const INITIAL_NUMBER_OF_PHOTOS = 12

export default async function PhotoPage({
  params,searchParams,
}:{
  params: {
    photoCat: number;
  };
  searchParams: {
    query?: string;
    type?: 'title' | 'content';
    startDate?: string;
    endDate?: string;
  };
}) {
  const { photoCat } = params;
  const query = searchParams?.query || '';
  const startDate = searchParams?.startDate || '';
  const endDate = searchParams?.endDate || '';
  const initialPhotos = await getPhotos(photoCat, 0, INITIAL_NUMBER_OF_PHOTOS, query, startDate, endDate);

  return (
      <div className="flex w-full px-10 pb-16">
        <div className="flex-1 max-w-[1100px] mx-auto">
          <div className="mt-[50px] flex w-full justify-between">
            <PhotoSearchBar/>
            <Breadcrumbs pages={['HOME', 'MEDIA', 'wiz 포토']} />
          </div>
          {initialPhotos.length > 0 ? (<PhotoList initialPhotos={initialPhotos} category={photoCat} query={query} startDate={startDate} endDate={endDate}/>):(<NoPhotoList/>)}
        </div>
      </div>
  );
}