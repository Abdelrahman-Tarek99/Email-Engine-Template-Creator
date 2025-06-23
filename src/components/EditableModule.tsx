// components/EditableModule.tsx
import React, { useRef, useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useEmailBuilderContext } from "../hooks/useEmailBuilder";
import type { ModuleUnion, DragItem } from "../types/index";
import { sanitizeUrl } from "../utils/utils";
import { ColumnDropZone } from "./ColumnDropZone";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { IconBrandFacebook, IconBrandInstagram, IconBrandX, IconBrandPinterest, IconBrandLinkedin, IconBrandTiktok, IconGripVertical, IconTrash, IconArrowsExchange } from '@tabler/icons-react';

interface EditableModuleProps {
  module: ModuleUnion;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isPreview?: boolean;
  index?: number;
  moveModule?: (dragIndex: number, hoverIndex: number) => void;
}

export const EditableModule: React.FC<EditableModuleProps> = ({
  module,
  isSelected,
  onSelect,
  isPreview = false,
  index,
  moveModule,
}) => {
  const {
    updateModule,
    deleteModule,
    selectedModuleId,
    setSelectedModuleId,
    reorderModulesInColumn,
    swapColumns,
    openCodeEditor,
  } = useEmailBuilderContext();

  const [showSwapDropdown, setShowSwapDropdown] = useState(false);
  const [swapColumn1, setSwapColumn1] = useState(0);
  const [swapColumn2, setSwapColumn2] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSwapDropdown(false);
      }
    };

    if (showSwapDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSwapDropdown]);

  const handleUpdate = (updates: Partial<ModuleUnion>) => {
    updateModule(module.id, updates);
  };

  const handleDelete = () => {
    deleteModule(module.id);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "module",
    item: { 
      type: module.type, 
      moduleId: module.id, 
      dragType: "reorder" as const,
      dragIndex: index
    } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "module",
    hover: (item: DragItem, monitor) => {
      if (!moveModule || item.dragType !== "reorder" || item.moduleId === module.id) {
        return;
      }

      const dragIndex = item.dragIndex || 0;
      const hoverIndex = index || 0;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Only perform the move when the mouse has crossed half of the items height
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect!.bottom - hoverBoundingRect!.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect!.top;

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveModule(dragIndex, hoverIndex);
      item.dragIndex = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const ref = useRef<HTMLDivElement>(null);
  drag(drop(ref));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        handleUpdate({ src: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const renderModule = () => {
    switch (module.type) {
      case "text":
        return (
          <div
            style={{
              fontSize: module.fontSize,
              fontFamily: module.fontFamily,
              fontWeight: module.fontWeight,
              fontStyle: module.fontStyle,
              textDecoration: module.textDecoration,
              textAlign: module.textAlign,
              lineHeight: module.lineHeight,
              color: module.color,
              backgroundColor: module.backgroundColor,
              padding: `${module.padding?.top}px ${module.padding?.right}px ${module.padding?.bottom}px ${module.padding?.left}px`,
            }}
            contentEditable={!isPreview}
            suppressContentEditableWarning
            onBlur={(e) =>
              !isPreview &&
              handleUpdate({ content: e.target.textContent || "" })
            }
          >
            {module.content}
          </div>
        );

      case "image": {
        return (
          <div
            className="relative cursor-pointer"
            onClick={() => !isPreview && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <div className="w-full" style={{ textAlign: module.alignment }}>
              {module.src ? (
                <img
                  src={module.src}
                  alt={module.alt}
                  style={{ width: module.width, height: module.height }}
                  className="inline-block max-w-full"
                />
              ) : (
                <div
                  className="inline-flex h-40 bg-gray-100 border items-center justify-center text-gray-400"
                  style={{ width: module.width }}
                >
                  Click to upload image
                </div>
              )}
            </div>
          </div>
        );
      }

      case "button": {
        const isPreviewMode = isPreview;
        return (
          <div style={{ textAlign: module.alignment || "left" }}>
            <a
              href={isPreviewMode ? sanitizeUrl(module.href) : undefined}
              target={isPreviewMode ? "_blank" : undefined}
              rel={isPreviewMode ? "noopener noreferrer" : undefined}
              style={{
                backgroundColor: module.backgroundColor,
                color: module.textColor,
                padding: `${module.padding?.top || 0}px ${
                  module.padding?.right || 0
                }px ${module.padding?.bottom || 0}px ${
                  module.padding?.left || 0
                }px`,
                border: `${module.borderWidth || 0}px solid ${
                  module.borderColor || "transparent"
                }`,
                borderRadius: `${module.borderRadius || 0}px`,
                fontFamily: module.fontFamily,
                fontWeight: module.fontWeight,
                fontSize: module.fontSize,
                width: module.width || "auto",
                height: module.height || "auto",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              {module.text || "Button"}
            </a>
          </div>
        );
      }

      case "divider":
        return (
          <hr
            style={{
              height: module.height,
              backgroundColor: module.color,
              border: "none",
              borderStyle: module.style,
            }}
          />
        );

      case "spacer":
        return (
          <div
            style={{
              height: module.height,
              backgroundColor: module.backgroundColor || "transparent",
            }}
          />
        );

      case "image-text":
        return (
          <div className="flex relative group" style={{ gap: `${module.gap}px` }}>
            {/* Swap Button for Image-Text */}
            {!isPreview && module.columns.length === 2 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  swapColumns(module.id, 0, 1);
                }}
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                title="Swap image and text positions"
              >
                <IconArrowsExchange size={12} />
              </button>
            )}
            {module.columns.map((col) => (
              <div 
                key={col.id} 
                className={`flex-1 transition-all duration-200 ${
                  !isPreview && module.columns.length === 2 
                    ? 'group-hover:bg-blue-50 group-hover:border-blue-200 border border-transparent rounded p-1' 
                    : ''
                }`}
              >
                {col.modules
                  .filter((innerModule): innerModule is ModuleUnion => !!innerModule && !!innerModule.id)
                  .map((innerModule, innerIndex) => (
                    <EditableModule
                      key={innerModule.id}
                      module={innerModule}
                      isSelected={selectedModuleId === innerModule.id}
                      onSelect={setSelectedModuleId}
                      isPreview={isPreview}
                      index={innerIndex}
                      moveModule={(dragIndex, hoverIndex) => {
                        reorderModulesInColumn(
                          module.id,
                          col.id,
                          dragIndex,
                          hoverIndex
                        );
                      }}
                    />
                  ))}
              </div>
            ))}
          </div>
        );

      case "columns": {
        const layout = module.layout || "1";
        const parts = layout.split(":").map(Number);
        const totalParts = parts.reduce((a, b) => a + b, 0);
        const widths =
          totalParts > 0
            ? parts.map((p) => `${(p / totalParts) * 100}%`)
            : [];

        return (
          <div
            className="flex relative group"
            style={{
              gap: `${module.gap}px`,
              backgroundColor: module.backgroundColor,
            }}
          >
            {/* Swap Button for Columns (only show if more than 1 column) */}
            {!isPreview && module.columns.length > 1 && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                {module.columns.length === 2 ? (
                  // Simple swap for 2 columns
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      swapColumns(module.id, 0, 1);
                    }}
                    className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-600"
                    title="Swap columns"
                  >
                    <IconArrowsExchange size={12} />
                  </button>
                ) : (
                  // Dropdown for more than 2 columns
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSwapDropdown(!showSwapDropdown);
                      }}
                      className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-600"
                      title="Swap columns"
                    >
                      <IconArrowsExchange size={12} />
                    </button>
                    {showSwapDropdown && (
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg p-3 min-w-48 z-30">
                        <div className="text-sm font-medium mb-2">Swap Columns</div>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Column 1:</label>
                            <select
                              value={swapColumn1}
                              onChange={(e) => setSwapColumn1(parseInt(e.target.value))}
                              className="w-full text-xs border rounded px-2 py-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {module.columns.map((col, index) => (
                                <option key={index} value={index}>
                                  Column {index + 1} ({col.modules.length} items)
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Column 2:</label>
                            <select
                              value={swapColumn2}
                              onChange={(e) => setSwapColumn2(parseInt(e.target.value))}
                              className="w-full text-xs border rounded px-2 py-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {module.columns.map((col, index) => (
                                <option key={index} value={index}>
                                  Column {index + 1} ({col.modules.length} items)
                                </option>
                              ))}
                            </select>
                          </div>
                          {swapColumn1 === swapColumn2 && (
                            <div className="text-xs text-red-500 text-center">
                              Select different columns to swap
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (swapColumn1 !== swapColumn2) {
                                swapColumns(module.id, swapColumn1, swapColumn2);
                              }
                              setShowSwapDropdown(false);
                            }}
                            className={`w-full text-xs py-1 rounded ${
                              swapColumn1 === swapColumn2
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                            disabled={swapColumn1 === swapColumn2}
                          >
                            Swap
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {module.columns.map((col, i) => (
              <div key={col.id} style={{ flexBasis: widths[i] || "100%" }}>
                {col.modules.length > 0 ? (
                  col.modules
                    .filter((innerModule): innerModule is ModuleUnion => !!innerModule && !!innerModule.id)
                    .map((innerModule, innerIndex) => (
                      <EditableModule
                        key={innerModule.id}
                        module={innerModule}
                        isSelected={selectedModuleId === innerModule.id}
                        onSelect={setSelectedModuleId}
                        isPreview={isPreview}
                        index={innerIndex}
                        moveModule={(dragIndex, hoverIndex) => {
                          reorderModulesInColumn(
                            module.id,
                            col.id,
                            dragIndex,
                            hoverIndex
                          );
                        }}
                      />
                    ))
                ) : (
                  <ColumnDropZone
                    parentModuleId={module.id}
                    columnId={col.id}
                    className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500"
                  >
                    Add Module
                  </ColumnDropZone>
                )}
              </div>
            ))}
          </div>
        );
      }

      case "code": {
        const sanitizedCode = DOMPurify.sanitize(module.code, {
          ADD_TAGS: ["h1", "button"],
        });

        if (isPreview) {
          return <div className="browser-defaults">{parse(sanitizedCode)}</div>;
        }

        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect(module.id);
              openCodeEditor();
            }}
            className="browser-defaults p-2 rounded border border-gray-300 cursor-pointer"
          >
            {parse(sanitizedCode)}
          </div>
        );
      }

      case "social": {
        // Supported platforms and their brand colors
        const platforms = [
          { name: "facebook", Icon: IconBrandFacebook, color: "#1877F3" },
          { name: "instagram", Icon: IconBrandInstagram, color: "#E4405F" },
          { name: "x", Icon: IconBrandX, color: "#000000" },
          { name: "pinterest", Icon: IconBrandPinterest, color: "#E60023" },
          { name: "linkedin", Icon: IconBrandLinkedin, color: "#0A66C2" },
          { name: "tiktok", Icon: IconBrandTiktok, color: "#000000" },
        ];
        // Map links by platform for quick lookup
        const linksMap = Object.fromEntries((module.links || []).map(l => [l.platform, l.url]));
        return (
          <div className="flex space-x-2 items-center">
            {platforms.map(({ name, Icon, color }) => {
              const url = linksMap[name] || "";
              const isActive = !!url;
              const iconColor = isActive ? color : "#B0B0B0";
              const icon = <Icon size={28} color={iconColor} />;
              if (isActive) {
                return (
                  <a
                    key={name}
                    href={url}
                    target={isPreview ? "_blank" : undefined}
                    rel={isPreview ? "noopener noreferrer" : undefined}
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    {icon}
                  </a>
                );
              }
              return (
                <span key={name} style={{ display: "inline-flex", alignItems: "center", opacity: 0.6 }}>
                  {icon}
                </span>
              );
            })}
          </div>
        );
      }

      case "unsubscribe":
        return <div className="text-sm text-gray-600">{module.label}</div>;
      default:
        return <div>Unknown module type</div>;
    }
  };

  if (isPreview) {
    return <div className="mb-4">{renderModule()}</div>;
  }

  return (
    <div
      ref={ref}
      className={`group relative border-2 rounded p-2 cursor-pointer transition-colors ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-transparent hover:border-gray-300"
      } ${isDragging ? "opacity-50" : ""} ${
        isOver ? "border-green-400 bg-green-50" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(module.id);
      }}
    >
      {/* Drag Handle (always visible on hover) */}
      <div className="absolute top-1 left-1 text-gray-400 cursor-move opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 z-10">
        <IconGripVertical size={16} />
      </div>
      {renderModule()}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
        >
          <IconTrash size={14} />
        </button>
      )}
    </div>
  );
};
