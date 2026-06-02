"use client";

import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const { settings, updateSetting, resetSettings } = useSettings();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState('preferences');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
        <p className="text-[#a0a0a8]">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left transition-colors ${activeTab === 'preferences' ? 'bg-[#81b64c]/10 text-[#81b64c]' : 'text-[#a0a0a8] hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Preferences
          </button>
          <button 
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left transition-colors ${activeTab === 'account' ? 'bg-[#81b64c]/10 text-[#81b64c]' : 'text-[#a0a0a8] hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 flex flex-col gap-6">
          {activeTab === 'preferences' && (
            <>
              <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl overflow-hidden shadow-elevated">
                <div className="px-6 py-5 border-b border-[#2a2a30]">
                  <h3 className="text-lg font-semibold text-white">Board & Pieces</h3>
                  <p className="text-sm text-[#a0a0a8]">Customize your playing experience.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white mb-1">Sound Effects</div>
                      <div className="text-sm text-[#a0a0a8]">Play sounds when making moves and capturing.</div>
                    </div>
                    <button 
                      onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                      className={`relative inline-block w-12 h-6 rounded-full transition-colors ${settings.soundEnabled ? 'bg-[#81b64c]' : 'bg-[#2a2a30]'}`}
                    >
                      <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.soundEnabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
                    </button>
                  </div>
                  
                  <hr className="border-[#2a2a30]" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white mb-1">Move Animations</div>
                      <div className="text-sm text-[#a0a0a8]">Smoothly animate pieces when moving.</div>
                    </div>
                    <button 
                      onClick={() => updateSetting('moveAnimation', !settings.moveAnimation)}
                      className={`relative inline-block w-12 h-6 rounded-full transition-colors ${settings.moveAnimation ? 'bg-[#81b64c]' : 'bg-[#2a2a30]'}`}
                    >
                      <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.moveAnimation ? 'translate-x-7' : 'translate-x-1'}`}></div>
                    </button>
                  </div>
                  
                  <hr className="border-[#2a2a30]" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-white mb-1">Board Theme</div>
                      <div className="text-sm text-[#a0a0a8]">Choose the colors of the chess board.</div>
                    </div>
                    <select 
                      value={settings.boardTheme}
                      onChange={(e) => updateSetting('boardTheme', e.target.value as any)}
                      className="bg-[#0a0a0b] border border-[#2a2a30] rounded-lg px-3 py-2 text-sm text-white focus:border-[#81b64c] outline-none"
                    >
                      <option value="green">Standard Green</option>
                      <option value="walnut">Walnut (Wood)</option>
                      <option value="ocean">Ocean Blue</option>
                    </select>
                  </div>
                  
                  <hr className="border-[#2a2a30]" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-white mb-1">Piece Set</div>
                      <div className="text-sm text-[#a0a0a8]">Choose the style of the chess pieces.</div>
                    </div>
                    <select 
                      value={settings.pieceSet}
                      onChange={(e) => updateSetting('pieceSet', e.target.value as any)}
                      className="bg-[#0a0a0b] border border-[#2a2a30] rounded-lg px-3 py-2 text-sm text-white focus:border-[#81b64c] outline-none"
                    >
                      <option value="classic">Classic (Neo)</option>
                      <option value="modern">Modern</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl overflow-hidden shadow-elevated">
                <div className="px-6 py-5 border-b border-[#2a2a30]">
                  <h3 className="text-lg font-semibold text-white">Engine Settings</h3>
                  <p className="text-sm text-[#a0a0a8]">Configure the local Stockfish analysis.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-white mb-1">Analysis Depth</div>
                      <div className="text-sm text-[#a0a0a8]">Higher depths are more accurate but use more battery.</div>
                    </div>
                    <select 
                      value={settings.analysisDepth.toString()}
                      onChange={(e) => updateSetting('analysisDepth', parseInt(e.target.value))}
                      className="bg-[#0a0a0b] border border-[#2a2a30] rounded-lg px-3 py-2 text-sm text-white focus:border-[#81b64c] outline-none"
                    >
                      <option value="12">12 (Fastest)</option>
                      <option value="14">14 (Balanced)</option>
                      <option value="16">16 (Deep)</option>
                      <option value="18">18 (Slow)</option>
                      <option value="20">20 (Very Slow)</option>
                    </select>
                  </div>
                  <hr className="border-[#2a2a30]" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-white mb-1">Multi-PV Lines</div>
                      <div className="text-sm text-[#a0a0a8]">Number of best lines the engine will show simultaneously.</div>
                    </div>
                    <select 
                      value={settings.multiPv.toString()}
                      onChange={(e) => updateSetting('multiPv', parseInt(e.target.value))}
                      className="bg-[#0a0a0b] border border-[#2a2a30] rounded-lg px-3 py-2 text-sm text-white focus:border-[#81b64c] outline-none"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={resetSettings}
                  className="text-[#a0a0a8] hover:text-white text-sm font-medium transition-colors"
                >
                  Reset all settings to default
                </button>
              </div>
            </>
          )}

          {activeTab === 'account' && (
            <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl overflow-hidden shadow-elevated">
              <div className="px-6 py-5 border-b border-[#2a2a30]">
                <h3 className="text-lg font-semibold text-white">Account Management</h3>
                <p className="text-sm text-[#a0a0a8]">Manage your active sessions and data.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <button 
                    onClick={handleLogout}
                    className="bg-[#2a2a30] hover:bg-[#3a3a42] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Log Out
                  </button>
                  <p className="text-xs text-[#a0a0a8] mt-2">Log out of your current session on this device.</p>
                </div>
                
                <hr className="border-[#2a2a30]" />
                
                <div>
                  <button 
                    className="bg-[#ca3431]/10 text-[#ca3431] hover:bg-[#ca3431]/20 border border-[#ca3431]/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Delete Account
                  </button>
                  <p className="text-xs text-[#a0a0a8] mt-2">Permanently delete your account and all associated data. This action cannot be undone.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
