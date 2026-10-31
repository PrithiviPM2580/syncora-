import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data } = await authClient.customer.state();
      return data;
    },
  });
};

export const useHasActiveSubscription = () => {
  const { data: customState, isLoading, ...rest } = useSubscription();

  const hasActiveSubscription =
    customState?.active_subscriptions &&
    customState?.active_subscriptions.length > 0;

  return {
    hasActiveSubscription,
    subscription: customState?.active_subscriptions?.[0],
    isLoading,
    ...rest,
  };
};
