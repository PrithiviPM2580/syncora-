import SignInForm from "@/feature/auth/components/signin-form";
import { unRequireAuth } from "@/lib/auth-guard";

export default async function Page() {
  await unRequireAuth();

  return <SignInForm />;
}
