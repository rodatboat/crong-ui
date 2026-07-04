const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

export const LOGGER = {
  info: (msg: string, ...meta: unknown[]) =>
    {if (isDev) console.log("[INFO]", msg, ...meta)},

  warn: (msg: string, ...meta: unknown[]) =>
    {if (isDev) console.warn("[WARN]", msg, ...meta)},

  error: (msg: string, ...meta: unknown[]) =>
    {if (isDev) console.error("[ERROR]", msg, ...meta)},

  debug: (msg: string, ...meta: unknown[]) =>
    {if (isDev) console.debug("[DEBUG]", msg, ...meta)}
};