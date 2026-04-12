import clsx from "clsx"
import { twMerge } from "tailwind-merge"

export const cx = (...args) => twMerge(clsx(...args))
