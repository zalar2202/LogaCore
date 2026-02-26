# LogaCore Initial Folder Structure (v0.1)

logacore/
│
├── apps/
│ ├── demo-agency-portal/
│ └── demo-ecommerce/
│
├── packages/
│ ├── core/
│ │ ├── src/
│ │ └── index.ts
│ │
│ ├── ui/
│ │ ├── components/
│ │ └── theme/
│ │
│ ├── db/
│ │ ├── migrations/
│ │ └── runner.ts
│ │
│ └── cli/
│
├── plugins/
│ ├── hello-world/
│ │ ├── src/
│ │ ├── migrations/
│ │ └── index.ts
│ │
│ ├── cms/
│ ├── invoices/
│ └── email/
│
├── docs/
│ ├── architecture.md
│ ├── plugin-authoring.md
│ └── decisions.md
│
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json

---

Guidelines:

- Core contains platform logic only.
- Plugins contain business logic.
- Apps wire plugins together.
- Docs are mandatory and updated continuously.
