set -euo pipefail

BASE_URL=${1:-http://localhost:8000}
WF="hello-world-$(date +%s)"

echo "=== Test API FastAPI + PostgreSQL sur $BASE_URL ==="

printf "Test /ready... "
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/ready" || true)
if [ "$code" = "200" ]; then echo "OK"; else echo "FAIL ($code)"; fi

printf "POST /workflows (%s)... " "$WF"
resp=$(curl -s -w "\n%{http_code}" -H "Content-Type: application/json" \
  -d "{\"name\":\"$WF\",\"definition\":{\"steps\":[]}}" \
  -X POST "$BASE_URL/workflows")
body=$(echo "$resp" | head -n1)
code=$(echo "$resp" | tail -n1)
if [ "$code" = "201" ] || [ "$code" = "409" ]; then
  echo "OK ($code)"
  echo "→ $body"
else
  echo "FAIL ($code)"
  echo "$body"s
  exit 1
fi

printf "GET /workflows... "
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/workflows" | grep -q 200 && echo "OK" || echo "FAIL"

printf "POST /runs/manual (workflow_name=%s)... " "$WF"
code=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Content-Type: application/json" \
  -d "{\"workflow_name\":\"$WF\",\"input\":{\"x\":42}}" \
  -X POST "$BASE_URL/runs/manual")
if [ "$code" = "200" ] || [ "$code" = "201" ]; then echo "OK"; else echo "FAIL ($code)"; fi

printf "GET /runs... "
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/runs" | grep -q 200 && echo "OK" || echo "FAIL"

echo "=== Tests terminés ==="
