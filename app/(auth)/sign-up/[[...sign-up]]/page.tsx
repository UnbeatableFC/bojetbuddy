import { SignUp } from "@clerk/nextjs";

const Page = () => {
  return <SignUp redirectUrl={"/dashboard"} />;
};

export default Page;
