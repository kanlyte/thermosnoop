
import { Button } from '@/components/ui/button'
// import { socialBTN } from '@/actions/OAuth'
import { Icons } from "@/components/icons"


export const SocialProviders = () => {
  return (
    <div className="mt-8 space-y-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t " />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card">Or continue with</span>
        </div>
      </div>


      <div className="grid gap-2">
        <Button variant="outline" className="w-full" type="button"  onClick={() => {} }>
          <Icons.google className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
        {/* <Button variant="outline" className="w-full" type="button" onClick={() => socialBTN('github')}>
          <Icons.githubs className="mr-2 h-4 w-4" />
          Continue with Github Account
        </Button> */}
      
      </div>
    </div>
  )
}