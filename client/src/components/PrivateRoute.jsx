import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export function WithAuth(Component) {
  return function WithAuth(props) {
    const { isLoggedIn } = useAuthStore();
    if (isLoggedIn) return <Component {...props} />;
    return <Navigate to={"/sign-in"} />;
  };
}
