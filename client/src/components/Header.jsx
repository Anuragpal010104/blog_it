import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Image,
  List,
  ListItem,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { BiMenu } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/vs-logo.png";
import useAuthStore from "../store/useAuthStore";
import useCategoryStore from "../store/useCategoryStore";
import { instance } from "../utils/API";
import { SIGNOUT } from "../utils/ROUTES";
const Header = () => {
  const { signOut } = useAuthStore();
  const { reset } = useCategoryStore();

  const toast = useToast();
  const { mutate } = useMutation({
    mutationKey: ["sign-out"],
    mutationFn: () => {
      return instance.post(SIGNOUT);
    },
    onSuccess: ({ data }) => {
      signOut();
      reset();
      toast({
        status: "success",
        description: data,
        duration: 2000,
        autoClose: true,
        position: "top-right",
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        status: "error",
        description: "Something went wrong. Please close the browser.",
        duration: 3000,
        autoClose: true,
        position: "top-right",
        isClosable: true,
      });
    },
  });
  const { isLoggedIn, user } = useAuthStore();
  const [open, setOpen] = useBoolean();
  const { pathname } = useLocation();

  return (
    <>
      <Box
        as={"header"}
        borderBottom={"1px solid"}
        borderBottomColor={"gray.100"}
      >
        <Flex mx={{ base: 5, md: 20 }} h="16" alignItems={"center"}>
          <Flex
            width={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box as={Link} to={"/"}>
              <Image src={Logo} width={50} alt="logo" />
            </Box>
            <Icon
              as={BiMenu}
              display={{ base: "flex", md: "none" }}
              onClick={setOpen.on}
            />
            <MobileHeader
              isOpen={open}
              setOpen={setOpen}
              handleSignOut={() => {
                setOpen.off;
                mutate();
              }}
              pathname={pathname}
            />
            <Flex
              display={{ base: "none", md: "flex" }}
              alignItems={"center"}
              gap={5}
            >
              {isLoggedIn ? (
                <>
                  <Link to={`/profile/${user?.id}`}>Profile</Link>
                  <Link to={"/add-blog"}>Write blog</Link>
                  <Link to={"/"} onClick={() => mutate()}>
                    Sign out
                  </Link>
                </>
              ) : (
                <Link to={pathname === "/sign-up" ? "/sign-in" : "/sign-up"}>
                  {pathname === "/sign-up" ? "Sign In" : "Sign Up"}
                </Link>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

const MobileHeader = ({ isOpen, setOpen, handleSignOut, pathname }) => {
  const { isLoggedIn, user } = useAuthStore();
  return (
    <>
      <Drawer isOpen={isOpen} onClose={setOpen.off} placement="right">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton onClick={setOpen.off} />
          <DrawerHeader>
            <Box as={Link} to={"/"}>
              <Image src={Logo} width={50} alt="logo" />
            </Box>
          </DrawerHeader>
          <DrawerBody>
            <List>
              {isLoggedIn ? (
                <>
                  <ListItem>
                    <Link to={`/profile/${user?.id}`} onClick={setOpen.off}>
                      Profile
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link to={"/add-blog"} onClick={setOpen.off}>
                      Write Blog
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link to={"/"} onClick={handleSignOut}>
                      Sign out
                    </Link>
                  </ListItem>
                </>
              ) : (
                <ListItem>
                  <Link to={pathname === "/sign-up" ? "/sign-in" : "/sign-up"}>
                    {pathname === "/sign-up" ? "Sign In" : "Sign Up"}
                  </Link>
                </ListItem>
              )}
            </List>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

MobileHeader.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setOpen: PropTypes.object.isRequired,
  handleSignOut: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
};

export default Header;
