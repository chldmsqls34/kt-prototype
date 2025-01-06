'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    redirect('/error')
  }
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signUp(data)
  if (error) {
    redirect('/error')
  }
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

const nicknameSchema = z.object({
  nickname: z.string().min(2, "닉네임을 2글자 이상 입력하세요").max(15, "닉네임은 15자 이내여야 합니다."),
});

export async function updateNickname(formData: FormData) {
  const validateFields = nicknameSchema.safeParse({
    nickname: formData.get('nickname') as string,
  });

  if(!validateFields.success){
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: '입력값을 확인해주세요',
    }
  }
  const { nickname } = validateFields.data;
  
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
 
  const { error } = await supabase
    .from("profiles")
    .update({ nickname: nickname })
    .eq("id", userId);

    if (error) {
      redirect('/error')
    }

  redirect("/mypage");
}

