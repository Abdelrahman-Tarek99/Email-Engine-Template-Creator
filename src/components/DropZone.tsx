// components/DropZone.tsx
import React from "react";
import { useDrop } from "react-dnd";
import { useEmailBuilderContext } from "../hooks/useEmailBuilder";
import type { DragItem } from "../types/index";

interface DropZoneProps {
  children: React.ReactNode;
}

export const DropZone: React.FC<DropZoneProps> = ({ children }) => {
  const { addModule } = useEmailBuilderContext();

  const [{ isOver }, drop] = useDrop({
    accept: "module",
    drop: (item: DragItem) => {
      addModule(item.type);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`min-h-96 border-2 border-dashed rounded-lg p-4 transition-colors ${
        isOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
      }`}
    >
      {children}
    </div>
  );
};
