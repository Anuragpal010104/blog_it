import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Helmet } from "react-helmet";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import * as Yup from "yup";
import { WithAuth } from "../components/PrivateRoute";
import RootLayout from "../components/RootLayout";
import useCategoryStore from "../store/useCategoryStore";
import { instance } from "../utils/API";
import { ADDBLOG, MYBLOGS } from "../utils/ROUTES";
import Loading from "../components/Loading";
import dayjs from "dayjs";
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, false] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ font: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "font",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const AddBlog = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      title: "",
      thumbnail: "",
      content: {
        html: "",
        raw: "",
      },
      category: "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      content: Yup.object().shape({
        html: Yup.string().required("Content is required"),
      }),
      category: Yup.object().required("Category is required"),
    }),
    onSubmit: (value) => postBlog(value),
  });
  const { values, touched, errors, handleChange, handleSubmit, setFieldValue } =
    formik;
  const { categories } = useCategoryStore();
  const showUploadWidget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_UPLOAD_PRESET,
        sources: ["local", "url", "camera", "unsplash"],
        secure: true,
        folder: "Blog Application",
        showAdvancedOptions: false,
        cropping: true,
        multiple: false,
        defaultSource: "local",
        resourceType: "image",
        maxFiles: 1,
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1",
          },
          fonts: {
            default: null,
            "'Poppins', sans-serif": {
              url: "https://fonts.googleapis.com/css?family=Poppins",
              active: true,
            },
          },
        },
      },
      (err, result) => {
        if (result.event === "success") {
          formik.setFieldValue("thumbnail", result.info.public_id);
          return;
        }
        if (err) {
          toast({
            status: "error",
            description: "Error while uploading image",
            duration: 2000,
            autoClose: true,
            position: "top-right",
          });
          console.error("Upload Widget error - ", err);
        }
      }
    );
  };

  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ["add-blog"],
    mutationFn: (data) => {
      return instance.post(ADDBLOG, data);
    },
    onSuccess: (response) => {
      console.log("Blog added successfully");
      const blogSlug = response.data;
      toast({
        status: "success",
        description: "Blog added successfully",
        duration: 3000,
        autoClose: true,
        position: "top-right",
      });
      navigate(`/blog/${blogSlug}`);
    },
    onError: (error) => {
      console.log("Error while adding blog");
      toast({
        status: "error",
        description: error?.response?.data || "Something went wrong",
        duration: 3000,
        autoClose: true,
        position: "top-right",
      });
    },
  });

  const {
    isLoading: loading,
    isFetching: fetching,
    data: recentBlogs,
  } = useQuery({
    queryKey: ["user-recent-blogs"],
    queryFn: () => {
      return instance.get(`${MYBLOGS}?limit=5&page_no=0`);
    },
  });

  const postBlog = async (values) => {
    const { title, thumbnail, content, category } = values;
    const data = {
      title,
      thumbnail,
      content: content.html,
      category: category?.value,
    };
    await mutateAsync(data);
  };

  return (
    <>
      <RootLayout>
        <Helmet>
          <script
            src={"https://widget.cloudinary.com/v2.0/global/all.js"}
            type="text/javascript"
          />
        </Helmet>
        <Container maxW={"container.xl"}>
          <Box as={"form"} mt={10} onSubmit={handleSubmit}>
            <Flex h={"full"} flexDirection={"row"} gap={5} columnGap={20}>
              <Flex
                h={"full"}
                flexDirection={"column"}
                rowGap={5}
                flex={2}
                mb={10}
                maxW={"container.md"}
              >
                {!values.thumbnail ? (
                  <Flex
                    h={200}
                    border={"2px dashed"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    color={"gray.300"}
                    cursor={"pointer"}
                    onClick={showUploadWidget}
                  >
                    <Text textAlign={"center"} color={"gray.500"}>
                      Click here to upload thumbnail
                    </Text>
                  </Flex>
                ) : (
                  <Flex>
                    <Image
                      src={new CloudinaryImage(values.thumbnail, {
                        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                      }).toURL()}
                      height={200}
                      width={"full"}
                      objectFit={"cover"}
                      loading="lazy"
                    />
                  </Flex>
                )}
                <FormControl isInvalid={Boolean(touched.title && errors.title)}>
                  <Input
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    placeholder={"Write title..."}
                  />
                  <FormErrorMessage>{errors.title}</FormErrorMessage>
                </FormControl>
                <FormControl>
                  <Select
                    name="category"
                    options={categories.map((item) => ({
                      label: item?.name,
                      value: item?.id,
                    }))}
                    value={values.category}
                    onChange={(selectedOption) => {
                      setFieldValue("category", selectedOption);
                    }}
                  />
                  <FormErrorMessage>{errors?.category}</FormErrorMessage>
                </FormControl>
                <Box h={{ base: 300, md: 220 }}>
                  <ReactQuill
                    style={{ height: 150 }}
                    theme="snow"
                    placeholder="Write here..."
                    value={values.content.html}
                    formats={formats}
                    modules={modules}
                    onChange={(value, delta, sources, editor) => {
                      setFieldValue("content.html", editor.getHTML());
                      setFieldValue("content.raw", editor.getText());
                    }}
                  />
                </Box>
                <Button type="submit" colorScheme="blue" isLoading={isLoading}>
                  Post
                </Button>
              </Flex>
              {recentBlogs && recentBlogs?.data?.length > 0 && (
                <Flex
                  display={{ base: "none", md: "flex" }}
                  flex={1}
                  flexDir={"column"}
                  overflowY={"auto"}
                  scrollBehavior={"smooth"}
                  alignItems={"center"}
                >
                  <Text textAlign={"center"} fontSize={"2xl"}>
                    Recent Blogs
                  </Text>
                  {(loading || fetching) && <Loading />}
                  <Flex flexDir={"column"} rowGap={5} mt={5}>
                    {recentBlogs?.data?.map((item) => (
                      <Flex key={item?.id} columnGap={3} alignItems={"center"}>
                        <Avatar name={item?.user?.name} />
                        <Flex flexDir={"column"}>
                          <Text
                            as={Link}
                            to={`/blog/${item?.slug}`}
                            fontSize={"md"}
                          >
                            {item?.title}
                          </Text>
                          <Badge
                            colorScheme="blue"
                            w="fit-content"
                            variant={"subtle"}
                          >
                            {item?.category?.name}
                          </Badge>
                          <Text fontSize={"smaller"} color={"gray.600"}>
                            on{" "}
                            {dayjs(item?.createdOn).format(
                              "DD-MMM-YYYY hh:mm A"
                            )}
                          </Text>
                        </Flex>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>
              )}
            </Flex>
          </Box>
        </Container>
      </RootLayout>
    </>
  );
};

const AuthenticatedAddBlog = WithAuth(AddBlog);
export default AuthenticatedAddBlog;
