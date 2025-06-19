import React from "react";
import { useEmailBuilderContext } from "../hooks/useEmailBuilder";
import { DropZone } from "./DropZone";
import { EditableModule } from "./EditableModule";

export const Canvas: React.FC = () => {
  const { state, selectedModuleId, setSelectedModuleId, updateSettings } =
    useEmailBuilderContext();

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Email Subject"
            value={state.settings.subject}
            onChange={(e) => updateSettings({ subject: e.target.value })}
            className="w-full text-lg font-semibold border-b-2 border-gray-300 pb-2 bg-transparent focus:outline-none focus:border-blue-500"
          />
        </div>

        <DropZone>
          {state.modules.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              <div className="text-4xl mb-4">📧</div>
              <p>Drag modules here to build your email</p>
            </div>
          ) : (
            <div className="space-y-2">
              {state.modules.map((module) => (
                <EditableModule
                  key={module.id}
                  module={module}
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
