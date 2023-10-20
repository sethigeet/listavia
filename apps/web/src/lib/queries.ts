"use client";

import { useRouter } from "next/navigation";
import { UseQueryOptions, useMutation, useQuery } from "react-query";

import { queryClient } from "./queryClientProvider";

type Router = ReturnType<typeof useRouter>;

export const queryFns = {
  me: () => fetch("http://localhost:4000/user/me", { credentials: "include" }).then((res) => res.json()),
  getSessions: () => fetch("http://localhost:4000/session", { credentials: "include" }).then((res) => res.json()),
  getMessages: (sessionId: string) =>
    fetch("http://localhost:4000/message/getAll", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => res.json()),
};

export const mutateFns = {
  login: (input: { username: string; password: string }) =>
    fetch("http://localhost:4000/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => res.json()),
  register: (input: { username: string; password: string }) =>
    fetch("http://localhost:4000/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => res.json()),
  logout: () => fetch("http://localhost:4000/auth/logout", { credentials: "include" }).then((res) => res.json()),
  newMessage: (input: { msg: string; sessionId: string }) =>
    fetch("http://localhost:4000/message", {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => res.json()),
  createSession: (input: { title: string }) =>
    fetch("http://localhost:4000/session", {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => res.json()),
};

export const useMeQuery = (options?: UseQueryOptions<any, unknown, any, "me">) => useQuery("me", queryFns.me, options);

export const useGetSessionQuery = (options?: UseQueryOptions<any, unknown, any, "getSessions">) =>
  useQuery("getSessions", queryFns.getSessions, options);

export const useGetMessagesQuery = (sessionId: string | null, options?: UseQueryOptions<any, unknown, any, "me">) =>
  // @ts-ignore
  useQuery(["getMessages", sessionId], () => queryFns.getMessages(sessionId), {
    enabled: sessionId !== null,
    ...options,
  });

export const useLogoutMutation = (router: Router) =>
  useMutation("logout", mutateFns.logout, {
    onSuccess: (data) => {
      if (data && !data.error) {
        router.replace("/login", { scroll: false });
        queryClient.cancelQueries("me");
        queryClient.setQueryData("me", { error: "Unauthorized" });
      }
    },
  });

export const useLoginMutation = (router: Router) =>
  useMutation(mutateFns.login, {
    onSuccess(data) {
      if (data && data.user) {
        router.replace("/", { scroll: false });
        queryClient.cancelQueries("me");
        queryClient.setQueryData("me", data);
      }
    },
  });

export const useRegisterMutation = (router: Router) =>
  useMutation(mutateFns.register, {
    onSuccess(data) {
      if (data && data.user) {
        router.replace("/", { scroll: false });
        queryClient.cancelQueries("me");
        queryClient.setQueryData("me", data);
      }
    },
  });

export const useNewMessageMutation = (sessionId: string | null, onSuccess?: () => void) =>
  useMutation(mutateFns.newMessage, {
    onSuccess(data) {
      if (data && data.msg) {
        queryClient.cancelQueries(["getMessages", sessionId]);
        queryClient.setQueryData(["getMessages", sessionId], (old: any) =>
          Array.isArray(old) ? [data, ...old] : [data],
        );
        if (onSuccess) {
          onSuccess();
        }
      }
    },
  });

export const useCreateSessionMutation = (onSuccess?: (data: any) => void) =>
  useMutation(mutateFns.createSession, {
    onSuccess(data) {
      if (data && data.id) {
        queryClient.cancelQueries("getSessions");
        queryClient.setQueryData("getSessions", (old: any) => (Array.isArray(old) ? [...old, data] : [data]));
        if (onSuccess) {
          onSuccess(data);
        }
      }
    },
  });
