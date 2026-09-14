# Ansible Deployment Automation Experiment

This document preserves the Ansible automation idea from the Kubernetes lab while removing environment-specific IP addresses, usernames, and credentials.

It should be read as an **automation experiment / extension**, not as proof that Ansible was a required part of the original autoscaling assignment.

## Goal

Automate the repetitive lab steps around:

1. building the `login-app` Docker image;
2. distributing it to worker nodes;
3. preparing storage;
4. applying MySQL manifests;
5. applying application manifests;
6. applying load-balancing / ingress configuration;
7. checking rollout status.

## Sanitized playbook sketch

```yaml
---
- name: Deploy login application to Kubernetes lab
  hosts: localhost
  gather_facts: false

  vars:
    app_dir: "{{ playbook_dir }}/k8s-login-app"
    worker_nodes:
      - host: "<worker-node>"
        user: "<ssh-user>"

  tasks:
    - name: Build Docker image
      ansible.builtin.shell: |
        cd {{ app_dir }}/app
        docker build -t login-app:latest .
        docker save login-app:latest > /tmp/login-app.tar
      args:
        executable: /bin/bash

    - name: Copy image to workers
      ansible.builtin.copy:
        src: /tmp/login-app.tar
        dest: /tmp/login-app.tar
      delegate_to: "{{ item.host }}"
      loop: "{{ worker_nodes }}"

    - name: Load image on workers
      ansible.builtin.shell: docker load < /tmp/login-app.tar
      delegate_to: "{{ item.host }}"
      loop: "{{ worker_nodes }}"

    - name: Apply database manifests
      ansible.builtin.shell: |
        kubectl apply -f {{ app_dir }}/k8s/mysql-secret.yaml
        kubectl apply -f {{ app_dir }}/k8s/mysql-pv.yaml
        kubectl apply -f {{ app_dir }}/k8s/mysql-pvc.yaml
        kubectl apply -f {{ app_dir }}/k8s/mysql-service.yaml
        kubectl apply -f {{ app_dir }}/k8s/mysql-deployment.yaml
      args:
        executable: /bin/bash

    - name: Wait for MySQL
      ansible.builtin.shell: >-
        kubectl wait --for=condition=ready pod -l app=mysql --timeout=180s

    - name: Apply web workload
      ansible.builtin.shell: |
        kubectl apply -f {{ app_dir }}/k8s/web-deployment-lb.yaml
        kubectl apply -f {{ app_dir }}/k8s/web-service-lb.yaml
      args:
        executable: /bin/bash

    - name: Wait for application rollout
      ansible.builtin.shell: >-
        kubectl rollout status deployment/login-app --timeout=180s
```

## Why this experiment is useful

The main learning value is not Ansible syntax itself; it is identifying which deployment steps are:

- repeatable and automatable;
- environment-specific;
- secret-sensitive;
- dependent on cluster state;
- better handled by a registry or CI/CD system in a more mature environment.

## Limitations

This is intentionally not presented as a production-grade Ansible role. Missing pieces include:

- inventory design;
- idempotent Kubernetes modules throughout;
- secret management;
- failure recovery;
- environment separation;
- automated tests;
- role/collection packaging.

## Security note

Older versions of this experiment contained lab IP addresses, usernames, and demo credentials. Those values were removed from the current branch and must never be reused from Git history.
