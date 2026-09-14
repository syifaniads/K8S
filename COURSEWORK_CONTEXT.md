# Coursework Context

## Assignment provenance

This repository is connected to FILKOM Universitas Brawijaya DevOps / infrastructure coursework from May 2026.

The **Autoscaling K8S** assignment required students to work in groups of up to four, complete a worksheet, follow lecturer-provided Kubernetes material, document the work, and submit a PDF individually.

The referenced lecturer material included:

- `https://github.com/Widhi-yahya/kubernetes_installation_docker/blob/master/LB_DEPLOYMENT.md`

## Group

This coursework was completed by a three-person team:

1. **Syifani Adillah Salsabila** — 235150207111052 — **Group Lead / Ketua Kelompok**
2. Latifa Anggia Fitriana — 235150201111062
3. Jonathan Salim — 235150207111065

Syifani coordinated the group as **Ketua Kelompok** while also participating in the technical lab work and documentation.

## Broader course sequence

The same course sequence also included:

- **Autoscaling K8S** — due 7 May 2026;
- **IaC - Terraform** — due 14 May 2026;
- **Otomasi proses kerja pengembangan dan operasi** — due 28 May 2026, using a FILKOM-hosted CI/CD pipeline module.

Those later tasks help explain the progression from Kubernetes infrastructure exercises into the separate Jenkins/Docker/AWS project preserved in `syifaniads/AutomationServices`.

## Attribution rule

Because the Kubernetes assignment explicitly instructed students to follow lecturer-provided material, this repository does **not** present generic installation steps or tutorial prose as original authorship.

The portfolio instead highlights what can be inspected directly in the retained repository:

- Kubernetes manifests;
- HPA policy;
- workload and database deployment;
- services and ingress configuration;
- readiness/liveness probes;
- metrics-server setup;
- persistence configuration;
- troubleshooting notes;
- automation experiments;
- team coordination and implementation context.

## Why the original README was replaced

The historical README largely reproduced Kubernetes installation instructions and contained environment-specific sample values. That format was useful during coursework but weak as a public engineering portfolio because it did not distinguish tutorial material from implementation evidence.

The current README is therefore an evidence-oriented case study. Git history still preserves the earlier coursework state for provenance.

## Terraform note

The course sequence also included a Terraform worksheet. No `.tf` source or retained Terraform implementation has yet been verified in the accessible GitHub repositories.

Accordingly, this repository does not claim Terraform implementation. If the original PDF, GitLab repository, or Terraform files are recovered later, they should be documented as a separate IaC lab rather than retroactively inserted into this Kubernetes project.

## Related portfolio project

The later CI/CD coursework is curated separately in:

`https://github.com/syifaniads/AutomationServices`

That repository preserves Jenkins, Docker, Docker Hub, AWS EC2 deployment, and the associated room-booking application context.
