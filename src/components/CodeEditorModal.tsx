import React, { useState, useEffect } from "react";
import { useEmailBuilderContext } from "../hooks/useEmailBuilder";
import type { ModuleUnion } from "../types/index";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

type CodeModule = Extract<ModuleUnion, { type: "code" }>;

export const CodeEditorModal: React.FC = () => {
  const {
    getSelectedModule,
    updateModule,
    closeCodeEditor,
    isCodeEditorOpen,
  } = useEmailBuilderContext();

  const selectedModule = getSelectedModule() as CodeModule | null;
  const [code, setCode] = useState("");

  useEffect(() => {
    if (selectedModule && selectedModule.type === "code") {
      setCode(selectedModule.code);
    }
  }, [selectedModule]);

  const handleSave = () => {
    if (selectedModule) {
      updateModule(selectedModule.id, { code });
      closeCodeEditor();
    }
  };

  if (!isCodeEditorOpen || !selectedModule) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Edit Code</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <label className="block text-sm font-medium mb-1">Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 p-2 border rounded font-mono text-sm bg-gray-900 text-gray-100"
              spellCheck="false"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preview</label>
            <div className="browser-defaults prose w-full h-96 p-2 border rounded overflow-auto">
              {parse(
                DOMPurify.sanitize(code, {
                  ADD_TAGS: ["h1", "button"],
                })
              )}
            </div>
          </div>
        </div>
        <div className="p-4 border-t flex justify-end space-x-2">
          <button
            onClick={closeCodeEditor}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}; 