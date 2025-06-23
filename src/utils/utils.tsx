import type {
  ModuleUnion,
  EmailSettings,
  TextModule,
  ImageModule,
  ButtonModule,
  DividerModule,
  SpacerModule,
  ImageTextModule,
  ColumnsModule,
  CodeModule,
  SocialModule,
  UnsubscribeModule,
  Column
} from "../types/index";
import { v4 as uuidv4 } from "uuid";

export const sanitizeUrl = (url: string): string => {
  if (!url) return "#";
  
  // Add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  
  return url;
};

// HTML Generator for Email Export
export const generateEmailHTML = (modules: ModuleUnion[], settings: EmailSettings): string => {
  const moduleHTML = modules
    .filter((module): module is ModuleUnion => !!module)
    .map(module => generateModuleHTML(module))
    .join('\n');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${settings.subject || 'Email Template'}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: ${settings.backgroundColor || '#ffffff'};
        }
        .email-container {
            max-width: ${settings.contentWidth || 600}px;
            margin: 0 auto;
            background-color: ${settings.backgroundColor || '#ffffff'};
        }
        .email-content {
            padding: 20px;
        }
        /* Responsive design */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                max-width: 100% !important;
            }
            .email-content {
                padding: 10px !important;
            }
        }
    </style>
</head>
<body>
    <div className="flex-1 min-h-0 p-8 overflow-auto bg-gray-50">
        <div class="email-container">
            <div class="email-content">
                ${moduleHTML}
            </div>
        </div>
    </div>
