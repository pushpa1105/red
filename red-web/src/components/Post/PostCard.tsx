import {
  CardHeader,
  Flex,
  Avatar,
  Heading,
  IconButton,
  CardBody,
  CardFooter,
  Button,
  Box,
  Card,
  Text,
  Image,
} from "@chakra-ui/react";
import React from "react";
import { Post } from "../../generated/graphql";

const PostCard = ({ Post }: any) => {
  const {
    id,
    createdAt,
    creatorId = 1,
    creator,
    title = "No Title",
    text = "No text",
  } = Post;
  return (
    <>
      <Card maxW="md">
        <CardHeader>
          <Flex>
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Avatar
                name={creator.username}
                src="https://bit.ly/sage-adebayo"
              />

              <Box>
                <Heading size="sm">{creator.username}</Heading>
                <Text>{creator.email}</Text>
              </Box>
            </Flex>
            {/* <IconButton
              variant="ghost"
              colorScheme="gray"
              aria-label="See menu"
              icon={<BsThreeDotsVertical />}
            /> */}
          </Flex>
        </CardHeader>
        <CardBody>
          <Heading size="sm">{title}</Heading>
          <Text>{text}</Text>
        </CardBody>
        <Image
          objectFit="cover"
          src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="Chakra UI"
        />

        <CardFooter
          justify="space-between"
          flexWrap="wrap"
          sx={{
            "& > button": {
              minW: "136px",
            },
          }}
        >
          {/* <Button flex="1" variant="ghost" leftIcon={<BiLike />}>
            Like
          </Button>
          <Button flex="1" variant="ghost" leftIcon={<BiChat />}>
            Comment
          </Button>
          <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
            Share
          </Button> */}
        </CardFooter>
      </Card>
    </>
  );
};

export default PostCard;
