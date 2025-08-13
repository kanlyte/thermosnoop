import { auth } from "@/auth"
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm"

const VerifyOtpPage = async () =>  {
  const session = await auth();
  
  return (
    <VerifyOtpForm user_id={session?.user.id} />
  )
}

export default VerifyOtpPage