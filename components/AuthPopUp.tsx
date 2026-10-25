"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import SignupPage from "@/appPages/signup/signup";
import LoginPage from "@/appPages/login";
import ForgotPasswordPage from "@/appPages/forgot-password/ForgotPasswordPage";

const slides = [
  "/graphics-h1.png",
  "/graphics-h2.png",
  "/graphics-h3.png",
];

const AuthPopUp = ({
  setActivateAuth,
  initialView = "signup",
}: {
  setActivateAuth: (value: boolean) => void;
  initialView?: string;
}) => {
  const [view, setView] = useState(initialView);
  const [activeSlide, setActiveSlide] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const canClose = pathname === "/for-you" || pathname === "/market";

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, []);

  const closeModal = () => {
    localStorage.setItem("activateAuth", "false");
    setActivateAuth(false);
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/15 p-3 backdrop-blur-xl sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && canClose) closeModal();
      }}
    >
      <section
        aria-label="Haggle account access"
        aria-modal="true"
        role="dialog"
        className="relative grid h-[min(760px,90dvh)] w-full max-w-4xl grid-cols-1 overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-black/30 md:grid-cols-2"
      >
        {canClose ? (
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close sign in"
            className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              closeModal();
              router.push("/for-you");
            }}
            aria-label="Back to home"
            className="absolute left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <div className="relative hidden min-h-0 overflow-hidden border-r border-white/80 bg-[#f97316] md:block">
          {slides.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                activeSlide === index ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={activeSlide !== index}
            >
              <Image
                src={image}
                alt=""
                fill
                priority={index === 0}
                sizes="(min-width: 768px) 45vw, 0vw"
                className="object-cover"
              />
            </div>
          ))}
          <div className="absolute bottom-7 left-8 z-10 flex gap-2">
            {slides.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Show marketplace highlight ${index + 1}`}
                aria-current={activeSlide === index}
                className={`h-1.5 rounded-full transition-all ${
                  activeSlide === index
                    ? "w-8 bg-white"
                    : "w-4 bg-white/45 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative min-h-0 overflow-y-auto border-l border-slate-200 bg-gradient-to-br from-white via-white to-orange-50/70">
          <div className="flex min-h-full w-full items-center justify-center px-5 py-14 sm:px-8 lg:px-10">
            {view === "login" && <LoginPage setView={setView} />}
            {view === "signup" && <SignupPage setView={setView} />}
            {view === "forgotPassword" && (
              <ForgotPasswordPage setView={setView} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthPopUp;
