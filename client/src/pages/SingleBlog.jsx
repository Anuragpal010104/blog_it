import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import parse from "html-react-parser";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Comments from "../components/Comments";
import Loading from "../components/Loading";
import { WithAuth } from "../components/PrivateRoute";
import RootLayout from "../components/RootLayout";
import { instance } from "../utils/API";
const SingleBlog = () => {
  const { id: slug } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();
  const { isLoading, isFetching } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => {
      return instance.get(`/blogs/${slug}`);
    },
    onSuccess: ({ data }) => {
      console.log("Blog: ", data);
      setBlog(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  if (isLoading || isFetching || blog === null) return <Loading />;

  return (
    <>
      <RootLayout>
        <Container maxW={"container.xl"}>
          <Button
            colorScheme="blue"
            size={"sm"}
            mt={5}
            onClick={() => navigate("/")}
          >
            Back to home
          </Button>
        </Container>
        <Container maxW={"container.md"} mt={10}>
          <Flex flexDir={"column"} rowGap={3}>
            {blog?.thumbnail && (
              <Image
                src={new CloudinaryImage(blog?.thumbnail, {
                  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                }).toURL()}
                alt={blog?.title}
                height={300}
                width={"full"}
                objectFit={"cover"}
              />
            )}

            <Heading as={"h3"} fontSize={"3xl"}>
              {blog?.title}
            </Heading>
            <Badge
              colorScheme="blue"
              w="fit-content"
              variant={"subtle"}
              borderRadius={"md"}
            >
              {blog?.category?.name}
            </Badge>
            <Flex columnGap={4} alignItems={"center"}>
              <Avatar size={"sm"} name={blog?.user?.name} />
              <Flex flexDir={"column"} color={"gray.500"}>
                <Text
                  as={Link}
                  fontSize={"sm"}
                  to={`/profile/${blog?.user?.id}`}
                >
                  {blog?.user?.name}
                </Text>
                <Text fontSize={"small"}>
                  on {dayjs(blog?.createdOn).format("DD-MMM-YYYY hh:mm A")}
                </Text>
              </Flex>
            </Flex>
            <Box className="blog-content" my={5}>
              {parse(blog.content, {
                trim: true,
              })}
            </Box>
          </Flex>
          <Divider />
          <Comments blogId={blog?.id} />
        </Container>
      </RootLayout>
    </>
  );
};

const AuthSingleBlog = WithAuth(SingleBlog);
export default AuthSingleBlog;
