<p align="center">
  <h1 align="center">LEF CODE</h1>
</p>
<p align="center">AI-powered development tool with local LLM support.</p>
<p align="center">
  <a href="https://github.com/orestislef/lefcode"><img alt="GitHub" src="https://img.shields.io/github/stars/orestislef/lefcode?style=flat-square" /></a>
</p>

---

### About

LEF CODE is a fork of OpenCode, rebranded and configured to work with a local OpenAI-compatible LLM server out of the box.

**Default Configuration:**
- Provider: LEF Local (OpenAI-compatible)
- Base URL: `http://192.168.24.211:1234/v1`
- API Key: `lef`
- Default Model: `qwen3-30b-a3b`

### Installation

```bash
# Clone the repository
git clone https://github.com/orestislef/lefcode.git
cd lefcode

# Install dependencies
bun install

# Build for your platform
cd packages/opencode
bun run build --single
```

### Running

After building, the binary will be in `packages/opencode/dist/lefcode-<platform>-<arch>/bin/lefcode`

```bash
# Run directly
./packages/opencode/dist/lefcode-windows-x64/bin/lefcode.exe

# Or add to your PATH
```

### Agents

LEF CODE includes two built-in agents you can switch between using the `Tab` key:

- **build** - Default, full access agent for development work
- **plan** - Read-only agent for analysis and code exploration
  - Denies file edits by default
  - Asks permission before running bash commands
  - Ideal for exploring unfamiliar codebases or planning changes

### Custom Configuration

You can customize LEF CODE by creating a `lefcode.json` or `lefcode.jsonc` file in:
- `~/.config/lefcode/` (global config)
- `.lefcode/` directory in your project (project-specific config)

Example configuration to add or modify providers:

```json
{
  "provider": {
    "my-provider": {
      "name": "My Custom Provider",
      "api": "http://localhost:8080/v1",
      "npm": "@ai-sdk/openai-compatible",
      "models": {
        "my-model": {
          "name": "My Model",
          "limit": {
            "context": 32768,
            "output": 4096
          }
        }
      },
      "options": {
        "apiKey": "your-key",
        "baseURL": "http://localhost:8080/v1"
      }
    }
  },
  "model": "my-provider/my-model"
}
```

### Credits

Based on [OpenCode](https://github.com/sst/opencode) by SST.

### License

MIT
