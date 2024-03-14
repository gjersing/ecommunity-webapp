import { useRouter } from "next/router";
import { useCurrentUserQuery } from "../graphql/generated/graphql";
import { useEffect } from "react";

export const useIsAuth = () => {
  const [{ data, fetching }] = useCurrentUserQuery();
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.current_user) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [fetching, data, router]);
};
