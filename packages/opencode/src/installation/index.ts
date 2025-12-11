import { BusEvent } from "@/bus/bus-event"
import { Bus } from "@/bus"
import path from "path"
import { $ } from "bun"
import z from "zod"
import { NamedError } from "@lefcode/util/error"
import { Log } from "../util/log"
import { iife } from "@/util/iife"

declare global {
  const LEFCODE_VERSION: string
  const LEFCODE_CHANNEL: string
}

export namespace Installation {
  const log = Log.create({ service: "installation" })

  export type Method = Awaited<ReturnType<typeof method>>

  export const Event = {
    Updated: BusEvent.define(
      "installation.updated",
      z.object({
        version: z.string(),
      }),
    ),
    UpdateAvailable: BusEvent.define(
      "installation.update-available",
      z.object({
        version: z.string(),
      }),
    ),
  }

  export const Info = z
    .object({
      version: z.string(),
      latest: z.string(),
    })
    .meta({
      ref: "InstallationInfo",
    })
  export type Info = z.infer<typeof Info>

  export async function info() {
    return {
      version: VERSION,
      latest: await latest(),
    }
  }

  export function isPreview() {
    return CHANNEL !== "latest"
  }

  export function isLocal() {
    return CHANNEL === "local"
  }

  export async function method() {
    if (process.execPath.includes(path.join(".lefcode", "bin"))) return "curl"
    if (process.execPath.includes(path.join(".local", "bin"))) return "curl"
    const exec = process.execPath.toLowerCase()

    const checks = [
      {
        name: "npm" as const,
        command: () => $`npm list -g --depth=0`.throws(false).text(),
      },
      {
        name: "yarn" as const,
        command: () => $`yarn global list`.throws(false).text(),
      },
      {
        name: "pnpm" as const,
        command: () => $`pnpm list -g --depth=0`.throws(false).text(),
      },
      {
        name: "bun" as const,
        command: () => $`bun pm ls -g`.throws(false).text(),
      },
    ]

    checks.sort((a, b) => {
      const aMatches = exec.includes(a.name)
      const bMatches = exec.includes(b.name)
      if (aMatches && !bMatches) return -1
      if (!aMatches && bMatches) return 1
      return 0
    })

    for (const check of checks) {
      const output = await check.command()
      if (output.includes("lefcode")) {
        return check.name
      }
    }

    return "unknown"
  }

  export const UpgradeFailedError = NamedError.create(
    "UpgradeFailedError",
    z.object({
      stderr: z.string(),
    }),
  )

  export async function upgrade(method: Method, target: string) {
    let cmd
    switch (method) {
      case "curl":
        cmd = $`echo "Manual installation required for LEF CODE"`.env({
          ...process.env,
          VERSION: target,
        })
        break
      case "npm":
        cmd = $`npm install -g lefcode@${target}`
        break
      case "pnpm":
        cmd = $`pnpm install -g lefcode@${target}`
        break
      case "bun":
        cmd = $`bun install -g lefcode@${target}`
        break
      default:
        throw new Error(`Unknown method: ${method}`)
    }
    const result = await cmd.quiet().throws(false)
    log.info("upgraded", {
      method,
      target,
      stdout: result.stdout.toString(),
      stderr: result.stderr.toString(),
    })
    if (result.exitCode !== 0)
      throw new UpgradeFailedError({
        stderr: result.stderr.toString("utf8"),
      })
  }

  export const VERSION = typeof LEFCODE_VERSION === "string" ? LEFCODE_VERSION : "local"
  export const CHANNEL = typeof LEFCODE_CHANNEL === "string" ? LEFCODE_CHANNEL : "local"
  export const USER_AGENT = `lefcode/${CHANNEL}/${VERSION}`

  export async function latest(installMethod?: Method) {
    const detectedMethod = installMethod || (await method())

    const registry = await iife(async () => {
      const r = (await $`npm config get registry`.quiet().nothrow().text()).trim()
      const reg = r || "https://registry.npmjs.org"
      return reg.endsWith("/") ? reg.slice(0, -1) : reg
    })
    const [major] = VERSION.split(".").map((x) => Number(x))
    const channel = CHANNEL
    return fetch(`${registry}/lefcode/${channel}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then((data: any) => data.version)
      .catch(() => VERSION) // Return current version if registry fetch fails
  }
}
