"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeleteButton({
  id,
  formAction,
  label,
  confirmText,
  className,
}: {
  id: string;
  formAction: (formData: FormData) => Promise<void> | void;
  label: string;
  confirmText: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!confirming) {
          event.preventDefault();
          setConfirming(true);
          window.setTimeout(() => setConfirming(false), 5000);
          return;
        }
        if (!window.confirm(confirmText)) {
          event.preventDefault();
          setConfirming(false);
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className={cn(
          "inline-flex h-9 cursor-pointer items-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors disabled:opacity-50",
          confirming ? "bg-red-600 text-white hover:bg-red-700" : "text-red-700 hover:bg-red-50",
          className,
        )}
      >
        <Trash2 className="size-4" aria-hidden="true" />
        {confirming ? "Confirm delete" : label}
      </button>
    </form>
  );
}