import Header from "../components/Header/Header";
import SignupSignin from "../components/SignupSignin/SignupSignin";

const Signup = () => {
  return (
    <>
      <Header />
      <div className="wrapper">
        <SignupSignin/>
      </div>
    </>
  );
};

export default Signup;
