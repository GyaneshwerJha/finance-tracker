import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useState } from "react";
import "./style.css";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { auth, db, doc, provider, setDoc } from "../../firebase";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { getDoc } from "firebase/firestore";

const toastConfig = {
  position: "top-right",
  autoClose: 2000,
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

const SignupSignin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginform, setLoginform] = useState(false);
  const navigate = useNavigate();

  const createDoc = async (user) => {
    setLoading(true);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      try {
        const createdAt = new Date().toISOString();
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: createdAt,
        });
        showToast("Doc created successfully!", "success");
        setLoading(false);
      } catch (e) {
        showToast(e.message);
        setLoading(false);
      }
    } else {
      setLoading(false);
      // showToast("Docs already exists");
    }
  };

  const showToast = (message, type = "error") => {
    toast[type](message, toastConfig);
  };

  const validateForm = () => {
    if (!name || !email || !password || password !== confirmPassword) {
      setLoading(false);
    }
    if (!name) return "Name is required";
    if (!email) return "Email is required";
    if (!password) return "Password is required";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleAuthError = (error) => {
    setLoading(false);
    if (error.code === "auth/email-already-in-use") {
      showToast("Email already in use");
    } else {
      showToast(error.message);
    }
  };

  const signWithEmail = () => {
    setLoading(true);
    const errorMessage = validateForm();
    if (errorMessage) {
      showToast(errorMessage);
      setLoading(false);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoading(false);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        createDoc(user);

        // Show toast for "User Created" with a 3-second duration
        showToast("User Created", "success", 3000);

        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      })
      .catch(handleAuthError);
  };

  const loginUsingEmail = () => {
    setLoading(true);

    if (!email) {
      setLoading(false);

      showToast("Email is required");
      return;
    }
    if (!password) {
      setLoading(false);

      showToast("Password is required");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        console.log(user);
        // createDoc(user);
        showToast("Login successful", "success", 2000);
        setLoading(false);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      })
      .catch((error) => {
        setLoading(false);
        showToast(error.message);
      });
  };

  const googleAuth = () => {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
          console.log("user", user);
          createDoc(user);
          showToast("Login successful", "success", 2000);
          setLoading(false);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        })
        .catch((error) => {
          showToast(error.message);
          setLoading(false);
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    } catch (e) {
      showToast(e.message);
    }
  };

  return (
    <>
      <ToastContainer />
      {loginform ? (
        <div className="signup-wrapper">
          <h2 style={{ color: "white" }} className="title">
            Login to <span className="theme-color">ExpenseMate</span>
          </h2>
          <form>
            <Input
              type="email"
              label="Email"
              state={email}
              setState={setEmail}
              placeholder="Johndoe@gmail.com"
            />
            <Input
              type="password"
              label="Password"
              state={password}
              setState={setPassword}
              placeholder="XYZ@98765"
            />
            <div>
              <Button
                isabled={loading}
                text={loading ? "Loading...." : "Log In"}
                onClick={loginUsingEmail}
              />
              <p style={{ textAlign: "center", color: "var(--rcolor)" }}>or</p>
              <Button
              onClick={googleAuth}
                text={loading ? "Loading...." : "Log In using Google"}
                blue={true}
              />
              <p
                className="p-login"
                style={{ cursor: "pointer" }}
                onClick={() => setLoginform(false)}
              >
                Don't have an account?{" "}
                <span style={{ color: "var(--rcolor)" }}>Click Here</span>
              </p>
            </div>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 style={{ color: "white" }} className="title">
            Sign Up on <span className="theme-color">ExpenseMate</span>
          </h2>
          <form>
            <Input
              type="text"
              label="Full Name"
              state={name}
              setState={setName}
              placeholder="John Doe"
            />
            <Input
              type="email"
              label="Email"
              state={email}
              setState={setEmail}
              placeholder="Johndoe@gmail.com"
            />
            <Input
              type="password"
              label="Password"
              state={password}
              setState={setPassword}
              placeholder="XYZ@98765"
            />
            <Input
              type="password"
              label="Confirm Password"
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder="XYZ@98765"
            />
            <div>
              <Button
                isabled={loading}
                text={loading ? "Loading...." : "Sign Up"}
                onClick={signWithEmail}
              />
              <p style={{ textAlign: "center", color: "var(--rcolor)" }}>or</p>
              <Button
                onClick={googleAuth}
                text={loading ? "Loading...." : "Sign Up using Google"}
                blue={true}
              />
              <p
                className="p-login"
                style={{ cursor: "pointer" }}
                onClick={() => setLoginform(true)}
              >
                Have an account?{" "}
                <span style={{ color: "var(--rcolor)" }}>Click Here</span>
              </p>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default SignupSignin;
