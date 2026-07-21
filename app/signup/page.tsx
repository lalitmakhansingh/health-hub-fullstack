import { SignUpForm } from "@/components/sign-up-form"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">HealthHub</h2>
          <p className="text-muted-foreground">Create Your Patient Account</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
