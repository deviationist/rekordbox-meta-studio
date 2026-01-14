import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings-layout';
import { useMemo } from 'react';
import { useRoute } from '@/hooks/use-route';

export default function Appearance() {
  const route = useRoute();
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
    {
      title: 'Appearance settings',
      href: route('appearance.edit'),
    },
  ], [route]);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Appearance settings" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Appearance settings"
            description="Update your account's appearance settings"
          />
          <AppearanceTabs />
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
