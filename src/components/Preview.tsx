// components/Preview.tsx
import React from "react";
import { useEmailBuilderContext } from "../hooks/useEmailBuilder";
import { EditableModule } from "./EditableModule";

export const Preview: React.FC = () => {
  const { state } = useEmailBuilderContext();

  return (
    <div className="flex-1 p-8 overflow-auto bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white shadow-lg">
        <div className="border-b p-4 bg-gray-100">
          <div className="text-sm text-gray-600">
            Subject: {state.settings.subject || "No subject"}
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
  );
};
