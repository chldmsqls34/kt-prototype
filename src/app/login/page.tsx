"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { login, signup } from "@/services/auth-action";
import { createClient } from "@/utils/supabase/client";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePassword = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword((prevState) => !prevState)
  };

  const signInWithKakao = async () => {
    const supabase = await createClient();
    const { error }=await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
      },
    })
    if (error) {
      console.error('Failed to sign in with Kakao', error)
    }

  }
  
  return (
    <form>
      <Card className="w-[500px] p-5">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>로그인을 위한 정보를 입력해주세요.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <label htmlFor="email">이메일</label>
            <input id="email" name="email" type="email" placeholder="이메일을 입력하세요."/>

          </div>
          <div className="relative grid gap-2">
            <div className="flex items-center">
              <label htmlFor="password">비밀번호</label>
            </div>
            <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="비밀번호를 입력하세요."/>
            <button className="absolute top-[38px] right-2 -translate-y-1/4 bg-transparent hover:bg-transparent" onClick={togglePassword}>
              {showPassword ? <EyeSlashIcon className="h-5 w-5 text-muted-foreground" /> : <EyeIcon className="h-5 w-5 text-muted-foreground" />}
            </button>
          </div>
        </CardContent>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
          </div>
        </div>
        <CardFooter className="flex mt-6 gap-4">
          <button 
            className="px-10 py-2 text-sm text-white bg-[#E79057] hover:bg-[#E26F24] hover:ring-1 hover:ring-[#E26F24] hover:ring-offset-1 active:bg-[#D5753D] hover:shadow-lg" 
            formAction={login}
          >
            로그인
          </button>
          <button 
            className="px-10 py-2 text-sm text-white bg-[#E79057] hover:bg-[#E26F24] hover:ring-1 hover:ring-[#E26F24] hover:ring-offset-1 active:bg-[#D5753D] hover:shadow-lg" 
            formAction={signup}
          >
            회원가입
          </button>
          <button 
            className="px-10 py-2 text-sm text-white bg-[#E79057] hover:bg-[#E26F24] hover:ring-1 hover:ring-[#E26F24] hover:ring-offset-1 active:bg-[#D5753D] hover:shadow-lg" 
            onClick={()=>signInWithKakao()}
          >
            카카오로그인
          </button>
        </CardFooter>
      </Card>
    </form>
  )
}