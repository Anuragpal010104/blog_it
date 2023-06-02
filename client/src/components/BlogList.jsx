import { Button, Flex, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import BlogCard from "./BlogCard";

const BlogList = ({ blogs, hasMore, pageNo, setPageNo, isLoading }) => {
  return (
    <>
      <Flex rowGap={8} columnGap={10} flexWrap={"wrap"} my={5}>
        {blogs?.length === 0 ? (
          <Flex w="full" justifyContent={"center"} alignItems={"center"}>
            <Text fontWeight={"semibold"} fontSize={"2xl"}>
              No blogs found
            </Text>
          </Flex>
        ) : (
          blogs?.map((blog) => <BlogCard key={blog.id} blog={blog} />)
        )}
      </Flex>
      {hasMore && (
        <Button
          onClick={() => {
            if (hasMore) setPageNo(pageNo + 1);
          }}
          isLoading={isLoading}
          disabled={!hasMore}
          w="fit-content"
          colorScheme="blue"
          mx="auto"
          display={"flex"}
          loadingText="Loading Blogs..."
        >
          Load More Blogs
        </Button>
      )}
    </>
  );
};

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  pageNo: PropTypes.number.isRequired,
  setPageNo: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default BlogList;
