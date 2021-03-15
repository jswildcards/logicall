import React from "react";
import { Avatar, Flex, Link, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function DisplayName({
  user,
  secondColor = "gray.500",
  useLink = false,
}) {
  const { firstName, lastName, username, role, userId } = user;
  const fullname = `${firstName} ${lastName}`;
  const router = useRouter();

  return (
    <Stack
      direction="row"
      align="center"
      style={useLink ? { cursor: "pointer" } : {}}
      onClick={() => (useLink ? router.push(`/${role}/${userId}`) : null)}
    >
      <Avatar size="sm" name={fullname} />
      <Flex
        flexDirection="column"
        justify="center"
        color={useLink ? "teal.500" : "inherit"}
        _hover={useLink ? { textDecoration: "underline" } : {}}
      >
        {fullname}
        <Text
          style={{ margin: 0 }}
          fontSize="sm"
          color={secondColor}
        >
          @{username}
        </Text>
      </Flex>
    </Stack>
  );
}
