import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges Tailwind class names, resolving conflicts in favour of the last argument. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
