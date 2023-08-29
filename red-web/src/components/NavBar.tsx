import { Box, Flex, Link as CLink } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useMeQuery } from "../generated/graphql";
// import NextLink from "next/link";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  return (
    <Flex bg={"blue"} padding={5}>
      {fetching ? (
        <div>LOading...</div>
      ) : (
        <Box ml={"auto"}>
          {data?.me ? (
            <>{data?.me?.username}</>
          ) : (
            <>
              <CLink as={Link} mr={2} href={"/user/login"}>
                Login
              </CLink>
              <CLink as={Link} href={"/user/register"}>
                Register
              </CLink>
            </>
          )}
        </Box>
      )}
    </Flex>
  );
};
