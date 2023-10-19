import { FC, useRef } from "react";

interface ErrorMessageProps {
  error?: string;
  retryFn?: () => void;
  dismissable?: boolean;
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ error, retryFn, dismissable = false }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <dialog className="modal" open={error !== undefined}>
      <div className="absolute inset-0 grid place-items-center bg-black/50 backdrop-blur-sm">
        <div className="modal-box">
          {dismissable && (
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
            </form>
          )}
          <h3 className="text-lg font-bold">An error occurred!</h3>
          <p className="py-4">{error}</p>
          <div className="modal-action">
            {retryFn && (
              <button className="btn btn-primary" onClick={() => retryFn()}>
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};
