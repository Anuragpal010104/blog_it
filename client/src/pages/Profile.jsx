import { Avatar, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogList from "../components/BlogList";
import Loading from "../components/Loading";
import { WithAuth } from "../components/PrivateRoute";
import RootLayout from "../components/RootLayout";
import { instance } from "../utils/API";

const Profile = () => {
  const { userId } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: response } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => {
      return instance.get(`/users/${userId}`);
    },
  });

  useLayoutEffect(() => {
    setIsLoading(true);
    let requestUrl = `/blogs/users/${userId}?page_no=${pageNo}&limit=2`;
    instance
      .get(requestUrl)
      .then(({ data }) => {
        console.log("Blog Received: ", data.content.length);
        setBlogs((prevData) => [...prevData, ...data.content]);
        setHasMore(data?.hasNext);
      })
      .catch((err) => {
        console.error(err);
      });
    setIsLoading(false);
  }, [pageNo, userId]);

  if (isLoading) return <Loading />;

  return (
    <RootLayout>
      <Container maxW={"container.xl"}>
        <Flex my={10} flexDir={{ base: "column-reverse", md: "row" }}>
          <Flex flex={3} flexDir={"column"}>
            {blogs.length > 0 && <Heading>Recent Blogs</Heading>}
            <BlogList
              blogs={blogs}
              hasMore={hasMore}
              pageNo={pageNo}
              setPageNo={setPageNo}
              isLoading={isLoading}
            />
          </Flex>
          <Flex flex={1} alignItems={"center"} flexDir={"column"} top={5}>
            <Avatar
              size={"2xl"}
              name={response?.data?.name}
              src={response?.data?.avatar}
              bg={"blue.600"}
              color={"white"}
            />
            <Text fontSize={"3xl"}>{response?.data?.name}</Text>
            <Text>
              Joined On:{" "}
              {dayjs(response?.data?.createdOn).format("DD-MMM-YYYY hh:mm A")}
            </Text>
          </Flex>
        </Flex>
      </Container>
    </RootLayout>
  );
};

const AuthProfile = WithAuth(Profile);
export default AuthProfile;
