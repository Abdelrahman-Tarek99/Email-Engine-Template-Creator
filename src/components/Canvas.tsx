import React from "react";
import { useEmailBuilderContext } from "../hooks/useEmailBuilder";
import { DropZone } from "./DropZone";
import { EditableModule } from "./EditableModule";

export const Canvas: React.FC = () => {
  const { state, selectedModuleId, setSelectedModuleId, updateSettings, reorderModules } =
    useEmailBuilderContext();

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Subject
            </label>
            <input
              type="text"
              placeholder="Enter email subject..."
              value={state.settings.subject}
              onChange={(e) => updateSettings({ subject: e.target.value })}
              className="w-full text-lg font-semibold border-b-2 border-gray-300 pb-2 bg-transparent focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preheader Text
            </label>
            <input
              type="text"
              placeholder="Enter preheader text (appears in email preview)..."
              value={state.settings.preheader}
              onChange={(e) => updateSettings({ preheader: e.target.value })}
              className="w-full text-sm border-b-2 border-gray-300 pb-2 bg-transparent focus:outline-none focus:border-blue-500"
              maxLength={150}
            />
            <div className="text-xs text-gray-500 mt-1">
              {state.settings.preheader.length}/150 characters
            </div>
          </div>
        </div>

        <DropZone>
          {state.modules.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              <div className="text-4xl mb-4">📧</div>
              <p>Drag modules here to build your email</p>
            </div>
          ) : (
            <div className="space-y-2">
              {state.modules.map((module, index) => (
                <EditableModule
                  key={module.id}
                  module={module}
                  index={index}
                  moveModule={reorderModules}
                  isSelected={selectedModuleId === module.id}
                  onSelect={setSelectedModuleId}
                />
              ))}
            </div>
          )}
        </DropZone>
      </div>
    </div>
  );
};
