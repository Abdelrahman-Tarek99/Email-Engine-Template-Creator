// types/index.ts
export interface Module {
  id: string;
  type: ModuleType;
  [key: string]: any;
}
export type PaddingSide = "top" | "right" | "bottom" | "left";

export interface TextModule extends Module {
  id: string;
  type: "text";
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight?: string; // e.g., bold
  fontStyle?: string; // e.g., italic
  textDecoration?: string; // underline, line-through
  textAlign: "left" | "center" | "right";
  lineHeight?: number;
  color: string;
  backgroundColor?: string;
  highlightColor?: string;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface ImageModule extends Module {
  id: string;
  type: "image";
  src: string; // base64 or URL
  alt: string;
  width: string; // e.g., "100%"
  height?: string;
  alignment?: "left" | "center" | "right";
}

export interface ButtonModule extends Module {
  id: string;
  type: "button";
  text: string;
  href: string;
  backgroundColor: string;
  textColor: string;
  width?: string; // e.g. auto, 100%
  height?: string;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  alignment?: "left" | "center" | "right";
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: number;
}

export interface DividerModule extends Module {
  type: "divider";
  height: number;
  color: string;
  style: "solid" | "dashed" | "dotted";
}

export interface SpacerModule extends Module {
  id: string;
  type: "spacer";
  height: number;
  backgroundColor?: string;
}

export type ModuleType =
  | "text"
  | "image"
  | "button"
  | "divider"
  | "spacer"
  | "image-text"
  | "columns"
  | "code"
  | "social"
  | "unsubscribe";

export interface ImageTextModule extends Module {
  type: "image-text";
  image: string;
  text: string;
}

export interface ColumnsModule extends Module {
  type: "columns";
  columns: Array<ModuleUnion>;
}

export interface CodeModule extends Module {
  type: "code";
  code: string;
  language: string;
}

export interface SocialModule extends Module {
  type: "social";
  links: { platform: string; url: string }[];
}

export interface UnsubscribeModule extends Module {
  type: "unsubscribe";
  label: string;
}

export type ModuleUnion =
  | TextModule
  | ImageModule
  | ButtonModule
  | DividerModule
  | SpacerModule
  | ImageTextModule
  | ColumnsModule
  | CodeModule
  | SocialModule
  | UnsubscribeModule;

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
export interface EmailBuilderContextType {
  state: EmailBuilderState;
  dispatch: React.Dispatch<EmailBuilderAction>;
  selectedModuleId: string | null;
  setSelectedModuleId: (id: string | null) => void;
  activeTab: "build" | "preview";
  setActiveTab: (tab: "build" | "preview") => void;
  // Add these new methods
  addModule: (type: ModuleType) => void;
  updateModule: (id: string, updates: Partial<ModuleUnion>) => void;
  deleteModule: (id: string) => void;
  updateSettings: (updates: Partial<EmailSettings>) => void;
  getSelectedModule: () => ModuleUnion | null;
}
