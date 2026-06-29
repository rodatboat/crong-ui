import { VerifyEmailForm } from "@/components/forms/verify-email-form"
import { Suspense } from "react"
import { Toaster } from "sonner"

export default function Page() {
  return (
    <Suspense>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <Toaster
          position="bottom-center"
          richColors
          duration={5000}
          toastOptions={{
            className: "!py-3 !px-4 md:!w-[400px]",
            classNames: {
              success: "!bg-accent !text-accent-foreground !border-accent-foreground/20",
              // info: "!bg-accent !text-accent-foreground !border-accent-foreground/20",
            }
          }}
        />
        <div className="w-full max-w-md">
          <VerifyEmailForm />
        </div>
      </div>
    </Suspense>
  )
}
