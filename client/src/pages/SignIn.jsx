import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useEffect } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import RootLayout from "../components/RootLayout";
import useAuthStore from "../store/useAuthStore";
import { instance } from "../utils/API";
import { SIGNIN } from "../utils/ROUTES";

const SignIn = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useBoolean(false);
  const { isLoggedIn, setLoggedIn } = useAuthStore();
  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);
  const initialValues = {
    username: "",
    password: "",
  };

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (data) => {
      const response = instance.post(SIGNIN, data);
      return response;
    },
    onSuccess: (data) => {
      toast({
        status: "success",
        duration: 2000,
        position: "top-right",
        description: data?.data,
        autoClose: true,
      });
      setLoggedIn(true);
      navigate("/");
    },
    onError: (error) => {
      toast({
        status: "error",
        duration: 2000,
        position: "top-right",
        description: error?.response?.data,
        autoClose: true,
      });
    },
  });
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });

  const { values, errors, touched, handleSubmit, handleChange } = formik;
  return (
    <>
       <RootLayout>
      <Box backgroundColor={"gray.100"} h={"full"} w={"full"} paddingTop={10}>
          <Box
            as={"form"}
            backgroundColor={"gray.100"}
            pb={10}
            onSubmit={handleSubmit}
          >
            <Container
              mt={100}
              maxW={"lg"}
              h={"400px"}
              backgroundColor={"white"}
              px={10}
              py={10}
              rounded={"md"}
              boxShadow={"sm"}
              _hover={{
                boxShadow: "0 0 8px rgba(0, 0, 0, 0.8)",
              }}
            >
              <Flex
                h={"full"}
                flexDirection={"column"}
                alignItems={"center"}
                rowGap={3}
              >
                <Text textAlign={"center"} fontSize={"2xl"}>
                  Sign In
                </Text>
                <FormControl
                  isInvalid={Boolean(touched.username && errors.username)}
                >
                  <FormLabel htmlFor={"username"} fontSize={"18px"}>Username/Email</FormLabel>
                  <Input
                    name={"username"}
                    id={"username"}
                    type={"text"}
                    size={"md"}
                    placeholder={"Enter email"}
                    value={values.username}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors?.username}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={Boolean(touched.password && errors.password)}
                >
                  <FormLabel htmlFor={"password"} fontSize={"18px"}>Password</FormLabel>
                  <InputGroup>
                    <Input
                      name={"password"}
                      id={"password"}
                      type={showPassword ? "text" : "password"}
                      size={"md"}
                      placeholder={"Enter password"}
                      value={values.password}
                      onChange={handleChange}
                    />
                    <InputRightElement boxSize={"30px"}>
                      <IconButton
                        size={"md"}
                        aria-label={"password"}
                        onClick={setShowPassword.toggle}
                      >
                        {showPassword ? <BiHide /> : <BiShow />}
                      </IconButton>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors?.password}</FormErrorMessage>
                </FormControl>
                <Box w={"full"} mt={4}>
                  <Text fontSize={"15px"} mb={4}>
                    Don&apos;t have an account?
                    <Box
                      as={Link}
                      fontSize={"15px"}
                      to={"/sign-up"}
                      _hover={{ border: "none" }}
                    >
                      {" "}
                      Sign up here
                    </Box>
                  </Text>
                  <Button      
                    size={"sm"}
                    width={"full"}
                    type={"submit"}
                    colorScheme={"green"}
                    isLoading={isLoading}
                    fontSize={"20px"}
                    height={"45px"}
                  >
                    Sign In
                  </Button>
                </Box>
              </Flex>
            </Container>
          </Box>
        </Box>
      </RootLayout>
    </>
  );
};

export default SignIn;
