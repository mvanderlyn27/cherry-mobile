import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);

export const getThemeColor = (colorPath: string) => {
  const parts = colorPath.split(".");
  let current: any = fullConfig.theme?.colors;
  console.log("getThemeColor", current, parts, "colorPath");
  for (const part of parts) {
    if (!current?.[part]) {
      return "";
    }
    current = current[part];
  }

  return current || "";
};
