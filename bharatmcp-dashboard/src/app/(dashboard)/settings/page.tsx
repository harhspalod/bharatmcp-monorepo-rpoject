"use client";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-surface-900">Settings</h1>
        <p className="mt-1 text-sm text-surface-500">
          Manage your account and preferences.
        </p>
      </div>

      {/* Profile section */}
      <div className="space-y-6">
        <div className="form-section">
          <label className="mb-2 block text-sm font-semibold text-surface-900">
            Full Name
          </label>
          <input
            type="text"
            defaultValue="Harsh"
            className="w-full rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="form-section">
          <label className="mb-2 block text-sm font-semibold text-surface-900">
            Email
          </label>
          <input
            type="email"
            defaultValue="harsh@invoiceapp.com"
            className="w-full rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="form-section">
          <label className="mb-2 block text-sm font-semibold text-surface-900">
            Company Name
          </label>
          <input
            type="text"
            defaultValue="InvoiceApp"
            className="w-full rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="flex justify-end">
          <button className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow-md active:scale-[0.98]">
            Save Changes
          </button>
        </div>

        {/* Danger zone */}
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5">
          <h3 className="text-sm font-semibold text-red-800">Danger Zone</h3>
          <p className="mt-1 text-sm text-red-600">
            Permanently delete your account and all associated data.
          </p>
          <button className="mt-3 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
