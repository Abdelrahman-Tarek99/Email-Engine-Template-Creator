import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { useEmailBuilderContext } from "../hooks/useEmailBuilder";
import type { DragItem } from "../types/index";

interface ColumnDropZoneProps {
  children: React.ReactNode;
  parentModuleId: string;
  columnId: string;
  className?: string;
}

export const ColumnDropZone: React.FC<ColumnDropZoneProps> = ({
  children,
  parentModuleId,
  columnId,
  className,
}) => {
  const { addModuleToColumn } = useEmailBuilderContext();
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: "module",
    drop: (item: DragItem) => {
      if (item.dragType === "new") {
        addModuleToColumn(parentModuleId, columnId, item.type);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(ref);

  return (
    <div
      ref={ref}
      className={`${className} transition-colors ${
        isOver ? "bg-blue-50" : "bg-transparent"
      }`}
    >
      {children}
    </div>
  );
}; 