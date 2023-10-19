"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { SendIcon, MessageCard, Message, Navbar, ErrorMessage, LoadingIndicator } from "ui";
import { useLogoutMutation, useMeQuery } from "../lib";

const messages: Message[] = [
  {
    msg: "This is the 1st message!",
    timeCreated: "some time ago",
  },
  {
    msg: "This is the 1st message!",
    timeCreated: "some time ago",
  },
  {
    msg: "This is the 1st message!",
    timeCreated: "some time ago",
  },
  {
    msg: "This is the 1st message!",
    timeCreated: "some time ago",
  },
  {
    msg: "This is the 1st message!",
    timeCreated: "some time ago",
  },
];

export default function Page() {
  const router = useRouter();
  const [msg, setMsg] = useState("");

  const meQuery = useMeQuery({
    onSuccess: (data) => {
      if (data && data.error) {
        router.replace("/login", { scroll: false });
      }
    },
  });
  const logoutMutation = useLogoutMutation(router);

  return (
    <>
      {(meQuery.isLoading || logoutMutation.isLoading) && <LoadingIndicator />}
      <ErrorMessage error={meQuery.isError ? (meQuery.error as Error).message : undefined} retryFn={meQuery.refetch} />
      <ErrorMessage
        error={logoutMutation.isError ? (logoutMutation.error as Error).message : undefined}
        retryFn={logoutMutation.mutate}
      />

      <div>
        <Navbar username={meQuery.data?.user?.username} logoutFn={logoutMutation.mutate} />
        <div className="mx-auto max-w-2xl">
          <div className="form-control">
            <label className="label label-text text-lg">New Message</label>
            <div className="rounded-xl bg-primary/10 p-4">
              <textarea
                className="textarea h-24 w-full bg-transparent focus-within:border-0 focus:border-0 focus:outline-none"
                placeholder="Type your message here..."
                value={msg}
                onChange={(e) => {
                  if (e.target.value.length > 200) {
                    return;
                  }

                  setMsg(e.target.value);
                }}
              />
              <div className="mt-2 flex">
                <span className="mt-auto text-xs">You can enter {200 - msg.length}/200 characters more!</span>
                <button className="btn btn-primary ml-auto">
                  Send <SendIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="my-10">
            <span className="label label-text text-lg">Old Messages</span>
            {messages.map((msg, i) => (
              <div key={i} className="mt-4">
                <MessageCard msg={msg} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
