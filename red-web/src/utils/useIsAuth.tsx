import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";

export const useIsAuth = (redirectTo: string = "/") => {
  const [{ fetching, data }] = useMeQuery();
  const route = useRouter();

  useEffect(() => {
    if (!fetching && !data?.me) {
      route.replace("/user/login?next=" + redirectTo);
    }
  }, [fetching, data, route]);
};
