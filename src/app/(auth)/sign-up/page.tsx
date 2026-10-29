import SignUpForm from "@/feature/auth/components/signup-form";
import { unRequireAuth } from "@/lib/auth-guard";

export default async function Page() {
  await unRequireAuth();

  return <SignUpForm />;
}
