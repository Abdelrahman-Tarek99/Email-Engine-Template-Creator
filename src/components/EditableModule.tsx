// components/EditableModule.tsx
import React, { useRef } from "react";
import { useEmailBuilderContext } from "../hooks/useEmailBuilder";
import type { ModuleUnion } from "../types/index";
import { sanitizeUrl } from "../utils/utils";

interface EditableModuleProps {
  module: ModuleUnion;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isPreview?: boolean;
}

export const EditableModule: React.FC<EditableModuleProps> = ({
  module,
  isSelected,
  onSelect,
  isPreview = false,
}) => {
  const { updateModule, deleteModule } = useEmailBuilderContext();

  const handleUpdate = (updates: Partial<ModuleUnion>) => {
    updateModule(module.id, updates);
  };

  const handleDelete = () => {
    deleteModule(module.id);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

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
          <div className="flex space-x-4">
            <div className="w-1/2">
              {module.image ? (
                <img src={module.image} alt="" className="w-full" />
              ) : (
                <div className="w-full h-32 bg-gray-100 border flex items-center justify-center text-gray-400">
                  Upload Image
                </div>
              )}
            </div>
            <div className="w-1/2">{module.text}</div>
          </div>
        );

      case "columns":
        return (
          <div className="flex space-x-4">
            {module.columns.map((col, i) => (
              <div className="flex-1 border p-2" key={i}>
                Column {i + 1}
              </div>
            ))}
          </div>
        );

      case "code":
        return (
          <pre className="bg-black text-white p-2 text-sm rounded">
            {module.code}
          </pre>
        );

      case "social":
        return (
          <div className="flex space-x-4">
            {module.links.map((link, i) => (
              <a href={link.url} key={i} className="text-blue-500 underline">
                {link.platform}
              </a>
            ))}
          </div>
        );

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
      className={`relative border-2 rounded p-2 cursor-pointer transition-colors ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-transparent hover:border-gray-300"
      }`}
      onClick={() => onSelect(module.id)}
    >
      {renderModule()}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
        >
          ×
        </button>
      )}
    </div>
  );
};
