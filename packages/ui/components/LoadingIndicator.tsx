import { FC } from "react";

interface LoadingIndicatorProps {}

export const LoadingIndicator: FC<LoadingIndicatorProps> = () => {
  return (
    <div className="absolute inset-0 grid place-items-center bg-black/50 backdrop-blur-sm">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );
};
