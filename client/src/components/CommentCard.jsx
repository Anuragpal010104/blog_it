import { DeleteIcon } from "@chakra-ui/icons";
import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import PropTypes from "prop-types";
const CommentCard = ({ id, comment, user, createdOn, handleDelete }) => {
  return (
    <>
      <Flex flexDir={"column"} my={2}>
        <Flex alignItems={"center"}>
          <Avatar name={user} size={"sm"} />
          <Flex
            flexDir={"column"}
            ml={3}
            fontSize={"smaller"}
            color={"gray.500"}
            flexGrow={1}
          >
            <Text>{user}</Text>
            <Text>on {dayjs(createdOn).format("DD-MMM-YYYY hh:mm A")}</Text>
          </Flex>
          <DeleteIcon onClick={() => handleDelete(id)} />
        </Flex>
        <Text my={2} fontSize={"sm"}>
          {comment}
        </Text>
      </Flex>
      <Divider />
    </>
  );
};

CommentCard.propTypes = {
  id: PropTypes.number.isRequired,
  comment: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  createdOn: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default CommentCard;
