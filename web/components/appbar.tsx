import React from "react";
import {
  Box,
  Heading,
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
} from "@chakra-ui/react";
import { useMutation } from "react-apollo";
import { useRouter } from "next/router";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { MdMenu } from "react-icons/md"
import schema from "../utils/schema";

const MenuItems = ({ children }) => (
  <Text mt={{ base: 4, md: 0 }} mr={6} display="block">
    {children}
  </Text>
);

// Note: This code could be better, so I'd recommend you to understand how I solved and you could write yours better :)
function AppBar({ user }) {
  const router = useRouter();
  const [show, setShow] = React.useState(false);
  const [signOut] = useMutation(schema.mutation.signOut);
  const handleToggle = () => setShow(!show);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="blue.500"
      color="white"
    >
      <Flex align="center" direction="column" mr={5}>
        <Heading as="h1" size="lg">
          LogiCall
        </Heading>
        <Heading as="h5" size="xs">
          admin
        </Heading>
      </Flex>

      <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
        <Icon as={MdMenu} />
      </Box>

      <Box
        display={{ sm: show ? "block" : "none", md: "flex" }}
        width={{ sm: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
      >
        <MenuItems><Button variant="link" color="white">Orders</Button></MenuItems>
        <MenuItems><Button variant="link" color="white">Drivers</Button></MenuItems>
      </Box>

      <Box display={{ sm: show ? "block" : "none", md: "flex" }}>
        <Menu>
          <MenuButton
            as={Button}
            colorScheme="blue"
            rightIcon={<ChevronDownIcon />}
          >
            {user?.me?.username}
          </MenuButton>
          <MenuList>
            <MenuItem
              color="red.500"
              onClick={() => {
                signOut();
                router.replace("sign-in");
              }}
            >
              Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
}

export default AppBar;
