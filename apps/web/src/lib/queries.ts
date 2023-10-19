"use client";

import { useRouter } from "next/navigation";
import { UseQueryOptions, useMutation, useQuery } from "react-query";

import { queryClient } from "./queryClientProvider";

type Router = ReturnType<typeof useRouter>;

export const queryFns = {
  me: () => fetch("http://localhost:4000/user/me", { credentials: "include" }).then((res) => res.json()),
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
};

export const useMeQuery = (options?: UseQueryOptions<any, unknown, any, "me">) =>
  useQuery("me", queryFns.me, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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
      if (data && data["user"]) {
        router.replace("/", { scroll: false });
        queryClient.cancelQueries("me");
        queryClient.setQueryData("me", data);
      }
    },
  });

export const useRegisterMutation = (router: Router) =>
  useMutation(mutateFns.register, {
    onSuccess(data) {
      if (data && data["user"]) {
        router.replace("/", { scroll: false });
        queryClient.cancelQueries("me");
        queryClient.setQueryData("me", data);
      }
    },
  });
