import BookmarkList from "@/components/mypage/bookmark-list";
import NicknameForm from "@/components/mypage/nickname-form";
import { fetchBookmarkList } from "@/services/profile-service";

export default async function MyPage(){
  const bookmarks = await fetchBookmarkList();

  return (
    <div>
      <NicknameForm/>
      {bookmarks && <BookmarkList bookmarks={bookmarks}/>}
    </div>
  )
}