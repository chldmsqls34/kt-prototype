import { signout } from '@/services/auth-action'

export default function SignoutButton() {
  return (
    <form>
      <button formAction={signout}>로그아웃</button>
    </form>
  )
}