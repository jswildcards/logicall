import { MdArrowForward } from "react-icons/md";
import {
  Box,
  Heading,
  Grid,
  GridItem,
  Flex,
  Divider,
  Button,
  Text,
  Icon
} from "@chakra-ui/react";
import React from "react";

export function OrderCard(props) {
  const { order, onApprove, onReject } = props;

  return (
    <Box
      border="1px"
      borderColor="gray.300"
      borderRadius="md"
      p="3"
      width="100%"
    >
      <Heading color="gray.500" size="sm" pb="1">
        {order.orderId}
      </Heading>
      <Heading
        color={order.status === "Rejected" ? "red.500" : "green.500"}
        size="sm"
        pb="1"
      >
        {order.status}
      </Heading>
      <Grid templateColumns="repeat(5, 1fr)" py="3">
        <GridItem colSpan={2}>
          <Text>{order.senderAddress.address}</Text>
          <Text color="gray.500">
            @
            {order.sender.username}
          </Text>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex h="100%" justify="center" align="center">
            <Icon as={MdArrowForward} />
          </Flex>
        </GridItem>
        <GridItem colSpan={2} textAlign="right">
          <Text>{order.receiverAddress.address}</Text>
          <Text color="gray.500">
            @
            {order.receiver.username}
          </Text>
        </GridItem>
      </Grid>
      <Divider />
      <Flex justify="right" pt="3">
        <Button variant="ghost" colorScheme="red" mr="3" onClick={onReject}>
          Reject
        </Button>
        <Button colorScheme="green" onClick={onApprove}>
          Approve
        </Button>
      </Flex>
    </Box>
  );
}

export default OrderCard;
