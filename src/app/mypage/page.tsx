import { updateNickname } from "@/services/auth-action";

export default function MyPage(){

  return (
    <form className="p-10">
      <label htmlFor="text" className="px-4">닉네임</label>
      <input 
        id="nickname"
        className="p-2 border border-gray-300 rounded-md"
        name="nickname" 
        type="text" 
        required />
      <button 
        className="px-4 py-2 text-sm"
        formAction={updateNickname}
      >
        닉네임 변경
      </button>
    </form>
  )
}