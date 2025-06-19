export interface Module {
  id: string;
  type: ModuleType;
  [key: string]: any;
}

export interface TextModule extends Module {
  type: "text";
  content: string;
  fontSize: number;
  color: string;
  textAlign: "left" | "center" | "right";
  fontFamily: string;
}

export interface ImageModule extends Module {
  type: "image";
  src: string;
  alt: string;
  width: string;
  height: string;
}

export interface ButtonModule extends Module {
  type: "button";
  text: string;
  href: string;
  backgroundColor: string;
  textColor: string;
  padding: string;
  borderRadius: string;
}

export interface DividerModule extends Module {
  type: "divider";
  height: number;
  color: string;
  style: "solid" | "dashed" | "dotted";
}

export interface SpacerModule extends Module {
  type: "spacer";
  height: number;
}

export type ModuleType = "text" | "image" | "button" | "divider" | "spacer";

export type ModuleUnion =
  | TextModule
  | ImageModule
  | ButtonModule
  | DividerModule
  | SpacerModule;

export interface EmailSettings {
  subject: string;
  preheader: string;
  backgroundColor: string;
  contentWidth: number;
}

export interface EmailBuilderState {
  modules: ModuleUnion[];
  settings: EmailSettings;
}

export type EmailBuilderAction =
  | { type: "ADD_MODULE"; payload: Omit<ModuleUnion, "id"> }
  | {
      type: "UPDATE_MODULE";
      payload: { id: string; updates: Partial<ModuleUnion> };
    }
  | { type: "DELETE_MODULE"; payload: { id: string } }
  | { type: "REORDER_MODULES"; payload: ModuleUnion[] }
  | { type: "UPDATE_SETTINGS"; payload: Partial<EmailSettings> };

export interface EmailBuilderContextType {
  state: EmailBuilderState;
  dispatch: React.Dispatch<EmailBuilderAction>;
  selectedModuleId: string | null;
  setSelectedModuleId: (id: string | null) => void;
  activeTab: "build" | "preview";
  setActiveTab: (tab: "build" | "preview") => void;
}

export interface DragItem {
  type: ModuleType;
}
