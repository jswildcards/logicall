import React from "react";
import { Avatar, Flex, Stack, Text } from "@chakra-ui/react";

export default function DisplayName({ user, secondColor = "gray.500" }) {
  const { firstName, lastName, username } = user;
  const fullname = `${firstName} ${lastName}`

  return (
    <Stack direction="row" align="center">
      <Avatar size="sm" name={fullname} />
      <Flex flexDirection="column" justify="center">
        <Text>{fullname}</Text>
        <Text fontSize="sm" color={secondColor}>
          @
          {username}
        </Text>
      </Flex>
    </Stack>
  );
}
