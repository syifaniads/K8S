# Security Notes

## Public-repository cleanup

The historical coursework repository contained lab-specific values such as:

- private network addresses;
- demo usernames/passwords;
- database credentials;
- example dashboard access values;
- cluster-specific node identifiers.

Those values are inappropriate for a public portfolio even when they belong to a disposable lab. The current branch should use placeholders and environment-driven secrets instead.

Historical Git commits may still contain old values. They must be considered compromised and must never be reused.

## Kubernetes secrets

`k8s-login-app/k8s/mysql-secret.yaml` is retained as a teaching template only. A real deployment should not commit plaintext secret values to Git.

Better options include:

- external secret managers;
- Sealed Secrets;
- External Secrets Operator;
- CI/CD-injected Kubernetes Secrets;
- cloud workload identity where possible.

## Demo application limitations

The Node.js workload was built for infrastructure exercises, not as a production authentication service.

Security limitations in the historical implementation include:

- simple application-managed credentials;
- no production identity provider;
- no demonstrated CSRF strategy;
- no demonstrated rate limiting;
- no demonstrated TLS termination policy;
- local file upload handling;
- single-instance session assumptions;
- lab-oriented database configuration.

These limitations are intentionally documented rather than hidden.

## Container and cluster hardening

Production improvements would normally include:

- non-root containers;
- read-only root filesystem where possible;
- explicit resource requests and limits;
- NetworkPolicy;
- Pod Security Standards;
- RBAC with least privilege;
- image scanning and signed images;
- TLS and certificate automation;
- restricted ingress exposure;
- managed secret rotation;
- audit logging.

## Reporting

This repository is historical coursework rather than a supported production service. Do not report the documented lab weaknesses as active production vulnerabilities.
