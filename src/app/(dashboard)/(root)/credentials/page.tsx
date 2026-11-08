import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  CredentialContainer,
  CredentialError,
  CredentialLoading,
  CredentialsList,
} from "@/feature/credential/components/credentials";
import { credentialParamsLoader } from "@/feature/credential/server/params-loader";
import { prefetchCredentials } from "@/feature/credential/server/prefetch";
import { requireAuth } from "@/lib/auth-guard";
import { HydrateClient } from "@/trpc/server";

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: Props) {
  await requireAuth();
  const params = await credentialParamsLoader(searchParams);
  prefetchCredentials(params);

  return (
    <CredentialContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<CredentialError />}>
          <Suspense fallback={<CredentialLoading />}>
            <CredentialsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </CredentialContainer>
  );
}
