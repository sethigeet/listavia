"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { ErrorMessage, LoadingIndicator, Navbar, SendIcon } from "ui";
import { useMeQuery, useRegisterMutation } from "../../lib";

export default function Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const meQuery = useMeQuery({
    onSuccess: (data) => {
      if (data && data.user) {
        router.replace("/", { scroll: false });
      }
    },
  });
  const registerMutation = useRegisterMutation(router);

  return (
    <>
      {meQuery.isLoading && <LoadingIndicator />}
      <ErrorMessage error={meQuery.isError ? (meQuery.error as Error).message : undefined} retryFn={meQuery.refetch} />
      <ErrorMessage
        error={registerMutation.isError ? (registerMutation.error as Error).message : undefined}
        retryFn={() => registerMutation.mutate({ username, password })}
      />
      <ErrorMessage
        dismissable
        error={registerMutation.data && registerMutation.data.error ? registerMutation.data.message : undefined}
      />
      <div>
        <Navbar />

        {/* Login form */}
        <form
          className="mx-auto mt-10 flex max-w-xl flex-col items-center rounded-lg bg-primary/10 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            registerMutation.mutate({ username, password });
          }}
        >
          <h2 className="border-b-2 border-b-primary text-3xl font-semibold text-white">Get Started!</h2>
          <h3 className="mt-2 text-lg font-medium text-primary-content">Register now</h3>
          <div className="form-control mt-4 w-full max-w-xs">
            <label className="label label-text">Enter your username</label>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {registerMutation.data &&
              registerMutation.data.inputErrors &&
              registerMutation.data.inputErrors.username && (
                <label className="label label-text-alt text-error">
                  {registerMutation.data.inputErrors.username[0]}
                </label>
              )}
          </div>
          <div className="form-control mt-4 w-full max-w-xs">
            <label className="label label-text">Enter your password</label>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {registerMutation.data &&
              registerMutation.data.inputErrors &&
              registerMutation.data.inputErrors.password && (
                <label className="label label-text-alt text-error">
                  {registerMutation.data.inputErrors.password[0]}
                </label>
              )}
          </div>
          <button
            className="btn btn-primary mt-4 text-xs md:text-base"
            disabled={registerMutation.isLoading}
            type="submit"
          >
            Submit
            {registerMutation.isLoading ? (
              <div className="loading loading-spinner loading-xs md:loading-sm" />
            ) : (
              <SendIcon className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </button>
          <span className="mt-2 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="link-info link">
              Login now
            </Link>
          </span>
        </form>
      </div>
    </>
  );
}
