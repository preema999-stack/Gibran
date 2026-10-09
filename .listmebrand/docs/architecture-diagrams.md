# System Architecture & Diagrams: GIBRAN & CO.

> Auto-generated Mermaid diagrams modeling system flow, user journeys, and data schemas.

## 1. System & Cloud Architecture
Architecture overview for GIBRAN & CO., connecting client interfaces to the application engine.

```mermaid
graph TD
  subgraph Client ["Client Presentation Layer"]
    Web["🖥️ Web App (Next.js 16 / React 19)"]
    Desktop["💻 Desktop App (Electron & Local IPC)"]
    CLI["⚡ CLI Analyzer (Node.js)"]
  end

  subgraph Router ["Application Router & Edge"]
    Routes["App Router (/dashboard, /brand, /console)"]
    API["API Route Handlers (/api/ai, /api/campaigns)"]
  end

  subgraph Engine ["Core Processing & AI Engine"]
    AI["🧠 Gemini 3.6 Flash Inference"]
    Operator["⚙️ Brand & Growth Operator Engine"]
    StorageAdapter["🔄 Universal Storage Adapter"]
  end

  subgraph Storage ["Persistence & Data Layer"]
    CloudDB[("☁️ Firebase Firestore / Cloud")]
    LocalDisk[("💾 Local System Storage (~/.listmebrand)")]
  end

  Client --> Routes
  Routes --> API
  API --> Engine
  StorageAdapter --> CloudDB
  StorageAdapter --> LocalDisk
  Engine --> StorageAdapter
```

---

## 2. End-to-End User Journey
User interaction flow from codebase scanning to publishing living documentation.

```mermaid
sequenceDiagram
  autonumber
  actor Founder as 👤 Founder / Developer
  participant CLI as ⚡ ListMeBrand CLI
  participant AI as 🧠 AI Growth Engine
  participant Dash as 🖥️ Web / Desktop Dashboard
  participant Live as 🌐 Public Brand Hub

  Founder->>CLI: Run 'npx listmebrand init'
  CLI->>CLI: Safe Repository Scan (Zero Secret Exposure)
  CLI->>AI: Analyze Codebase & Tech Stack
  AI-->>CLI: Return Diagrams, Prototype & 7-Day Plan
  CLI->>Dash: Sync to Workspace / Local Storage
  Founder->>Dash: Review Growth Missions
  Founder->>Dash: Customize & Click 'Publish to Web'
  Dash->>Live: Publish Instant Brand Hub (/brand/[slug])
```

---

## 3. Domain Data Models & Relationships
Core entities and relationships across the workspace.

```mermaid
classDiagram
  class Brand {
    +String slug
    +String name
    +String tagline
    +String logo
  }
  class BrandPage {
    +String id
    +String title
    +Block[] blocks
    +Boolean published
  }
  class BrandCampaign {
    +String id
    +String name
    +String status
    +Task[] tasks
  }
  class BrandItem {
    +String id
    +String type
    +Record fields
  }

  Brand "1" --> "*" BrandPage : contains
  Brand "1" --> "*" BrandCampaign : launches
  Brand "1" --> "*" BrandItem : organizes
```

