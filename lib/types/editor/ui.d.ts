import type { ButtonHTMLAttributes, ReactNode } from "react";
export declare function IconButton({ label, children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function Field({ label, children, hint, }: {
    label: string;
    children: ReactNode;
    hint?: string;
}): import("react").JSX.Element;
