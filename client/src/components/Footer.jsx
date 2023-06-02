import { Flex, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <>
      <Flex
        as={"footer"}
        h="16"
        w="full"
        mt={"auto"}
        justifyContent={"center"}
        alignItems={"center"}
        borderTop={"1px solid"}
        borderTopColor={"gray.100"}
      >
        <Text fontSize={16} letterSpacing={1.2}>
          &copy; {new Date().getFullYear()} All right reserved.
        </Text>
      </Flex>
    </>
  );
};

export default Footer;
