import {
  Box,
  Flex,
  Link as CLink,
  Button,
  Tag,
  Avatar,
  TagLabel,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { error } from "console";
// import NextLink from "next/link";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: LogoutFetching }, logout] = useLogoutMutation();
  const router = useRouter();

  const logoutAction = async () => {
    const res = await logout();
    if (res.error) {
      console.log("LKOgout Failed", res.error);
    } else if (res?.data?.logout) router.push("/user/login");
  };
  return (
    <Flex bg={"blue"} padding={5}>
      {fetching ? (
        <div>LOading...</div>
      ) : (
        <Box ml={"auto"}>
          {data?.me ? (
            <>
              <Flex my={"auto"}>
                <Box>
                  <Tag size="lg" colorScheme="red" borderRadius="full">
                    <Avatar
                      src="https://bit.ly/sage-adebayo"
                      size="xs"
                      name="Segun Adebayo"
                      ml={-1}
                      mr={2}
                    />
                    <TagLabel>{data?.me?.username}</TagLabel>
                  </Tag>
                </Box>
                <Box>
                  <Button
                    colorScheme="facebook"
                    onClick={logoutAction}
                    isLoading={LogoutFetching}
                  >
                    LogOut
                  </Button>
                </Box>
              </Flex>
            </>
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
