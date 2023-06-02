import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/404";
import AddBlog from "./pages/AddBlog";
import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SingleBlog from "./pages/SingleBlog";
import useAuthStore from "./store/useAuthStore";
import useCategoryStore from "./store/useCategoryStore";
import { instance } from "./utils/API";
import { CATEGORIES, PROFILE } from "./utils/ROUTES";

function App() {
  const { setCategories, setSelectedCategory } = useCategoryStore();
  const { isLoggedIn, setLoggedIn, setUser } = useAuthStore();
  const [cookies] = useCookies(["access_token", "refresh_token"]);
  useEffect(() => {
    if (cookies.access_token) setLoggedIn(true);
  }, [cookies.access_token, setLoggedIn]);
  useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return instance.get(CATEGORIES);
    },
    onSuccess: ({ data }) => {
      setCategories(data);
      setSelectedCategory({ name: "all" });
    },
    onError(err) {
      console.log(err);
    },
    refetchOnMount: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
    enabled: isLoggedIn,
  });
  // fetch user profile data
  useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return instance.get(PROFILE);
    },
    onSuccess: ({ data }) => {
      setUser(data);
    },
    onError: (error) => {
      console.error(error);
    },
    enabled: isLoggedIn,
    staleTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Homepage />} />
          <Route path="/add-blog" element={<AddBlog />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/blog/:id" element={<SingleBlog />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
