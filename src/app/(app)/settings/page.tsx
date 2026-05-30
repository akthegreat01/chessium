import React from "react";
import { Settings, Bell, Shield, Key, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-8 max-w-[800px] mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Settings
        </h1>
        <p className="text-secondary-foreground text-[15px]">Manage your account preferences and configurations.</p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Account Section */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-[14px] font-semibold mb-6 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" /> Account Security
          </h2>
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[14px] font-medium mb-1">Email Address</div>
                <div className="text-[12px] text-secondary-foreground">Update the email address associated with your account.</div>
              </div>
              <Button variant="outline" className="h-8 rounded text-[12px] border-border hover:bg-white/5">Update</Button>
            </div>
            <div className="h-px w-full bg-border" />
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[14px] font-medium mb-1">Password</div>
                <div className="text-[12px] text-secondary-foreground">Change your password or reset it.</div>
              </div>
              <Button variant="outline" className="h-8 rounded text-[12px] border-border hover:bg-white/5">Change</Button>
            </div>
            <div className="h-px w-full bg-border" />
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[14px] font-medium mb-1 text-destructive">Delete Account</div>
                <div className="text-[12px] text-secondary-foreground">Permanently delete your account and all data.</div>
              </div>
              <Button variant="outline" className="h-8 rounded text-[12px] border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive">Delete</Button>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-[14px] font-semibold mb-6 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-primary" /> Preferences
          </h2>
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[14px] font-medium mb-1">Board Theme</div>
                <div className="text-[12px] text-secondary-foreground">Change the visual appearance of the chessboard.</div>
              </div>
              <Button variant="outline" className="h-8 rounded text-[12px] border-border hover:bg-white/5">Customize</Button>
            </div>
            <div className="h-px w-full bg-border" />
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[14px] font-medium mb-1">Notifications</div>
                <div className="text-[12px] text-secondary-foreground">Manage email and push notifications.</div>
              </div>
              <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-background rounded-full absolute top-1 right-1" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
