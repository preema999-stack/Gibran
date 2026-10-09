# Product Prototype & Wireframe Specifications: GIBRAN & CO.

> Structural UI layouts, screen interactions, and route component maps.

## Screen 1: Landing & Public Showcase (`/`)

- **User Goal**: Communicate value proposition and convert visitors into active workspace users.
- **Components**: Nav Header, Hero Headline, CLI Quick-Start Terminal, Interactive Feature Cards, Public Brand Directory
- **Interactions**:
  - Clicking 'Launch App' opens /dashboard with local-first storage
  - Terminal command copies 'npx listmebrand init' to clipboard

### Visual Layout Wireframe
```
+--------------------------------------------------+
| [★ GIBRAN & CO.]       Features   Docs   [ Launch App ] |
+--------------------------------------------------+
|                                                  |
|     GIBRAN & CO.                             |
|     Build, manage, and share your brand. |
|                                                  |
|     $ npx listmebrand init    [ Copy ]           |
|                                                  |
|  +--------------------+  +--------------------+  |
|  | Living Wiki Docs   |  | Growth Missions    |  |
|  | Instant sync       |  | Investor-ready     |  |
|  +--------------------+  +--------------------+  |
+--------------------------------------------------+
```

---

## Screen 2: Command Hub & Workspace Overview (`/dashboard`)

- **User Goal**: Central command center managing pages, brand items, growth sprints, and live documents.
- **Components**: Left Sidebar Rail, Storage Mode Switcher, Metrics Overview, Recent Documents, Quick Capture Bar
- **Interactions**:
  - Sidebar navigation switches between Pages, Tasks, and Growth
  - Storage mode switcher toggles between Local Disk and Firebase Cloud
  - Clicking 'Publish' commits local documents to live web

### Visual Layout Wireframe
```
+----------+---------------------------------------+
| [GIBR]    | Dashboard / Central Workspace         |
|          +---------------------------------------+
| • Home   | [ 🖥️ Local Storage Mode ]  [ Publish ] |
| • Pages  |                                       |
| • Tasks  | 📊 SPRINT PROGRESS                    |
| • Growth | [██████████░░░░] 65% (4/7 days done)  |
| • Brand  |                                       |
|          | 📄 RECENT DOCUMENTS                   |
| [Settings| - Product Architecture & Spec         |
| [SignOut]| - Product Roadmap                    |
+----------+---------------------------------------+
```

---

## Screen 3: Living Document & Canvas Studio (`/dashboard/pages/[id]`)

- **User Goal**: Rich Notion-style block editing for technical specifications, wireframes, and databases.
- **Components**: Top Nav Breadcrumb, Block Palette (/), Interactive Canvas, Live Preview Toggle
- **Interactions**:
  - Typing '/' triggers the block menu for Mermaid, wireframes, and embeds
  - Automatic auto-save to local disk (~/.listmebrand)

### Visual Layout Wireframe
```
+--------------------------------------------------+
| <- Back   Workspace / Architecture Doc   [ Share ]|
+--------------------------------------------------+
|                                                  |
|  # System Architecture Overview                  |
|                                                  |
|  ```mermaid                                      |
|  graph TD                                        |
|    Client --> API --> Database                   |
|  ```                                             |
|                                                  |
|  Type '/' to insert blocks, wireframes, or AI... |
+--------------------------------------------------+
```


