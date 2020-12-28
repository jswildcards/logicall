import React from "react";
import { Box, SimpleGrid, Image, Flex } from "@chakra-ui/react";
import SignInForm from "../components/sign-in-form";

// const useStyles = makeStyles({
//   root: {
//     height: "100vh",
//     background: "#7e89fd",
//   },
//   image: {
//     maxWidth: "100%",
//     maxHeight: "100%",
//   },
//   front: {
//     background: "white",
//   },
//   signInRoot: {
//     padding: "2rem",
//   }
// })

export default function SignIn() {
  // const router = useRouter();
  // useEffect(() => {
  //   if (user && Object.keys(user).length) {
  //     router.push("/");
  //   }
  // })
  // const styles = useStyles();

  return (
    <SimpleGrid h="100%" columns={2}>
      <Box>
        <Image src="/logicall-banner.png" alt="" />
      </Box>
      <Box p="3">
        <Flex>
          <Image width="30%" src="/box.svg" alt="" />
        </Flex>
        <SignInForm />
      </Box>
    </SimpleGrid>
  );
}
