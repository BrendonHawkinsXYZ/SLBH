import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return <div className="site-document">{children}</div>;
}
