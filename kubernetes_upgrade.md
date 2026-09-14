# Kubernetes Upgrade Notes — Archived Coursework Reference

This file originally contained a generic, exam-oriented Kubernetes upgrade walkthrough targeting Kubernetes **v1.20.4**.

It is retained only as historical coursework context. It is **not** part of the recruiter-facing autoscaling implementation and should not be used as a current cluster-upgrade runbook.

Kubernetes upgrade procedures are version-sensitive. For any real cluster, use the official documentation for the exact source and target versions:

https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/

## Why the old commands were removed from the current branch

The historical document:

- targeted an old Kubernetes release;
- used example node names from generic training material;
- was explicitly written from an exam/tutorial perspective;
- could be misleading if copied into a modern environment.

Git history preserves the original coursework text if provenance is required.

## General upgrade concepts retained from the exercise

A kubeadm-based upgrade normally requires version-specific planning around:

1. control-plane compatibility;
2. `kubeadm` upgrade planning;
3. draining nodes before kubelet changes;
4. upgrading control-plane nodes before workers according to supported skew rules;
5. upgrading `kubelet` / `kubectl` at supported versions;
6. validating workloads and cluster health;
7. uncordoning nodes after successful verification;
8. avoiding simultaneous worker disruption when availability matters.

Those concepts are useful, but the exact commands must come from current Kubernetes documentation rather than this archived lab.
