# Horizontal Pod Autoscaling

## Retained configuration

The repository contains an `autoscaling/v2` HorizontalPodAutoscaler at:

`k8s-login-app/k8s/login-app-hpa.yaml`

It targets `Deployment/login-app` and retains the following settings:

| Parameter | Value |
|---|---:|
| `minReplicas` | 2 |
| `maxReplicas` | 4 |
| Metric | CPU utilization |
| Target | 80% average utilization |
| Scale-up stabilization | 60 s |
| Scale-down stabilization | 300 s |

The scale-down behavior includes two policies—percentage based and pod-count based—and selects the minimum policy. This makes scale-in deliberately more conservative than scale-out.

## Control loop

```mermaid
sequenceDiagram
    participant APP as login-app Pods
    participant MS as Metrics Server
    participant HPA as HPA Controller
    participant DEP as Deployment

    APP->>MS: resource usage
    MS->>HPA: CPU metrics
    HPA->>HPA: compare observed vs target
    HPA->>DEP: update desired replica count
    DEP->>APP: create or remove Pods
```

## Why resource requests matter

CPU-utilization HPA uses utilization relative to requested CPU. For a meaningful experiment, the workload deployment should define CPU requests. The repository retains a CPU patch / workload configuration used for the autoscaling exercise.

Without resource requests, percentage-based CPU utilization can become unavailable or misleading.

## Suggested verification flow

These commands are useful for reproducing the behavior in a disposable lab:

```bash
kubectl top pods
kubectl get hpa
kubectl describe hpa login-app-hpa
kubectl get hpa -w
kubectl get pods -w
```

Generate controlled traffic against the service while watching HPA and pod state. The important evidence is not simply that pod count changes; a useful observation includes:

- current CPU metric;
- desired vs current replicas;
- how long the target remains above threshold;
- scale-up delay / stabilization;
- scale-down delay;
- whether new pods become Ready before receiving traffic.

## What can be claimed from the repository

The retained manifest is evidence that the lab configured CPU-based HPA with explicit replica bounds and stabilization behavior.

The repository does **not** currently retain a structured benchmark dataset proving a specific requests-per-second threshold, scaling latency, or throughput improvement. Those figures should not be invented for a CV or portfolio.

## Production follow-ups

For a production service, the next questions would include:

- whether CPU is the right demand signal;
- whether memory, queue depth, or application metrics are more meaningful;
- appropriate min/max replicas from capacity tests;
- PodDisruptionBudget and topology spread;
- cluster autoscaler interaction;
- startup behavior and cold-start cost;
- alerting for HPA saturation at `maxReplicas`.

These are production-readiness recommendations, not historical implementation claims.
