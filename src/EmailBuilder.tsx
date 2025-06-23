// EmailBuilder.tsx (Main Component)
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  EmailBuilderProvider,
  useEmailBuilderContext,
} from "./hooks/useEmailBuilder";
import { ModuleLibrary } from "./components/ModuleLibrary";
import { Canvas } from "./components/Canvas";
import { Preview } from "./components/Preview";
import { PropertyPanel } from "./components/PropertyPanel";
import { CodeEditorModal } from "./components/CodeEditorModal";
import { ExportModal } from "./components/ExportModal";
import { IconDownload } from '@tabler/icons-react';

const EmailBuilderContent: React.FC = () => {
  const { activeTab, setActiveTab } = useEmailBuilderContext();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab("build")}
                className={`px-4 py-2 rounded ${
                  activeTab === "build" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Build
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-4 py-2 rounded ${
                  activeTab === "preview"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Preview
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsExportModalOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center space-x-2"
              >
                <IconDownload size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex">
          {activeTab === "build" ? (
            <>
              <ModuleLibrary />
              <Canvas />
              <div className="w-80 bg-white border-l">
                <PropertyPanel />
              </div>
            </>
          ) : (
            <Preview />
          )}
        </div>
      </div>
      <CodeEditorModal />
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
      />
    </>
  );
};

const EmailBuilder: React.FC = () => {
  return (
    <EmailBuilderProvider>
      <DndProvider backend={HTML5Backend}>
        <EmailBuilderContent />
      </DndProvider>
    </EmailBuilderProvider>
  );
};

export default EmailBuilder;
