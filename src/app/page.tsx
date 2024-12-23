import SignoutButton from "@/components/common/signout-button";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  return (
    <>
      {user&& (
        <div className="text-[--blue-color-100]">
          <SignoutButton/>
        </div>
      )}
    </>
  )
}
