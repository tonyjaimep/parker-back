#!/bin/bash

# Exit on any error
set -e

# Variables
ISTIO_VERSION="latest"
YAML_FOLDER="./k8s/deploy"
NAMESPACE="default"

# Step 1: Start Minikube with sufficient resources
echo "🚀 Starting Minikube..."
minikube stop || true
minikube start

# Step 2: Check for existing Istio or download
echo "🔍 Checking for Istio... "
if ls istio-* >/dev/null 2>&1; then
    echo "✅ Istio found in $ISTIO_DIR, skipping download... "
else
    echo "📥 Downloading Istio $ISTIO_VERSION..."
    curl -L https://istio.io/downloadIstio | ISTIO_VERSION=$ISTIO_VERSION sh -
fi

ISTIO_DIR=$(ls -d istio-* | head -n 1)

# Step 3: Set Istio PATH
echo "🛠️ Setting PATH for istioctl in $ISTIO_DIR..."
export PATH=$PWD/$ISTIO_DIR/bin:$PATH

# Step 4: Verify istioctl
echo "🔍 Verifying istioctl..."
istioctl version --remote=false

# Step 5: Install Istio with minimal profile
echo "🌐 Installing Istio with minimal profile..."
istioctl install --set profile=minimal -y

# Step 6: Enable sidecar injection in default namespace
echo  "🔧 Enabling sidecar injection in $NAMESPACE namespace..."
kubectl label namespace $NAMESPACE istio-injection=enabled --overwrite

# Step 7: Install Kiali and Grafana add-ons
echo "📊 Installing Kiali and Grafana..."
kubectl apply -f $ISTIO_DIR/samples/addons/kiali.yaml
kubectl apply -f $ISTIO_DIR/samples/addons/grafana.yaml

# Step 8: Wait for Istio and add-ons to be ready
echo "⏳ Waiting for Istio and add-ons to be ready..."
kubectl wait --for=condition=ready pod -n istio-system -l app=istiod --timeout=120s
kubectl wait --for=condition=ready pod -n istio-system -l app.kubernetes.io/name=kiali --timeout=120s
kubectl wait --for=condition=ready pod -n istio-system -l app.kubernetes.io/name=grafana --timeout=120s

# Step 9: Apply user YAMLs
if [ -d "$YAML_FOLDER" ]; then
    echo "📂 Applying Kubernetes YAMLs from $YAML_FOLDER..."
    kubectl apply -f $YAML_FOLDER/ -n $NAMESPACE
else
    echo "📂⚠️Warning: YAML folder $YAML_FOLDER not found. Skipping YAML application..."
fi

# Step 10: Verify setup
echo "✅ Verifying Istio setup... "
kubectl get pods -n istio-system
kubectl get pods -n $NAMESPACE
echo "🎉 Istio installation complete. Run the following to visualize... "
echo "  Kiali: $ISTIO_DIR/bin/istioctl dashboard kiali"
echo "  Grafana: $ISTIO_DIR/bin/istioctl dashboard grafana"
