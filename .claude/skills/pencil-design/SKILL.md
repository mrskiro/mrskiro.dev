---
name: pencil-design
description: Best practices for working with Pencil MCP tools on .pen design files. Use when creating or editing designs in Pencil.
user-invocable: false
---

# Pencil Design Best Practices

## Setup Order

1. `get_editor_state` — understand current file and selection
2. `get_variables` — check existing design tokens
3. `set_variables` — define tokens BEFORE creating nodes (colors, spacing, etc.)
4. `batch_get` — inspect existing structure
5. `batch_design` — create/update nodes using `$token-name` references

## Design Tokens

- Always set variables first, then reference with `$variable-name` in node properties
- NEVER use `replace_all_matching_properties` to set variable references — it escapes `$` to `\$`
- Use `batch_design` `U()` to set variable references on nodes

## batch_design Rules

- Max 25 operations per call
- Every `I()`, `C()`, `R()` must have a binding name
- Bindings are only valid within the same call
- Cannot `U()` descendants of a node you just `C()`d — IDs change on copy
- Use `M(nodeId, parent, index)` to reorder — nodeId must be actual ID, not binding

## Frames and Placeholders

- Set `placeholder: true` when starting work on a frame
- Remove `placeholder: false` when done
- For new pages: create frame with placeholder first, then add content

## Layout

- Always use `find_empty_space_on_canvas` before placing new top-level frames
- `find_empty_space_on_canvas` requires `filePath` parameter — omitting causes errors
- Use `snapshot_layout` to check computed layout when debugging spacing
- Prefer `fill_container` over hardcoded widths for children
- `fit_content` for container height unless fixed viewport size needed

## Verification

- Use `get_screenshot` after changes to verify visually
- Use `batch_get` with `resolveVariables: true` to check computed values

## Image Generation (G)

- `G()` saves generated files to `images/` directory — delete manually if node is removed
- AI-generated images may not match specific pixel art or logos — use `C()` to copy user-provided images instead

## Text Nodes

- Text has no color by default — always set `fill` property (e.g. `fill: "$text-primary"`)
- Use `content` not `text` for text value
- `fontFamily` must be a specific font name — `system-ui`, `monospace` etc. are invalid. Use `Inter`, `Roboto Mono` etc.
- `textGrowth` must be set before `width`/`height` take effect
- `underline` property may not render in screenshots — note for CSS implementation

## Property Names

- Use `fill` (not `fills`) for both text and frame colors — supports variable refs like `$bg`
- Use `layout` (not `layoutMode`) — values: `vertical`, `horizontal`
- Use `gap` (not `itemSpacing`) for layout spacing
- Use `content` (not `text`) for text node content
- Check existing nodes with `batch_get` to confirm correct property names before creating new nodes

## Design Exploration

- When exploring multiple options, create variants side by side and screenshot all for comparison
- Delete rejected variants after decision to keep canvas clean

## Design Values

- All values must align to Tailwind standard scale
- Check DESIGN.md for allowed font sizes, spacing, colors before creating nodes
