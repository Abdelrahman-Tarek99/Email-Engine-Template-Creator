import {
  IconPhoto,
  IconFileText,
  IconColumns,
  IconLayout2,
  IconBox,
  IconCode,
  IconSeparator,
  IconSpace,
  IconUsers,
  IconMailOff,
} from "@tabler/icons-react";
import { DraggableModule } from "./DraggableModule";
import type { ModuleType } from "../types/index";

const modules: { type: ModuleType; label: string; icon: React.ReactNode }[] = [
  { type: "image", label: "Image", icon: <IconPhoto size={32} /> },
  { type: "text", label: "Text", icon: <IconFileText size={32} /> },
  { type: "columns", label: "Columns", icon: <IconColumns size={32} /> },
  {
    type: "image-text",
    label: "Image & Text",
    icon: <IconLayout2 size={32} />,
  },
  { type: "button", label: "Button", icon: <IconBox size={32} /> },
  { type: "code", label: "Code", icon: <IconCode size={32} /> },
  { type: "divider", label: "Divider", icon: <IconSeparator size={32} /> },
  { type: "spacer", label: "Spacer", icon: <IconSpace size={32} /> },
  { type: "social", label: "Social", icon: <IconUsers size={32} /> },
  {
    type: "unsubscribe",
    label: "Unsubscribe",
    icon: <IconMailOff size={32} />,
  },
];

export const ModuleLibrary = () => {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 mb-4 p-4 border-b">
        Add Modules
      </h3>
      <div className="grid grid-cols-2 gap-4 p-4">
        {modules.map((module) => (
          <DraggableModule
            key={module.type}
            type={module.type}
            label={module.label}
            icon={module.icon}
          />
        ))}
      </div>
    </div>
  );
};
