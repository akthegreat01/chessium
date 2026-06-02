import React from 'react';

export const metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
        <p className="text-text-secondary">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/10 text-accent font-medium text-left">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Preferences
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-text-secondary font-medium text-left transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-text-secondary font-medium text-left transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Security
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 flex flex-col gap-6">
          <div className="bg-bg-secondary border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
              <h3 className="text-lg font-semibold text-white">Board & Pieces</h3>
              <p className="text-sm text-text-tertiary">Customize your playing experience.</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white mb-1">Sound Effects</div>
                  <div className="text-sm text-text-secondary">Play sounds when making moves and capturing.</div>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-accent cursor-pointer">
                  <div className="absolute top-1 left-7 bg-white w-4 h-4 rounded-full transition-transform"></div>
                </div>
              </div>
              <hr className="border-border" />
              <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                <div>
                  <div className="font-medium text-white mb-1">Board Theme</div>
                  <div className="text-sm text-text-secondary">Choose the colors of the chess board (Coming soon).</div>
                </div>
                <select disabled className="bg-bg-tertiary border border-border rounded-lg px-3 py-1.5 text-sm text-white">
                  <option>Standard Green</option>
                  <option>Walnut</option>
                  <option>Ocean Blue</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
              <h3 className="text-lg font-semibold text-white">Engine Settings</h3>
              <p className="text-sm text-text-tertiary">Configure the local Stockfish analysis.</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                <div>
                  <div className="font-medium text-white mb-1">Analysis Depth</div>
                  <div className="text-sm text-text-secondary">Higher depths are more accurate but take longer (Coming soon).</div>
                </div>
                <select disabled className="bg-bg-tertiary border border-border rounded-lg px-3 py-1.5 text-sm text-white">
                  <option>14</option>
                  <option>16</option>
                  <option>18</option>
                </select>
              </div>
              <hr className="border-border" />
              <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                <div>
                  <div className="font-medium text-white mb-1">Multi-PV Lines</div>
                  <div className="text-sm text-text-secondary">Number of best lines the engine will show simultaneously (Coming soon).</div>
                </div>
                <select disabled className="bg-bg-tertiary border border-border rounded-lg px-3 py-1.5 text-sm text-white">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
