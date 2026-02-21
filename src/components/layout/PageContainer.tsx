'use client';

import { ReactNode } from "react";
import { useEffect, useState } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <main className={`min-h-screen pt-[72px] ${className}`}>
      {children}
    </main>
  );
};

export default PageContainer;
