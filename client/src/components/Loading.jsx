import { Flex, Spinner } from "@chakra-ui/react";
import RootLayout from "./RootLayout";

const Loading = () => {
  return (
    <RootLayout>
      <Flex h="full" w="full" justifyContent={"center"} alignItems={"center"}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Flex>
    </RootLayout>
  );
};

export default Loading;
