// components/Preview.tsx
import React, { useState } from "react";
import { useEmailBuilderContext } from "../hooks/useEmailBuilder";
import { EditableModule } from "./EditableModule";
import { ExportModal } from "./ExportModal";
import { IconDownload } from '@tabler/icons-react';

export const Preview: React.FC = () => {
  const { state } = useEmailBuilderContext();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <div className="flex-1 p-8 overflow-auto bg-gray-50">
        <div className="max-w-2xl mx-auto bg-white shadow-lg">
          <div className="border-b p-4 bg-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm text-gray-600">
                  <strong>Subject:</strong> {state.settings.subject || "No subject"}
                </div>
                {state.settings.preheader && (
                  <div className="text-sm text-gray-500">
                    <strong>Preheader:</strong> {state.settings.preheader}
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex items-center space-x-1"
              >
                <IconDownload size={14} />
                <span>Export</span>
              </button>
            </div>
          </div>
          <div className="p-8">
            {state.modules.map((module) => (
              <EditableModule
                key={module.id}
                module={module}
                isSelected={false}
                onSelect={() => {}}
                isPreview={true}
              />
            ))}
          </div>
        </div>
      </div>
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
      />
    </>
  );
};
