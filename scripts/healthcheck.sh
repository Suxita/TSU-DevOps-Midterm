#!/usr/bin/env bash
# Health check: calls <URL>/health, appends the result to a log file.
# Usage: bash scripts/healthcheck.sh <base-url> [log-file]
# Exit code: 0 = healthy, 1 = unhealthy/unreachable.

BASE_URL="${1:-http://localhost:3000}"
LOG_FILE="${2:-healthcheck.log}"
RETRIES="${RETRIES:-5}"
DELAY="${DELAY:-5}"

BASE_URL="${BASE_URL%/}"
TARGET="$BASE_URL/health"

log() {
  echo "[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] $*" | tee -a "$LOG_FILE"
}

for attempt in $(seq 1 "$RETRIES"); do
  RESULT=$(curl -s -o /tmp/health_body.$$ -w "%{http_code} %{time_total}" --max-time 10 "$TARGET")
  CODE="${RESULT%% *}"
  TIME="${RESULT##* }"

  if [ "$CODE" = "200" ] && grep -q '"status":"ok"' /tmp/health_body.$$; then
    log "OK     $TARGET status=$CODE time=${TIME}s attempt=$attempt/$RETRIES"
    rm -f /tmp/health_body.$$
    exit 0
  fi

  log "FAILED $TARGET status=$CODE time=${TIME}s attempt=$attempt/$RETRIES"
  [ "$attempt" -lt "$RETRIES" ] && sleep "$DELAY"
done

rm -f /tmp/health_body.$$
log "UNHEALTHY $TARGET did not become healthy after $RETRIES attempts"
exit 1
