import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import type { ModuleType, DragItem } from "../types/index";

interface DraggableModuleProps {
  type: ModuleType;
  icon: string;
  label: string;
}

export const DraggableModule: React.FC<DraggableModuleProps> = ({
  type,
  icon,
  label,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: "module",
    item: { type, dragType: "new" } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);

  return (
    <div
      ref={ref}
      className={`p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-move hover:border-blue-400 transition-colors ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="text-2xl">{icon}</div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
    </div>
  );
};
