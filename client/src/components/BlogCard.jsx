import { Badge, Card, CardBody, HStack, Image, Text } from "@chakra-ui/react";
import { CloudinaryImage } from "@cloudinary/url-gen";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const { title, slug, thumbnail, user, createdOn } = blog;
  const navigate = useNavigate();
  return (
    <>
      <Card w={"sm"} h="fit-content">
        <CardBody>
          {thumbnail && (
            <Image
              src={new CloudinaryImage(thumbnail, {
                cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
              }).toURL()}
              height={200}
              width={"full"}
              objectFit={"cover"}
              alt={title}
              mb={2}
            />
          )}

          <Text
            lineHeight={1.2}
            fontSize={"large"}
            my={2}
            cursor={"pointer"}
            onClick={() => navigate(`/blog/${slug}`)}
          >
            {title}
          </Text>
          <Badge
            colorScheme="red"
            width={"fit-content"}
            variant={"outline"}
            borderRadius={"md"}
          >
            {blog.category?.name}
          </Badge>
          <HStack fontSize={"smaller"} color={"gray.500"}>
            <Text>
              by{" "}
              <Text
                as={Link}
                _hover={{ border: "none" }}
                to={`/profile/${blog?.user?.id}`}
              >
                {user?.name}
              </Text>
            </Text>
            <Text>on {dayjs(createdOn).format("DD-MMM-YYYY hh:mm A")}</Text>
          </HStack>
        </CardBody>
      </Card>
    </>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.object.isRequired,
};

export default BlogCard;
