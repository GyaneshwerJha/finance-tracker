import { useEffect } from "react";
import { auth } from "../../firebase";
import "./style.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { signOut } from "firebase/auth";

const toastConfig = {
  position: "top-right",
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  transition: Bounce,
  style: {
    background: "black",
    color: "white",
  },
};

const Header = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const showToast = (message, type = "error") => {
    toast[type](message, toastConfig);
  };

  useEffect(() => {
    if (user && !loading) {
      const loginFlag = localStorage.getItem("loginToastShown");
      if (!loginFlag) {
        showToast("Login successful", "success", 1000);
        localStorage.setItem("loginToastShown", "true");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    }
  }, [user, loading, navigate]);

  const logout = () => {
    try {
      signOut(auth).then(() => {
        showToast("Logout successful", "success", 1000);
        localStorage.removeItem("loginToastShown"); // Reset the flag on logout
        setTimeout(() => {
          navigate("/");
        }, 1000);
      });
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  return (
    <div className="navbar">
      <p className="logo">ExpenseMate</p>
      {user && (
        <p className="logo link" onClick={logout}>
          Logout
        </p>
      )}
    </div>
  );
};

export default Header;