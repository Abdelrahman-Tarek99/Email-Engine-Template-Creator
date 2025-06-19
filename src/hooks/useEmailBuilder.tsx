import { useReducer, useState, createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import type {
  EmailBuilderState,
  EmailBuilderAction,
  EmailBuilderContextType,
  ModuleUnion,
  ModuleType,
  ImageModule,
  TextModule,
  ButtonModule,
  DividerModule,
  SpacerModule,
  ImageTextModule,
  ColumnsModule,
  CodeModule,
  SocialModule,
  UnsubscribeModule,
} from "../types/index";

const EmailBuilderContext = createContext<EmailBuilderContextType | undefined>(
  undefined
);

const initialState: EmailBuilderState = {
  modules: [],
  settings: {
    subject: "",
    preheader: "",
    backgroundColor: "#ffffff",
    contentWidth: 600,
  },
};

const templateReducer = (
  state: EmailBuilderState,
  action: EmailBuilderAction
): EmailBuilderState => {
  switch (action.type) {
    case "ADD_MODULE":
      return {
        ...state,
        modules: [
          ...state.modules,
          { ...action.payload, id: uuidv4() } as ModuleUnion,
        ],
      };
    case "UPDATE_MODULE":
      return {
        ...state,
        modules: state.modules.map((module) =>
          module.id === action.payload.id
            ? ({ ...module, ...action.payload.updates } as ModuleUnion)
            : module
        ),
      };
    case "DELETE_MODULE":
      return {
        ...state,
        modules: state.modules.filter(
          (module) => module.id !== action.payload.id
        ),
      };
    case "REORDER_MODULES":
      return {
        ...state,
        modules: action.payload,
      };
    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    default:
      return state;
  }
};

export const useEmailBuilder = () => {
  const [state, dispatch] = useReducer(templateReducer, initialState);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"build" | "preview">("build");

  const addModule = (type: ModuleType) => {
    const moduleDefaults = getModuleDefaults(type);
    dispatch({
      type: "ADD_MODULE",
      payload: moduleDefaults,
    });
  };

  const updateModule = (id: string, updates: Partial<ModuleUnion>) => {
    dispatch({
      type: "UPDATE_MODULE",
      payload: { id, updates },
    });
  };

  const deleteModule = (id: string) => {
    dispatch({
      type: "DELETE_MODULE",
      payload: { id },
    });
    if (selectedModuleId === id) {
      setSelectedModuleId(null);
    }
  };

  const updateSettings = (updates: Partial<EmailBuilderState["settings"]>) => {
    dispatch({
      type: "UPDATE_SETTINGS",
      payload: updates,
    });
  };

  const getSelectedModule = () => {
    return state.modules.find((m) => m.id === selectedModuleId) || null;
  };

  return {
    state,
    dispatch,
    selectedModuleId,
    setSelectedModuleId,
    activeTab,
    setActiveTab,
    addModule,
    updateModule,
    deleteModule,
    updateSettings,
    getSelectedModule,
  };
};

const getModuleDefaults = (type: ModuleType): Omit<ModuleUnion, "id"> => {
  switch (type) {
    case "text":
      return {
        type: "text",
        id: uuidv4(),
        content: "Enter your text here...",
        fontSize: 16,
        fontFamily: "Arial, sans-serif",
        textAlign: "left",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        lineHeight: 1.4,
        color: "#000000",
        backgroundColor: "#ffffff",
        highlightColor: "#ffffff",
        padding: { top: 18, right: 0, bottom: 18, left: 0 },
      } as TextModule;

    case "image":
      return {
        type: "image",
        src: "", // blank by default (so user uploads it)
        alt: "Image",
        width: "100%",
        height: "auto",
        alignment: "center",
      } as ImageModule;

    case "button":
      return {
        type: "button",
        text: "",
        href: "",
        backgroundColor: "#007bff",
        textColor: "#ffffff",
        width: "auto",
        height: "auto",
        padding: {
          top: 12,
          right: 24,
          bottom: 12,
          left: 24,
        },
        alignment: "left",
        borderColor: "#007bff",
        borderWidth: 0,
        borderRadius: 4,
        fontFamily: "Arial, sans-serif",
        fontWeight: "normal",
        fontSize: 14,
      } as ButtonModule;

    case "divider":
      return {
        type: "divider",
        height: 1,
        color: "#cccccc",
        style: "solid" as const,
      } as DividerModule;

    case "spacer":
      return {
        type: "spacer",
        height: 30,
        backgroundColor: "transparent",
      } as SpacerModule;

    case "image-text":
      return {
        type: "image-text",
        image: "",
        text: "Your caption or content...",
      } as ImageTextModule;

    case "columns":
      return {
        type: "columns",
        columns: [] as ModuleUnion[],
      } as ColumnsModule;

    case "code":
      return {
        type: "code",
        code: "// your code here",
        language: "html",
      } as CodeModule;

    case "social":
      return {
        type: "social",
        links: [
          { platform: "facebook", url: "" },
          { platform: "twitter", url: "" },
        ],
      } as SocialModule;

    case "unsubscribe":
      return {
        type: "unsubscribe",
        label: "Unsubscribe - Manage Preferences",
      } as UnsubscribeModule;

    default:
      throw new Error(`Unknown module type: ${type}`);
  }
};

export const EmailBuilderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const emailBuilder = useEmailBuilder();

  return (
    <EmailBuilderContext.Provider value={emailBuilder}>
      {children}
    </EmailBuilderContext.Provider>
  );
};

export const useEmailBuilderContext = () => {
  const context = useContext(EmailBuilderContext);
  if (context === undefined) {
    throw new Error(
      "useEmailBuilderContext must be used within an EmailBuilderProvider"
    );
  }
  return context;
};
