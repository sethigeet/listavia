"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { SendIcon, MessageCard, Navbar, ErrorMessage, LoadingIndicator } from "ui";
import {
  useGetMessagesQuery,
  useGetSessionQuery,
  useLogoutMutation,
  useMeQuery,
  useNewMessageMutation,
  useCreateSessionMutation,
} from "../lib";

export default function Page() {
  const router = useRouter();
  const createSessionModalRef = useRef<HTMLDialogElement>(null);
  const [msg, setMsg] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [currSessId, setCurrSessId] = useState<string | null>(null);

  const meQuery = useMeQuery({
    onSuccess: (data) => {
      if (data && data.error) {
        router.replace("/login", { scroll: false });
      }
    },
  });
  const getSessionsQuery = useGetSessionQuery({
    enabled: meQuery.data && meQuery.data.user !== null,
    onSuccess: (data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setCurrSessId(data[0].id);
      }
    },
  });
  const getMessagesQuery = useGetMessagesQuery(currSessId);
  const logoutMutation = useLogoutMutation(router);
  const createSessionMutation = useCreateSessionMutation((data) => {
    setSessionName("");
    setCurrSessId(data.id);
    createSessionModalRef.current?.close();
  });
  const newMessageMutation = useNewMessageMutation(currSessId, () => setMsg(""));

  return (
    <>
      {(meQuery.isLoading || logoutMutation.isLoading || getSessionsQuery.isLoading || getMessagesQuery.isLoading) && (
        <LoadingIndicator />
      )}
      <ErrorMessage error={meQuery.isError ? (meQuery.error as Error).message : undefined} retryFn={meQuery.refetch} />
      <ErrorMessage
        error={logoutMutation.isError ? (logoutMutation.error as Error).message : undefined}
        retryFn={logoutMutation.mutate}
      />
      <ErrorMessage
        error={getSessionsQuery.isError ? (getSessionsQuery.error as Error).message : undefined}
        retryFn={getSessionsQuery.refetch}
      />
      <ErrorMessage
        error={getMessagesQuery.isError ? (getMessagesQuery.error as Error).message : undefined}
        retryFn={getMessagesQuery.refetch}
      />
      <ErrorMessage
        error={newMessageMutation.isError ? (newMessageMutation.error as Error).message : undefined}
        retryFn={() => newMessageMutation.mutate({ msg, sessionId: currSessId! })}
      />
      <ErrorMessage
        error={createSessionMutation.isError ? (createSessionMutation.error as Error).message : undefined}
        retryFn={() => createSessionMutation.mutate({ title: sessionName })}
      />

      <div>
        <Navbar
          username={meQuery.data?.user?.username}
          sessions={getSessionsQuery.data}
          logoutFn={logoutMutation.mutate}
          setSessionId={(id) => setCurrSessId(id)}
          openCreateSessionModal={() => createSessionModalRef.current?.showModal()}
        />
        <dialog ref={createSessionModalRef} className="modal">
          <div className="modal-box">
            <h2 className="border-b-2 border-b-primary text-3xl font-semibold text-white">Create new session</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createSessionMutation.mutate({ title: sessionName });
              }}
              className="mx-auto text-center"
            >
              <div className="form-control mx-auto mt-4 w-full max-w-xs">
                <label className="label label-text">Enter session name</label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                />
                {createSessionMutation.data &&
                  createSessionMutation.data.inputErrors &&
                  createSessionMutation.data.inputErrors.title && (
                    <label className="label label-text-alt text-error">
                      {createSessionMutation.data.inputErrors.title[0]}
                    </label>
                  )}
              </div>
              <button
                className="btn btn-primary mt-4 text-xs md:text-base"
                disabled={createSessionMutation.isLoading}
                type="submit"
              >
                Submit
                {createSessionMutation.isLoading ? (
                  <div className="loading loading-spinner loading-xs md:loading-sm" />
                ) : (
                  <SendIcon className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </button>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        {currSessId !== null ? (
          <div className="mx-auto max-w-2xl">
            <h2 className="my-4 border-b-2 border-b-primary text-center text-3xl font-semibold text-white">
              {getSessionsQuery.data.find((i: any) => i.id === currSessId).title}
            </h2>
            <form
              className="form-control"
              onSubmit={(e) => {
                e.preventDefault();
                newMessageMutation.mutate({ msg, sessionId: currSessId });
              }}
            >
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
                {newMessageMutation.data &&
                  newMessageMutation.data.inputErrors &&
                  newMessageMutation.data.inputErrors.msg && (
                    <label className="label label-text-alt text-error">
                      {newMessageMutation.data.inputErrors.msg[0]}
                    </label>
                  )}
                <div className="mt-2 flex">
                  <span className="mt-auto text-xs">You can enter {200 - msg.length}/200 characters more!</span>

                  <button
                    className="btn btn-primary ml-auto mt-4 text-xs md:text-base"
                    disabled={newMessageMutation.isLoading}
                    type="submit"
                  >
                    Submit
                    {newMessageMutation.isLoading ? (
                      <div className="loading loading-spinner loading-xs md:loading-sm" />
                    ) : (
                      <SendIcon className="h-4 w-4 md:h-5 md:w-5" />
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Messages */}
            <div className="my-10">
              <span className="label label-text text-lg">Old Messages</span>
              {getMessagesQuery.data && Array.isArray(getMessagesQuery.data) ? (
                getMessagesQuery.data.length > 0 ? (
                  getMessagesQuery.data.map((msg) => (
                    <div key={msg.id} className="mt-4">
                      <MessageCard msg={msg} />
                    </div>
                  ))
                ) : (
                  <span className="text-center text-sm">You don't have any messages created!</span>
                )
              ) : (
                <span className="text-center text-sm">You are not logged in</span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-center text-lg">Start be creating a session from the menu</span>
        )}
      </div>
    </>
  );
}
