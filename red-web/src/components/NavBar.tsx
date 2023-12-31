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
import { isServer } from "../utils/isServer";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
// import NextLink from "next/link";

interface NavBarProps { }

export const NavBar: React.FC<NavBarProps> = ({ }) => {
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  // console.log("-----daata--------", data);
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
      <Box ml={"auto"}>
        {data?.me ? (
          <>
            <Flex my={"auto"}>
              <Box my={"auto"}>
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
              <Box my={"auto"} ml={4}>
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
    </Flex>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(NavBar);
