import { Box, Flex } from "@chakra-ui/react";
import Footer from "./Footer";
import Header from "./Header";

import PropTypes from "prop-types";

const RootLayout = ({ children }) => {
  return (
    <>
      <Flex h="full" w="full" flexDirection={"column"}>
        <Header />
        <Box h={"full"} w={"full"} overflowY={"auto"} scrollBehavior={"smooth"}>
          {children}
        </Box>
        <Footer />
      </Flex>
    </>
  );
};

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RootLayout;
