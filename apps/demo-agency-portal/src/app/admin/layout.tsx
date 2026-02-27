import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { toLogaCoreUser } from '@logacore/core/auth';
import type { SessionUser } from '@logacore/core/auth';
import { AdminClientLayout } from '@/components/admin/AdminClientLayout';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const user = toLogaCoreUser(session.user as SessionUser);

  return <AdminClientLayout user={user}>{children}</AdminClientLayout>;
}
