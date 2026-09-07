import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

export default async function AdminVersions() {
  try {
    await requireAdmin();
  } catch (error) {
    redirect('/');
  }

  // Make sure default products exist
  try {
    db.exec(`
      INSERT OR IGNORE INTO products (id, name) VALUES ('source', 'The Source Engine');
      INSERT OR IGNORE INTO products (id, name) VALUES ('practice', 'The Practice Engine');
      INSERT OR IGNORE INTO products (id, name) VALUES ('opensource', 'Open-Source Engine');
    `);
  } catch (e) {}

  const products = db.prepare(`
    SELECT p.*, pv.version_name, pv.file_path, pv.status
    FROM products p
    LEFT JOIN product_versions pv ON p.current_version_id = pv.id
  `).all() as any[];

  async function uploadVersion(formData: FormData) {
    'use server';
    const session = await requireAdmin();
    const productId = formData.get('product_id') as string;
    const versionName = formData.get('version_name') as string;
    const file = formData.get('file') as File;

    if (!file || !productId || !versionName) return;

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${productId}_${Date.now()}.pdf`;
    const filePath = path.join(process.cwd(), 'assets', fileName);
    
    // Ensure assets dir exists
    if (!fs.existsSync(path.join(process.cwd(), 'assets'))) {
      fs.mkdirSync(path.join(process.cwd(), 'assets'));
    }
    
    fs.writeFileSync(filePath, buffer);

    const versionId = Date.now().toString();
    
    db.prepare(`
      INSERT INTO product_versions (id, product_id, version_name, file_path, status)
      VALUES (?, ?, ?, ?, 'published')
    `).run(versionId, productId, versionName, fileName);

    db.prepare('UPDATE products SET current_version_id = ? WHERE id = ?').run(versionId, productId);
    db.prepare('INSERT INTO audit_logs (actor_id, action, resource) VALUES (?, ?, ?)').run(session.id, 'PUBLISHED_VERSION', `product:${productId}`);

    revalidatePath('/admin/versions');
  }

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">Product Versioning</h1>
      
      <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">Current Products</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p.id} className="p-6 bg-neutral-950 rounded-xl border border-white/5">
              <h3 className="font-bold text-lg mb-2">{p.name}</h3>
              {p.version_name ? (
                <>
                  <p className="text-sm text-emerald-400 mb-1">Version: {p.version_name}</p>
                  <p className="text-xs text-neutral-500 font-mono break-all">{p.file_path}</p>
                </>
              ) : (
                <p className="text-sm text-neutral-500">No version published.</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">Upload New Version</h2>
        <form action={uploadVersion} className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Product</label>
            <select name="product_id" required className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors">
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Version Name (e.g. v1.1.0)</label>
            <input type="text" name="version_name" required className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors" placeholder="v1.0.0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">PDF File</label>
            <input type="file" name="file" accept="application/pdf" required className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
            Upload & Publish
          </button>
        </form>
      </div>
    </div>
  );
}
