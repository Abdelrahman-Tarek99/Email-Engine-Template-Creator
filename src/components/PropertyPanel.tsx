// components/PropertyPanel.tsx
import React from "react";
import { useEmailBuilderContext } from "../hooks/useEmailBuilder";
import type { ModuleUnion, PaddingSide } from "../types/index";

export const PropertyPanel: React.FC = () => {
  const { getSelectedModule, updateModule } = useEmailBuilderContext();
  const selectedModule = getSelectedModule();

  if (!selectedModule) {
    return (
      <div className="p-4 text-gray-500 text-center">
        Select a module to edit its properties
      </div>
    );
  }

  const handleUpdate = (updates: Partial<ModuleUnion>) => {
    updateModule(selectedModule.id, updates);
  };

  const renderProperties = () => {
    switch (selectedModule.type) {
      case "text":
        return (
          <div className="space-y-4">
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Font Size
              </label>
              <input
                type="number"
                value={selectedModule.fontSize}
                onChange={(e) =>
                  handleUpdate({ fontSize: parseInt(e.target.value) })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium mb-1">Font</label>
              <select
                value={selectedModule.fontFamily}
                onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Courier New, monospace">Courier New</option>
              </select>
            </div>

            {/* Font Weight */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Font Weight
              </label>
              <select
                value={selectedModule.fontWeight || "normal"}
                onChange={(e) => handleUpdate({ fontWeight: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="lighter">Light</option>
              </select>
            </div>

            {/* Font Style */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Font Style
              </label>
              <select
                value={selectedModule.fontStyle || "normal"}
                onChange={(e) => handleUpdate({ fontStyle: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="normal">Normal</option>
                <option value="italic">Italic</option>
              </select>
            </div>

            {/* Text Decoration */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Text Decoration
              </label>
              <select
                value={selectedModule.textDecoration || "none"}
                onChange={(e) =>
                  handleUpdate({ textDecoration: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="none">None</option>
                <option value="underline">Underline</option>
                <option value="line-through">Line-through</option>
              </select>
            </div>

            {/* Text Align */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Text Align
              </label>
              <select
                value={selectedModule.textAlign}
                onChange={(e) =>
                  handleUpdate({
                    textAlign: e.target.value as "left" | "center" | "right",
                  })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            {/* Line Height */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Line Height
              </label>
              <input
                type="number"
                step="0.1"
                value={selectedModule.lineHeight || 1.4}
                onChange={(e) =>
                  handleUpdate({ lineHeight: parseFloat(e.target.value) })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Text Color
              </label>
              <input
                type="color"
                value={selectedModule.color}
                onChange={(e) => handleUpdate({ color: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Highlight Color */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Highlight Color
              </label>
              <input
                type="color"
                value={selectedModule.highlightColor || "#ffffff"}
                onChange={(e) =>
                  handleUpdate({ highlightColor: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Background Color
              </label>
              <input
                type="color"
                value={selectedModule.backgroundColor || "#ffffff"}
                onChange={(e) =>
                  handleUpdate({ backgroundColor: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Padding */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Padding (px)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["top", "right", "bottom", "left"] as PaddingSide[]).map(
                  (side) => (
                    <input
                      key={side}
                      type="number"
                      value={selectedModule.padding?.[side] || 0}
                      onChange={(e) =>
                        handleUpdate({
                          padding: {
                            ...selectedModule.padding,
                            [side]: parseInt(e.target.value),
                          },
                        })
                      }
                      placeholder={side}
                      className="w-full border rounded px-2 py-1 text-center"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Alt Text</label>
              <input
                type="text"
                value={selectedModule.alt}
                onChange={(e) => handleUpdate({ alt: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Width</label>
              <input
                type="text"
                value={selectedModule.width}
                onChange={(e) => handleUpdate({ width: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., 100%, 400px"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Alignment
              </label>
              <select
                value={selectedModule.alignment}
                onChange={(e) =>
                  handleUpdate({
                    alignment: e.target.value as "left" | "center" | "right",
                  })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        );

      case "button":
        return (
          <div className="space-y-4">
            {/* Text */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Button Text
              </label>
              <input
                type="text"
                placeholder="Button Text"
                value={selectedModule.text}
                onChange={(e) => handleUpdate({ text: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Button URL
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={selectedModule.href}
                onChange={(e) => {
                  let url = e.target.value.trim();
                  if (url && !/^https?:\/\//i.test(url)) {
                    url = `https://${url}`;
                  }
                  handleUpdate({ href: url });
                }}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Background Color
              </label>
              <input
                type="color"
                value={selectedModule.backgroundColor}
                onChange={(e) =>
                  handleUpdate({ backgroundColor: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Width and Height */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Width</label>
                <input
                  type="text"
                  placeholder="auto or 100%"
                  value={selectedModule.width || ""}
                  onChange={(e) => handleUpdate({ width: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Height</label>
                <input
                  type="text"
                  placeholder="auto or px"
                  value={selectedModule.height || ""}
                  onChange={(e) => handleUpdate({ height: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Padding */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Padding (px)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["top", "right", "bottom", "left"] as PaddingSide[]).map(
                  (side) => (
                    <input
                      key={side}
                      type="number"
                      value={selectedModule.padding?.[side] || 0}
                      onChange={(e) =>
                        handleUpdate({
                          padding: {
                            ...selectedModule.padding,
                            [side]: parseInt(e.target.value),
                          },
                        })
                      }
                      placeholder={side}
                      className="w-full border rounded px-2 py-1 text-center"
                    />
                  )
                )}
              </div>
            </div>

            {/* Alignment */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Button Alignment
              </label>
              <select
                value={selectedModule.alignment || "left"}
                onChange={(e) =>
                  handleUpdate({
                    alignment: e.target.value as "left" | "center" | "right",
                  })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            {/* Border */}
            <div className="border-t pt-4 mt-4">
              <label className="block text-sm font-medium mb-1">
                Border Color
              </label>
              <input
                type="color"
                value={selectedModule.borderColor || "#000000"}
                onChange={(e) => handleUpdate({ borderColor: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />

              <label className="block text-sm font-medium mb-1 mt-2">
                Border Width
              </label>
              <input
                type="number"
                value={selectedModule.borderWidth || 0}
                onChange={(e) =>
                  handleUpdate({ borderWidth: parseInt(e.target.value) })
                }
                className="w-full border rounded px-3 py-2"
              />

              <label className="block text-sm font-medium mb-1 mt-2">
                Border Radius
              </label>
              <input
                type="number"
                value={selectedModule.borderRadius || 0}
                onChange={(e) =>
                  handleUpdate({ borderRadius: parseInt(e.target.value) })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Typography */}
            <div className="border-t pt-4 mt-4">
              <label className="block text-sm font-medium mb-1">Font</label>
              <select
                value={selectedModule.fontFamily || "Arial, sans-serif"}
                onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Georgia, serif">Georgia</option>
              </select>

              <label className="block text-sm font-medium mb-1 mt-2">
                Font Weight
              </label>
              <select
                value={selectedModule.fontWeight || "normal"}
                onChange={(e) => handleUpdate({ fontWeight: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>

              <label className="block text-sm font-medium mb-1 mt-2">
                Font Size
              </label>
              <input
                type="number"
                value={selectedModule.fontSize || 14}
                onChange={(e) =>
                  handleUpdate({ fontSize: parseInt(e.target.value) })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        );
      case "spacer":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Background Color
              </label>
              <input
                type="color"
                value={selectedModule.backgroundColor || "#ffffff"}
                onChange={(e) =>
                  handleUpdate({ backgroundColor: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Height (px)
              </label>
              <input
                type="number"
                value={selectedModule.height}
                onChange={(e) =>
                  handleUpdate({ height: parseInt(e.target.value) })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        );

      default:
        return <div>No properties available for this module type</div>;
    }
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Module Properties</h3>
      {renderProperties()}
    </div>
  );
};
