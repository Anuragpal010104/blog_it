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
import { SIGNIN, SIGNUP } from "../utils/ROUTES";

const SignUp = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useBoolean(false);
  const { isLoggedIn, setLoggedIn } = useAuthStore();
  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  };
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (data) => {
      return instance.post(SIGNUP, data);
    },
    onSuccess: (data, variables) => {
      instance.post(SIGNIN, {
        email: variables?.email,
        password: variables?.password,
      });
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
        duration: 3000,
        description: error.response?.data,
        position: "top-right",
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
        <Box
          backgroundColor={"gray.50"}
          h={"full"}
          w={"full"}
          paddingTop={10}
          paddingBottom={10}
        >
          <Box
            backgroundColor={"gray.50"}
            as={"form"}
            onSubmit={handleSubmit}
            paddingBottom={10}
          >
            <Container
              maxW={"sm"}
              backgroundColor={"white"}
              px={10}
              py={10}
              rounded={"md"}
              boxShadow={"md"}
            >
              <Flex
                h={"full"}
                flexDirection={"column"}
                alignItems={"center"}
                rowGap={3}
              >
                <Text textAlign={"center"} fontSize={"xl"}>
                  Sign Up
                </Text>
                <FormControl isInvalid={Boolean(touched.name && errors.name)}>
                  <FormLabel htmlFor={"name"}>Name</FormLabel>
                  <Input
                    name={"name"}
                    id={"name"}
                    type={"text"}
                    size={"sm"}
                    placeholder={"Enter name"}
                    value={values.name}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors?.name}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={Boolean(touched.email && errors.email)}>
                  <FormLabel htmlFor={"email"}>Email</FormLabel>
                  <Input
                    name={"email"}
                    id={"email"}
                    type={"email"}
                    size={"sm"}
                    placeholder={"Enter email"}
                    value={values.email}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors?.email}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={Boolean(touched.password && errors.password)}
                >
                  <FormLabel htmlFor={"password"}>Password</FormLabel>
                  <InputGroup>
                    <Input
                      name={"password"}
                      id={"password"}
                      type={showPassword ? "text" : "password"}
                      size={"sm"}
                      placeholder={"Enter password"}
                      value={values.password}
                      onChange={handleChange}
                    />
                    <InputRightElement boxSize={"30px"}>
                      <IconButton
                        size={"sm"}
                        aria-label={"password"}
                        onClick={setShowPassword.toggle}
                      >
                        {showPassword ? <BiHide /> : <BiShow />}
                      </IconButton>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors?.password}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={Boolean(
                    touched.confirmpassword && errors.confirmpassword
                  )}
                >
                  <FormLabel htmlFor={"confirmpassword"}>
                    Confirm Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      name={"confirmpassword"}
                      id={"confirmpassword"}
                      type={showPassword ? "text" : "password"}
                      size={"sm"}
                      placeholder={"Enter confirm password"}
                      value={values.confirmpassword}
                      onChange={handleChange}
                    />
                    <InputRightElement boxSize={"30px"}>
                      <IconButton
                        size={"sm"}
                        aria-label={"confirmpassword"}
                        onClick={setShowPassword.toggle}
                      >
                        {showPassword ? <BiHide /> : <BiShow />}
                      </IconButton>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors?.confirmpassword}</FormErrorMessage>
                </FormControl>
                <Box w={"full"} mt={8}>
                  <Text fontSize={"xs"} mb={1}>
                    Already have an account?
                    <Box
                      as={Link}
                      fontSize={"inherit"}
                      to={"/sign-in"}
                      _hover={{ border: "none" }}
                    >
                      {" "}
                      Sign in here
                    </Box>
                  </Text>
                  <Button
                    size={"sm"}
                    width={"full"}
                    type={"submit"}
                    colorScheme={"blue"}
                    isLoading={isLoading}
                  >
                    Sign Up
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
export default SignUp;
