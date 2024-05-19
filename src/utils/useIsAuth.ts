import { useRouter } from "next/router";
import { useCurrentUserQuery } from "../graphql/generated/graphql";
import { useEffect } from "react";

export const useIsAuth = () => {
  const { data, loading } = useCurrentUserQuery();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !data?.current_user) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [loading, data, router]);
};
