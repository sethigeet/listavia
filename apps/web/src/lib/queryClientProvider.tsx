"use client";

import { FC, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

export const APIClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
