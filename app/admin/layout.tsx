import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Users, Package, Settings, FileText, CheckSquare } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session;
  try {
    session = await requireAdmin();
  } catch (error) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex">
      <aside className="w-64 border-r border-white/10 bg-neutral-900/50 hidden md:block">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2 text-amber-400 font-bold mb-8">
            <ShieldAlert className="w-5 h-5" />
            Admin Panel
          </Link>
          
          <nav className="space-y-1">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Package className="w-4 h-4" />
              Overview
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Users className="w-4 h-4" />
              Users & Purchases
            </Link>
            <Link href="/admin/reviews" className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <CheckSquare className="w-4 h-4" />
              Review Moderation
            </Link>
            <Link href="/admin/versions" className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <FileText className="w-4 h-4" />
              PDF Versioning
            </Link>
          </nav>
        </div>
      </aside>
      
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
