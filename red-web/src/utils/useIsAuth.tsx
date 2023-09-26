import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";

export const useIsAuth = () => {
  const [{ fetching, data }] = useMeQuery();
  const route = useRouter();

  useEffect(() => {
    if (!fetching && !data?.me) {
      route.replace("/user/login");
    }
  }, [fetching, data, route]);
};
