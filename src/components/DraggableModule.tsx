import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import type { ModuleType, DragItem } from "../types/index";

interface DraggableModuleProps {
  type: ModuleType;
  label: string;
  icon: React.ReactNode;
}

export const DraggableModule: React.FC<DraggableModuleProps> = ({
  type,
  label,
  icon,
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
      className="flex flex-col items-center justify-center p-4 border rounded-lg cursor-grab bg-white hover:bg-gray-50 hover:border-blue-500 transition-all"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="text-gray-600">{icon}</div>
      <div className="text-sm mt-2 text-gray-700">{label}</div>
    </div>
  );
};
