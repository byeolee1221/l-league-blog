"use client";

import { getListIcon } from "@/lib/iconMapping";
import { useActionState, useEffect, useState } from "react";
import { signinAction } from "../action/signinAction";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SigninForm = () => {
  const [email, setEmail] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [state, formAction, isPending] = useActionState(signinAction, null);
  const router = useRouter();

  const handleClickPasswordVisible = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    if (state?.success) {
      if (state.isOwner !== undefined) { 
        localStorage.setItem("isOwner", state.isOwner.toString());
      }
      toast.success("로그인에 성공했습니다.");
      router.push("/");
    } else if (state?.error) {
      if (typeof state.error === "string") {
        toast.error(state.error);
      }
    }
  }, [state, router]);

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-none transition-all sm:max-w-lg sm:shadow-xl md:max-w-xl">
      <div className="p-6 sm:p-8 md:p-10">
        <form className="flex min-h-[calc(100vh-150px)] flex-col justify-between sm:h-auto sm:min-h-0" action={formAction}>
          <div className="flex flex-col space-y-8">
            <div className="relative flex flex-col space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-400 sm:text-base">
                이메일
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                aria-label="이메일"
                placeholder="이메일을 입력해 주세요"
              />
              {state?.error?.email && (
                <p className="absolute -bottom-6 text-sm text-red-500">{state.error.email}</p>
              )}
            </div>
            <div className="relative flex flex-col space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-400 sm:text-base">
                비밀번호
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  aria-label="비밀번호"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={handleClickPasswordVisible}
                  tabIndex={-1}
                  aria-label="비밀번호 글자보이기"
                >
                  {isPasswordVisible
                    ? getListIcon("eyeOff", "size-5 sm:size-6")
                    : getListIcon("eyeOn", "size-5 sm:size-6")}
                </button>
              </div>
              {state?.error?.password && (
                <p className="absolute -bottom-6 text-sm text-red-500">{state.error.password}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="mt-8 cursor-pointer rounded-lg bg-orange-500 px-4 py-3 font-bold text-white shadow-md transition-all hover:shadow-lg disabled:bg-gray-400 sm:mt-6"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center justify-center space-x-2">
                {getListIcon("spinner", "size-5 sm:size-6 animate-spin")}
              </span>
            ) : (
              "로그인"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SigninForm;
