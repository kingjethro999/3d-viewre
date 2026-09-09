"use client";

import { useViewerStore } from "@/app/store/viewer-store";
import { LandingPage } from "@/app/components/landing/landing-page";
import { ViewerViewport } from "@/app/components/viewer/viewer-viewport";
import { ScreenDropZone } from "@/app/components/dropzone/screen-dropzone";
import { CommandPalette } from "@/app/components/modals/command-palette";
import { KeyboardHelpModal } from "@/app/components/modals/keyboard-help-modal";
import { KeyboardListener } from "@/app/components/viewer/keyboard-listener";
import { GlobalFileInput } from "@/app/components/dropzone/global-file-input";

export default function Home() {
  const { currentView } = useViewerStore();

  return (
    <main className="w-full min-h-screen bg-[#090a0f] text-[#f8fafc]">
      {/* Persistent Hidden File Input for Native File Picker */}
      <GlobalFileInput />

      {/* View routing: Landing or 3D Viewer */}
      {currentView === "viewer" ? <ViewerViewport /> : <LandingPage />}

      {/* Global Modals & Overlays */}
      <ScreenDropZone />
      <CommandPalette />
      <KeyboardHelpModal />
      <KeyboardListener />
    </main>
  );
}
