param(
  [string]$ClusterName = "todo",
  [string]$Tag = "latest"
)

$ErrorActionPreference = "Stop"

function Assert-Cmd($cmd) {
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
    Write-Error "$cmd is not installed or not in PATH."
  }
}

Assert-Cmd docker
Assert-Cmd kind
Assert-Cmd helm
Assert-Cmd kubectl

Write-Host "Building Docker images..."
docker build -t wafabenmiloud/todo-backend:$Tag ./backend
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
docker build -t wafabenmiloud/todo-frontend:$Tag ./frontend
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Loading images into kind cluster '$ClusterName'..."
kind load docker-image wafabenmiloud/todo-backend:$Tag --name $ClusterName
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
kind load docker-image wafabenmiloud/todo-frontend:$Tag --name $ClusterName
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Deploying with Helm..."
helm upgrade --install todo ./helm/todo `
  --namespace todo --create-namespace `
  --set image.tag=$Tag `
  --set ingress.host=localhost
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Waiting for deployments to be ready..."
kubectl -n todo rollout status deploy/todo-todo-backend --timeout=180s
kubectl -n todo rollout status deploy/todo-todo-frontend --timeout=180s

Write-Host "Deployment complete. Try: http://localhost:8080/ and http://localhost:8080/api/tasks"
