import React from "react";
import { DraggableModule } from "./DraggableModule";

export const ModuleLibrary: React.FC = () => {
  return (
    <div className="w-64 bg-white border-r p-4">
      <h2 className="font-semibold mb-4">Add Modules</h2>
      <div className="grid grid-cols-2 gap-4">
        <DraggableModule type="text" icon="📝" label="Text" />
        <DraggableModule type="image" icon="🖼️" label="Image" />
        <DraggableModule type="button" icon="🔘" label="Button" />
        <DraggableModule type="divider" icon="➖" label="Divider" />
        <DraggableModule type="spacer" icon="⬜" label="Spacer" />
        <DraggableModule type="image-text" icon="🖼️📝" label="Image & Text" />
        <DraggableModule type="columns" icon="🧱" label="Columns" />
        <DraggableModule type="code" icon="</>" label="Code" />
        <DraggableModule type="social" icon="🔗" label="Social" />
        <DraggableModule type="unsubscribe" icon="📤" label="Unsubscribe" />
      </div>
    </div>
  );
};
