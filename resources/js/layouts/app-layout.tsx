import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs }: AppLayoutProps) => (
  <AppShell variant="sidebar">
    <AppSidebar />
    <AppContent variant="sidebar" className="overflow-x-hidden">
      <AppSidebarHeader breadcrumbs={breadcrumbs} />
      {children}
    </AppContent>
  </AppShell>
);
