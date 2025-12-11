export namespace Flag {
  export const LEFCODE_AUTO_SHARE = truthy("LEFCODE_AUTO_SHARE")
  export const LEFCODE_CONFIG = process.env["LEFCODE_CONFIG"]
  export const LEFCODE_CONFIG_DIR = process.env["LEFCODE_CONFIG_DIR"]
  export const LEFCODE_CONFIG_CONTENT = process.env["LEFCODE_CONFIG_CONTENT"]
  export const LEFCODE_DISABLE_AUTOUPDATE = truthy("LEFCODE_DISABLE_AUTOUPDATE")
  export const LEFCODE_DISABLE_PRUNE = truthy("LEFCODE_DISABLE_PRUNE")
  export const LEFCODE_PERMISSION = process.env["LEFCODE_PERMISSION"]
  export const LEFCODE_DISABLE_DEFAULT_PLUGINS = truthy("LEFCODE_DISABLE_DEFAULT_PLUGINS")
  export const LEFCODE_DISABLE_LSP_DOWNLOAD = truthy("LEFCODE_DISABLE_LSP_DOWNLOAD")
  export const LEFCODE_ENABLE_EXPERIMENTAL_MODELS = truthy("LEFCODE_ENABLE_EXPERIMENTAL_MODELS")
  export const LEFCODE_DISABLE_AUTOCOMPACT = truthy("LEFCODE_DISABLE_AUTOCOMPACT")
  export const LEFCODE_FAKE_VCS = process.env["LEFCODE_FAKE_VCS"]

  // Experimental
  export const LEFCODE_EXPERIMENTAL = truthy("LEFCODE_EXPERIMENTAL")
  export const LEFCODE_EXPERIMENTAL_ICON_DISCOVERY =
    LEFCODE_EXPERIMENTAL || truthy("LEFCODE_EXPERIMENTAL_ICON_DISCOVERY")
  export const LEFCODE_EXPERIMENTAL_WATCHER = LEFCODE_EXPERIMENTAL || truthy("LEFCODE_EXPERIMENTAL_WATCHER")
  export const LEFCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT = truthy("LEFCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT")
  export const LEFCODE_ENABLE_EXA =
    truthy("LEFCODE_ENABLE_EXA") || LEFCODE_EXPERIMENTAL || truthy("LEFCODE_EXPERIMENTAL_EXA")
  export const LEFCODE_EXPERIMENTAL_BASH_MAX_OUTPUT_LENGTH = number("LEFCODE_EXPERIMENTAL_BASH_MAX_OUTPUT_LENGTH")
  export const LEFCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS = number("LEFCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS")

  function truthy(key: string) {
    const value = process.env[key]?.toLowerCase()
    return value === "true" || value === "1"
  }

  function number(key: string) {
    const value = process.env[key]
    if (!value) return undefined
    const parsed = Number(value)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
  }
}
