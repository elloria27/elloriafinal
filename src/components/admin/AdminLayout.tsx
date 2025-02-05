import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {children}
      </div>
    </div>
  );
};