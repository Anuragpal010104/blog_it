import { Flex, Heading } from "@chakra-ui/react";
import RootLayout from "../components/RootLayout";

const NotFound = () => {
  return (
    <RootLayout>
      <Flex h="full" w="full" justifyContent={"center"} alignItems={"center"}>
        <Heading>404 Page Not Found.</Heading>
      </Flex>
    </RootLayout>
  );
};

export default NotFound;
