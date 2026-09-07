import { requireAdmin } from '@/lib/auth';
import db from '@/lib/db';
import { Check, X } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function AdminReviews() {
  await requireAdmin();

  const reviews = db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all() as any[];

  async function approveReview(formData: FormData) {
    'use server';
    const session = await requireAdmin();
    const id = formData.get('id');
    db.prepare('UPDATE reviews SET approved = 1 WHERE id = ?').run(id);
    db.prepare('INSERT INTO audit_logs (actor_id, action, resource) VALUES (?, ?, ?)').run(session.id, 'APPROVED_REVIEW', `review:${id}`);
    revalidatePath('/admin/reviews');
  }

  async function rejectReview(formData: FormData) {
    'use server';
    const session = await requireAdmin();
    const id = formData.get('id');
    db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
    db.prepare('INSERT INTO audit_logs (actor_id, action, resource) VALUES (?, ?, ?)').run(session.id, 'REJECTED_REVIEW', `review:${id}`);
    revalidatePath('/admin/reviews');
  }

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">Review Moderation</h1>
      
      <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((r: any) => (
              <div key={r.id} className="p-6 bg-neutral-950 rounded-xl border border-white/5 flex flex-col md:flex-row gap-6 justify-between items-start">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{r.name}</h3>
                    <span className="text-sm text-neutral-400">{r.role}</span>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${r.approved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {r.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="text-amber-400">{'★'.repeat(r.rating)}</span>
                    <span className="text-neutral-600">{'★'.repeat(5 - r.rating)}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Most Useful</p>
                      <p className="text-sm">{r.useful}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">What they built</p>
                      <p className="text-sm">{r.built}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Testimonial</p>
                    <p className="italic text-sm text-neutral-300">&quot;{r.testimonial}&quot;</p>
                  </div>
                </div>
                
                {!r.approved && (
                  <div className="flex items-center gap-2 shrink-0">
                    <form action={approveReview}>
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors" title="Approve">
                        <Check className="w-5 h-5" />
                      </button>
                    </form>
                    <form action={rejectReview}>
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors" title="Reject & Delete">
                        <X className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-neutral-500 text-center py-8">No reviews found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
