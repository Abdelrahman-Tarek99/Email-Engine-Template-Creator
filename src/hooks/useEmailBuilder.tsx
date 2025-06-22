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
  ColumnsModule,
  ImageTextModule,
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

const findAndRemoveModule = (
  modules: ModuleUnion[],
  id: string
): ModuleUnion[] => {
  const newModules = [];
  for (const module of modules) {
    if (module.id === id) {
      continue;
    }
    if (module.type === "columns" || module.type === "image-text") {
      const updatedColumns = module.columns.map((column) => ({
        ...column,
        modules: findAndRemoveModule(column.modules, id),
      }));
      newModules.push({ ...module, columns: updatedColumns });
    } else {
      newModules.push(module);
    }
  }
  return newModules;
};

const findAndUpdateModule = (
  modules: ModuleUnion[],
  id: string,
  updates: Partial<ModuleUnion>
): ModuleUnion[] => {
  return modules.map((module) => {
    if (module.id === id) {
      const updatedModule = { ...module, ...updates };

      if (
        updatedModule.type === "columns" &&
        typeof updatedModule.layout === "string" &&
        Array.isArray(updatedModule.columns)
      ) {
        const newLayout = updatedModule.layout;
        const newColumnCount = newLayout.includes(":")
          ? newLayout.split(":").length
          : parseInt(newLayout, 10);
        const currentColumnCount = updatedModule.columns.length;

        if (newColumnCount > currentColumnCount) {
          const additionalColumns = Array.from(
            { length: newColumnCount - currentColumnCount },
            () => ({ id: uuidv4(), modules: [] })
          );
          updatedModule.columns = [
            ...updatedModule.columns,
            ...additionalColumns,
          ];
        } else if (newColumnCount < currentColumnCount) {
          updatedModule.columns = updatedModule.columns.slice(
            0,
            newColumnCount
          );
        }
      }

      return updatedModule as ModuleUnion;
    }
    if (
      (module.type === "columns" || module.type === "image-text") &&
      Array.isArray(module.columns)
    ) {
      const updatedColumns = module.columns.map((column) => ({
        ...column,
        modules: findAndUpdateModule(column.modules, id, updates),
      }));
      return { ...module, columns: updatedColumns };
    }
    return module;
  });
};

const findModuleById = (
  modules: ModuleUnion[],
  id: string
): ModuleUnion | null => {
  for (const module of modules) {
    if (module.id === id) {
      return module;
    }
    if (module.type === "columns" || module.type === "image-text") {
      const found = findModuleById(module.columns.flatMap(c => c.modules), id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

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
        modules: findAndUpdateModule(
          state.modules,
          action.payload.id,
          action.payload.updates
        ),
      };
    case "DELETE_MODULE":
      return {
        ...state,
        modules: findAndRemoveModule(state.modules, action.payload.id),
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
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);

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

  const addModuleToColumn = (
    parentModuleId: string,
    columnId: string,
    moduleType: ModuleType
  ) => {
    const newModule = {
      ...(getModuleDefaults(moduleType) as ModuleUnion),
      id: uuidv4(),
    };

    const parentModule = state.modules.find(
      (m) => m.id === parentModuleId
    ) as ColumnsModule | ImageTextModule | undefined;

    if (parentModule) {
      const updatedColumns = parentModule.columns.map((c) => {
        if (c.id === columnId) {
          return { ...c, modules: [...c.modules, newModule] };
        }
        return c;
      });
      updateModule(parentModuleId, { columns: updatedColumns });
    }
  };

  const reorderModulesInColumn = (
    parentModuleId: string,
    columnId: string,
    dragIndex: number,
    hoverIndex: number
  ) => {
    const parentModule = state.modules.find(
      (m) => m.id === parentModuleId
    ) as ColumnsModule | ImageTextModule | undefined;

    if (parentModule) {
      const updatedColumns = parentModule.columns.map((c) => {
        if (c.id === columnId) {
          const newModules = [...c.modules];
          const [draggedItem] = newModules.splice(dragIndex, 1);
          newModules.splice(hoverIndex, 0, draggedItem);
          return { ...c, modules: newModules };
        }
        return c;
      });
      updateModule(parentModuleId, { columns: updatedColumns });
    }
  };

  const updateSettings = (updates: Partial<EmailBuilderState["settings"]>) => {
    dispatch({
      type: "UPDATE_SETTINGS",
      payload: updates,
    });
  };

  const getSelectedModule = () => {
    if (!selectedModuleId) return null;
    return findModuleById(state.modules, selectedModuleId);
  };

  const reorderModules = (dragIndex: number, hoverIndex: number) => {
    const newModules = [...state.modules];
    const draggedModule = newModules[dragIndex];
    newModules.splice(dragIndex, 1);
    newModules.splice(hoverIndex, 0, draggedModule);
    
    dispatch({
      type: "REORDER_MODULES",
      payload: newModules,
    });
  };

  const openCodeEditor = () => setIsCodeEditorOpen(true);
  const closeCodeEditor = () => setIsCodeEditorOpen(false);

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
    reorderModules,
    addModuleToColumn,
    reorderModulesInColumn,
    isCodeEditorOpen,
    openCodeEditor,
    closeCodeEditor,
  };
};

const getModuleDefaults = (type: ModuleType): Omit<ModuleUnion, "id"> => {
  switch (type) {
    case "text":
      return {
        type: "text",
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
      };

    case "image":
      return {
        type: "image",
        src: "", // blank by default (so user uploads it)
        alt: "Image",
        width: "100%",
        height: "auto",
        alignment: "center",
      };

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
      };

    case "divider":
      return {
        type: "divider",
        height: 1,
        color: "#cccccc",
        style: "solid" as const,
      };

    case "spacer":
      return {
        type: "spacer",
        height: 30,
        backgroundColor: "transparent",
      };

    case "image-text":
      return {
        type: "image-text",
        gap: 16,
        columns: [
          {
            id: uuidv4(),
            modules: [
              {
                ...(getModuleDefaults("image") as Omit<ImageModule, "id">),
                id: uuidv4(),
              },
            ],
          },
          {
            id: uuidv4(),
            modules: [
              {
                ...(getModuleDefaults("text") as Omit<TextModule, "id">),
                id: uuidv4(),
              },
            ],
          },
        ],
      };

    case "columns":
      return {
        type: "columns",
        columns: [
          { id: uuidv4(), modules: [] },
          { id: uuidv4(), modules: [] },
        ],
        layout: "2",
        gap: 16,
      };

    case "code":
      return {
        type: "code",
        code: "// your code here",
        language: "html",
      };

    case "social":
      return {
        type: "social",
        links: [
          { platform: "facebook", url: "" },
          { platform: "twitter", url: "" },
        ],
      };

    case "unsubscribe":
      return {
        type: "unsubscribe",
        label: "Unsubscribe - Manage Preferences",
      };

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