</body>
</html>`;
};

const generateModuleHTML = (module: ModuleUnion | undefined): string => {
  if (!module || typeof module.type !== 'string') return "";
  switch (module.type) {
    case "text":
      return generateTextHTML(module as TextModule);
    case "image":
      return generateImageHTML(module as ImageModule);
    case "button":
      return generateButtonHTML(module as ButtonModule);
    case "divider":
      return generateDividerHTML(module as DividerModule);
    case "spacer":
      return generateSpacerHTML(module as SpacerModule);
    case "image-text":
      return generateImageTextHTML(module as ImageTextModule);
    case "columns":
      return generateColumnsHTML(module as ColumnsModule);
    case "code":
      return generateCodeHTML(module as CodeModule);
    case "social":
      return generateSocialHTML(module as SocialModule);
    case "unsubscribe":
      return generateUnsubscribeHTML(module as UnsubscribeModule);
    default:
      return "";
  }
};

const generateTextHTML = (module: TextModule): string => {
  const style = `
    font-size: ${module.fontSize}px;
    font-family: ${module.fontFamily};
    font-weight: ${module.fontWeight || 'normal'};
    font-style: ${module.fontStyle || 'normal'};
    text-decoration: ${module.textDecoration || 'none'};
    text-align: ${module.textAlign};
    line-height: ${module.lineHeight || 1.4};
    color: ${module.color};
    background-color: ${module.backgroundColor || 'transparent'};
    padding: ${module.padding?.top || 0}px ${module.padding?.right || 0}px ${module.padding?.bottom || 0}px ${module.padding?.left || 0}px;
  `;
  
  return `<div style="${style}">${module.content}</div>`;
};

const generateImageHTML = (module: ImageModule): string => {
  const containerStyle = `text-align: ${module.alignment || 'center'};`;
  const imageStyle = `width: ${module.width}; height: ${module.height || 'auto'}; max-width: 100%;`;
  
  return `
    <div style="${containerStyle}">
      <img src="${module.src}" alt="${module.alt}" style="${imageStyle}" />
    </div>
  `;
};

const generateButtonHTML = (module: ButtonModule): string => {
  const buttonStyle = `
    background-color: ${module.backgroundColor};
    color: ${module.textColor};
    padding: ${module.padding?.top || 0}px ${module.padding?.right || 0}px ${module.padding?.bottom || 0}px ${module.padding?.left || 0}px;
    border: ${module.borderWidth || 0}px solid ${module.borderColor || 'transparent'};
    border-radius: ${module.borderRadius || 0}px;
    font-family: ${module.fontFamily || 'Arial, sans-serif'};
    font-weight: ${module.fontWeight || 'normal'};
    font-size: ${module.fontSize || 14}px;
    text-decoration: none;
    display: inline-block;
    width: ${module.width || 'auto'};
    height: ${module.height || 'auto'};
  `;
  
  const containerStyle = `text-align: ${module.alignment || 'left'};`;
  
  return `
    <div style="${containerStyle}">
      <a href="${sanitizeUrl(module.href)}" style="${buttonStyle}">
        ${module.text || 'Button'}
      </a>
    </div>
  `;
};

const generateDividerHTML = (module: DividerModule): string => {
  return `<hr style="height: ${module.height}px; background-color: ${module.color}; border: none; border-style: ${module.style};" />`;
};

const generateSpacerHTML = (module: SpacerModule): string => {
  return `<div style="height: ${module.height}px; background-color: ${module.backgroundColor || 'transparent'};"></div>`;
};

const generateImageTextHTML = (module: ImageTextModule): string => {
  const containerStyle = `display: flex; gap: ${module.gap}px;`;
  const columnStyle = `flex: 1;`;
  const columnsHTML = module.columns.map((col: Column) => {
    const modulesHTML = col.modules.map((innerModule: ModuleUnion) => generateModuleHTML(innerModule)).join('');
    return `<div style="${columnStyle}">${modulesHTML}</div>`;
  }).join('');
  return `<div style="${containerStyle}">${columnsHTML}</div>`;
};

const generateColumnsHTML = (module: ColumnsModule): string => {
  const layout = module.layout || "1";
  const parts = layout.split(":").map(Number);
  const totalParts = parts.reduce((a, b) => a + b, 0);
  const widths = totalParts > 0 ? parts.map((p) => `${(p / totalParts) * 100}%`) : [];
  const containerStyle = `
    display: flex;
    gap: ${module.gap}px;
    background-color: ${module.backgroundColor || 'transparent'};
  `;
  const columnsHTML = module.columns.map((col: Column, i: number) => {
    const columnStyle = `flex-basis: ${widths[i] || '100%'};`;
    const modulesHTML = col.modules.map((innerModule: ModuleUnion) => generateModuleHTML(innerModule)).join('');
    return `<div style="${columnStyle}">${modulesHTML}</div>`;
  }).join('');
  return `<div style="${containerStyle}">${columnsHTML}</div>`;
};

const generateCodeHTML = (module: CodeModule): string => {
  return module.code || '';
};

const generateSocialHTML = (module: SocialModule): string => {
  const platforms = [
    { name: "facebook", icon: "📘", color: "#1877F3" },
    { name: "instagram", icon: "📷", color: "#E4405F" },
    { name: "x", icon: "🐦", color: "#000000" },
    { name: "pinterest", icon: "📌", color: "#E60023" },
    { name: "linkedin", icon: "💼", color: "#0A66C2" },
    { name: "tiktok", icon: "🎵", color: "#000000" },
  ];
  
  const linksMap = Object.fromEntries((module.links || []).map((l: SocialModule['links'][number]) => [l.platform, l.url]));
  
  const socialLinks = platforms.map(({ name, icon, color }) => {
    const url = linksMap[name] || "";
    if (url) {
      return `<a href="${sanitizeUrl(url)}" style="display: inline-block; margin: 0 5px; text-decoration: none; color: ${color}; font-size: 24px;">${icon}</a>`;
    }
    return "";
  }).filter(Boolean).join('');
  
  return `<div style="text-align: center; padding: 20px 0;">${socialLinks}</div>`;
};

const generateUnsubscribeHTML = (module: UnsubscribeModule): string => {
  return `<div style="text-align: center; font-size: 12px; color: #666; padding: 20px 0;">${module.label}</div>`;
};

// Export functions
export const downloadHTML = (html: string, filename: string = 'email-template.html') => {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
};

export function assignIdsRecursively(module: Omit<ModuleUnion, "id"> | ModuleUnion): ModuleUnion {
  const id = uuidv4();
  if ((module.type === "columns" || module.type === "image-text") && Array.isArray(module.columns)) {
    return {
      ...module,
      id,
      columns: module.columns.map((col: Column) => ({
        ...col,
        id: uuidv4(),
        modules: col.modules.map(assignIdsRecursively),
      })),
    } as ModuleUnion;
  }
  return { ...module, id } as ModuleUnion;
}
