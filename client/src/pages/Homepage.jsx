import { Box, Container, Divider, List, ListItem } from "@chakra-ui/react";
import { useLayoutEffect, useState } from "react";
import BannerImage from "../assets/aaron-burden.jpg";
import BlogList from "../components/BlogList";
import { WithAuth } from "../components/PrivateRoute";
import RootLayout from "../components/RootLayout";
import useCategoryStore from "../store/useCategoryStore";
import { instance } from "../utils/API";
import { BLOGS } from "../utils/ROUTES";

const Homepage = () => {
  const { categories, setSelectedCategory, selectedCategory } =
    useCategoryStore();
  const [pageNo, setPageNo] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    setPageNo(0);
    setBlogs([]);
  }, [selectedCategory]);

  useLayoutEffect(() => {
    setIsLoading(true);
    let requestUrl = `${BLOGS}?page_no=${pageNo}&limit=3`;
    if (selectedCategory?.name != "all")
      requestUrl += `&category=${selectedCategory?.id}`;
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
  }, [pageNo, selectedCategory]);

  return (
    <>
      <RootLayout>
        <Box
          backgroundImage={BannerImage}
          height={300}
          width={"full"}
          w="full"
          bgRepeat="no-repeat"
          bgPosition={"center"}
          bgSize={"cover"}
          mb={5}
        />
        <Container maxW={"container.xl"} w="full" mb={10}>
          <List
            mx={10}
            whiteSpace={"nowrap"}
            overflowX={"auto"}
            h="12"
            scrollBehavior={"smooth"}
            className="category-list"
          >
            <ListItem
              display={"inline-block"}
              borderBottom={"2px solid transparent"}
              marginX={3}
              cursor={"pointer"}
              borderBottomColor={`${
                "all" === selectedCategory?.name.toLowerCase()
                  ? "teal"
                  : "transparent"
              } `}
              onClick={() => {
                setSelectedCategory({ name: "all" });
              }}
            >
              All
            </ListItem>
            {categories &&
              categories.length > 0 &&
              categories.map((item, index) => (
                <ListItem
                  key={index}
                  display={"inline-block"}
                  borderBottom="2px solid transparent"
                  marginX={3}
                  cursor={"pointer"}
                  borderBottomColor={`${
                    item?.name.toLowerCase() ===
                    selectedCategory?.name.toLowerCase()
                      ? "teal"
                      : "transparent"
                  } `}
                  onClick={() => setSelectedCategory(item)}
                >
                  {item.name}
                </ListItem>
              ))}
          </List>
          <Divider />
          <BlogList
            blogs={blogs}
            pageNo={pageNo}
            setPageNo={setPageNo}
            hasMore={hasMore}
            isLoading={isLoading}
          />
        </Container>
      </RootLayout>
    </>
  );
};

const AuthenticatedHomepage = WithAuth(Homepage);
export default AuthenticatedHomepage;
