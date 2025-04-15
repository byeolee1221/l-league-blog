import SigninForm from "./components/SigninForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
};

const SignInPage = () => {
  return (
    <div className="flex w-full items-center justify-center px-4 py-20 md:py-28 lg:min-h-screen">
      <SigninForm />
    </div>
  );
};

export default SignInPage;
