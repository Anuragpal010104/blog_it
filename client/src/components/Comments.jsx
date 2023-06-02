import {
  Button,
  Flex,
  Text,
  Textarea,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useLayoutEffect, useState } from "react";
import { instance } from "../utils/API";
import { COMMENTS } from "../utils/ROUTES";
import CommentCard from "./CommentCard";

const Comments = ({ blogId }) => {
  const toast = useToast();
  const [loading, setLoading] = useBoolean(false);
  const [comments, setComments] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  useLayoutEffect(() => {
    fetchComments();
  }, [blogId, pageNo, setLoading]);

  const fetchComments = async () => {
    setLoading.on;
    instance
      .get(`${COMMENTS}/${blogId}?page_no=${pageNo}&limit=5`)
      .then(({ data }) => {
        console.log("Comments Received: ", data.content.length);
        setComments((prevData) => [...prevData, ...data.content]);
        setHasMore(data?.hasNext);
      })
      .catch((err) => {
        console.error(err);
      });
    setLoading.off;
  };
  const [message, setMessage] = useState("");

  const handleDelete = async (id) => {
    try {
      const response = await instance.delete(`${COMMENTS}/${id}`);
      toast({
        status: "success",
        description: response?.data,
        duration: 2000,
        autoClose: true,
        position: "top-right",
      });
      setPageNo(0);
      setHasMore(false);
      setComments([]);
      setMessage("");
      fetchComments();
      console.log(response);
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        description: error?.response?.data?.message || "Something went wrong.",
        duration: 2000,
        autoClose: true,
        position: "top-right",
      });
    }
  };

  const handleAdd = async ({ comment }) => {
    if (!comment) {
      toast({
        status: "error",
        description: "Please write something...",
        duration: 2000,
        autoClose: true,
        position: "top-right",
      });
      return;
    }
    try {
      const response = await instance.post(`${COMMENTS}/`, {
        blogId,
        comment,
      });
      toast({
        status: "success",
        description: response?.data,
        duration: 2000,
        autoClose: true,
        position: "top-right",
      });
      setPageNo(0);
      setHasMore(false);
      setComments([]);
      fetchComments();
      setMessage("");
      console.log(response);
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        description: error?.response?.data?.message || "Something went wrong.",
        duration: 2000,
        autoClose: true,
        position: "top-right",
      });
    }
  };
  return (
    <Flex flexDir={"column"} mb={10}>
      <Flex flexDir={"column"} my={2}>
        <Textarea
          placeholder="Write something..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <Button
          w="fit-content"
          size="sm"
          colorScheme="blue"
          mt={5}
          disabled={Boolean(message.length === 0)}
          ml="auto"
          onClick={() => handleAdd({ comment: message })}
        >
          Add comment
        </Button>
      </Flex>
      {!comments || comments.length === 0 ? (
        <Text
          textAlign={"center"}
          my={2}
          fontSize={"xl"}
          fontWeight={"semibold"}
        >
          No comments yet.
        </Text>
      ) : (
        <>
          <Text
            textAlign={"center"}
            my={2}
            fontSize={"xl"}
            fontWeight={"semibold"}
          >
            Comments
          </Text>
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              handleDelete={handleDelete}
              {...comment}
            />
          ))}
          {hasMore && (
            <Button
              onClick={() => {
                if (hasMore) setPageNo(pageNo + 1);
              }}
              isLoading={loading}
              disabled={!hasMore}
              w="fit-content"
              colorScheme="blue"
              mx="auto"
              display={"flex"}
              loadingText="Loading Comments..."
              mt={5}
              size={"sm"}
            >
              Load More Comments
            </Button>
          )}
        </>
      )}
    </Flex>
  );
};

Comments.propTypes = {
  blogId: PropTypes.number.isRequired,
};

export default Comments;
