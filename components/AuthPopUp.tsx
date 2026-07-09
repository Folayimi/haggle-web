import SignupPage from "@/appPages/signup/signup";
import LoginPage from "@/appPages/login";
import ForgotPasswordPage from "@/appPages/forgot-password/ForgotPasswordPage";
import { Dispatch, SetStateAction, useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
const AuthPopUp = ({
  setActivateAuth,
}: {
  setActivateAuth: any;
}) => {
  const [view, setView] = useState("signup");
  const pathname = usePathname();
  const route = useRouter();
  return (
    <>
      <div className="fixed inset-0 z-[300] p-5 flex items-center justify-center backdrop-blur bg-background/70 transition">
        <div className=" relative flex w-[450px] shrink">
          {pathname === "/for-you" || pathname === "/market" ? (
            <div
              className="absolute top-5 right-5 cursor-pointer"
              onClick={() => {
                localStorage.setItem("activateAuth", "false");
                setActivateAuth(false);
              }}
            >
              <X color="gray" size={20} />
            </div>
          ) : (
            <div
              className="absolute top-5 left-5 cursor-pointer"
              onClick={() => {
                localStorage.setItem("activateAuth", "false");
                route.push("/for-you");
              }}
            >
              <ChevronLeft color="gray" size={20} />
            </div>
          )}

          {view === "login" && <LoginPage setView={setView} />}
          {view === "signup" && <SignupPage setView={setView} />}
          {view === "forgotPassword" && (
            <ForgotPasswordPage setView={setView} />
          )}
        </div>
      </div>
    </>
  );
};

export default AuthPopUp;
