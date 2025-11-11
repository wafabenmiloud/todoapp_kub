param(
  [string]$ClusterName = "todo"
)

$ErrorActionPreference = "Stop"

function Assert-Cmd($cmd) {
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
    Write-Error "$cmd is not installed or not in PATH."
  }
}

Assert-Cmd kind
Assert-Cmd kubectl

Write-Host "Creating kind cluster '$ClusterName'..."
kind create cluster --name $ClusterName --config ./kind-cluster.yaml
if ($LASTEXITCODE -ne 0) {
  Write-Error "Failed to create kind cluster '$ClusterName'. Aborting."
  exit $LASTEXITCODE
}

Write-Host "Switching kubectl context to kind-$ClusterName..."
kubectl config use-context "kind-$ClusterName" | Out-Null

Write-Host "Installing ingress-nginx for kind..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl -n ingress-nginx rollout status deploy/ingress-nginx-controller --timeout=180s

Write-Host "Kind cluster is ready."
Write-Host "Access via mapped ports: http://localhost:8080/ and https://localhost:8443/"
