#!/usr/bin/env python3
"""Static integrity checks for the retained Kubernetes lab manifests.

The checks are intentionally local and deterministic. They verify portfolio
artifacts; they do not claim a live Kubernetes cluster is running in CI.
"""
from __future__ import annotations

from pathlib import Path
import sys

import yaml

ROOT = Path(__file__).resolve().parents[1]
K8S = ROOT / "k8s-login-app" / "k8s"


def load(path: Path) -> dict:
    docs = [doc for doc in yaml.safe_load_all(path.read_text(encoding="utf-8")) if doc]
    if len(docs) != 1:
        raise AssertionError(f"{path.name}: expected exactly one YAML document")
    if not isinstance(docs[0], dict):
        raise AssertionError(f"{path.name}: top-level document must be a mapping")
    return docs[0]


def env_by_name(container: dict) -> dict[str, dict]:
    return {item["name"]: item for item in container.get("env", []) if isinstance(item, dict) and "name" in item}


def main() -> int:
    yaml_files = sorted(K8S.glob("*.yaml"))
    if not yaml_files:
        raise AssertionError("no Kubernetes YAML manifests found")

    parsed = {path.name: load(path) for path in yaml_files}

    # Prevent accidental replacement of portfolio placeholders with credentials.
    for name, doc in parsed.items():
        if doc.get("kind") != "Secret":
            continue
        for key, value in (doc.get("stringData") or {}).items():
            upper = str(key).upper()
            if any(token in upper for token in ("PASSWORD", "SECRET", "TOKEN", "API_KEY")):
                text = str(value)
                if "REPLACE" not in text.upper():
                    raise AssertionError(f"{name}: secret-like key {key} must remain a placeholder")

    deployment = parsed["web-deployment.yaml"]
    if deployment.get("kind") != "Deployment" or deployment.get("metadata", {}).get("name") != "login-app":
        raise AssertionError("web-deployment.yaml must define Deployment/login-app")

    spec = deployment["spec"]
    selector = spec["selector"]["matchLabels"]
    template_labels = spec["template"]["metadata"]["labels"]
    if selector != template_labels or selector.get("app") != "login-app":
        raise AssertionError("Deployment selector/template labels have drifted")

    containers = spec["template"]["spec"].get("containers", [])
    if len(containers) != 1:
        raise AssertionError("login-app deployment should retain one application container")
    app = containers[0]
    ports = {p.get("containerPort") for p in app.get("ports", [])}
    if 3000 not in ports:
        raise AssertionError("login-app container must expose port 3000")

    for probe_name in ("livenessProbe", "readinessProbe"):
        probe = app.get(probe_name, {}).get("httpGet", {})
        if probe.get("path") != "/health" or probe.get("port") != 3000:
            raise AssertionError(f"{probe_name} must target /health on port 3000")

    env = env_by_name(app)
    if env.get("DB_HOST", {}).get("value") != "mysql":
        raise AssertionError("DB_HOST must target the mysql Service")
    for variable, secret_key in (
        ("DB_USER", "MYSQL_USER"),
        ("DB_PASSWORD", "MYSQL_PASSWORD"),
        ("DB_NAME", "MYSQL_DATABASE"),
        ("SESSION_SECRET", "SESSION_SECRET"),
    ):
        ref = env.get(variable, {}).get("valueFrom", {}).get("secretKeyRef", {})
        if ref.get("name") != "mysql-secret" or ref.get("key") != secret_key:
            raise AssertionError(f"{variable} must come from mysql-secret/{secret_key}")

    service = parsed["web-service.yaml"]
    if service.get("kind") != "Service" or service.get("metadata", {}).get("name") != "login-app":
        raise AssertionError("web-service.yaml must define Service/login-app")
    if service["spec"].get("selector") != selector:
        raise AssertionError("Service selector must match Deployment labels")
    service_ports = service["spec"].get("ports", [])
    if not service_ports or service_ports[0].get("targetPort") != 3000:
        raise AssertionError("Service must route traffic to application port 3000")

    hpa = parsed["login-app-hpa.yaml"]
    target = hpa["spec"]["scaleTargetRef"]
    if (target.get("kind"), target.get("name")) != ("Deployment", "login-app"):
        raise AssertionError("HPA must target Deployment/login-app")
    if hpa["spec"].get("minReplicas") != 2 or hpa["spec"].get("maxReplicas") != 4:
        raise AssertionError("HPA replica bounds must remain 2..4")
    metrics = hpa["spec"].get("metrics", [])
    cpu_targets = [
        metric.get("resource", {}).get("target", {}).get("averageUtilization")
        for metric in metrics
        if metric.get("resource", {}).get("name") == "cpu"
    ]
    if cpu_targets != [80]:
        raise AssertionError("HPA CPU target must remain 80% average utilization")
    behavior = hpa["spec"].get("behavior", {})
    if behavior.get("scaleUp", {}).get("stabilizationWindowSeconds") != 60:
        raise AssertionError("scale-up stabilization must remain 60 seconds")
    if behavior.get("scaleDown", {}).get("stabilizationWindowSeconds") != 300:
        raise AssertionError("scale-down stabilization must remain 300 seconds")

    print(f"Validated {len(yaml_files)} Kubernetes YAML manifests")
    print("- YAML syntax is parseable")
    print("- secret-like values remain placeholders")
    print("- Deployment, Service, probes, and Secret refs are internally consistent")
    print("- HPA target, replica bounds, CPU threshold, and stabilization are preserved")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (AssertionError, KeyError, TypeError, yaml.YAMLError) as exc:
        print(f"manifest validation failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
