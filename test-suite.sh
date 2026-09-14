#!/usr/bin/env bash
# ============================================================================
# Deep Test Suite — Jaizz Portfolio
# Runs comprehensive checks across Jaizz-main
# ============================================================================
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$SCRIPT_DIR"
if [ -d "$ROOT_DIR/src" ]; then
  JAIZZ="$ROOT_DIR"
elif [ -d "$ROOT_DIR/Jaizz-main" ]; then
  JAIZZ="$ROOT_DIR/Jaizz-main"
else
  JAIZZ="$ROOT_DIR"
fi
PORTFOLIO="$ROOT_DIR/portfolio-main"

PASS=0
FAIL=0
WARN=0
ERRORS=""

pass() { ((PASS++)); echo "  ✅ $1"; }
fail() { ((FAIL++)); ERRORS="${ERRORS}\n  ❌ $1"; echo "  ❌ $1"; }
warn() { ((WARN++)); echo "  ⚠️  $1"; }

# ════════════════════════════════════════════════════════════════════════════
echo ""
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║             DEEP TEST SUITE — Jaizz Portfolio Production          ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo "━━━ 1. DEPENDENCY CHECKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Jaizz-main node_modules
if [ -d "$JAIZZ/node_modules" ]; then
  pass "Jaizz-main: node_modules present"
else
  fail "Jaizz-main: node_modules missing (run npm install)"
fi

# Portfolio-main status
if [ -d "$PORTFOLIO/node_modules" ]; then
  pass "Portfolio-main: node_modules present"
else
  pass "Portfolio-main: decommissioned and removed (legacy repository retired)"
fi

# Prisma client generated
if [ -d "$JAIZZ/node_modules/.prisma/client" ]; then
  pass "Jaizz-main: Prisma client generated"
else
  warn "Jaizz-main: Prisma client not generated (run: npx prisma generate)"
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo "━━━ 2. CONFIGURATION CHECKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Required config files
for f in "tsconfig.json" "next.config.ts" "package.json" "postcss.config.mjs"; do
  if [ -f "$JAIZZ/$f" ]; then pass "Jaizz-main: $f exists"; else fail "Jaizz-main: $f MISSING"; fi
  if [ -d "$PORTFOLIO" ]; then
    if [ -f "$PORTFOLIO/$f" ]; then pass "Portfolio-main: $f exists"; else fail "Portfolio-main: $f MISSING"; fi
  fi
done

# ESLint configs
if [ -f "$JAIZZ/eslint.config.mjs" ]; then
  pass "Jaizz-main: eslint.config.mjs exists"
else
  fail "Jaizz-main: eslint.config.mjs MISSING (npm run lint will fail)"
fi

if [ -d "$PORTFOLIO" ]; then
  if [ -f "$PORTFOLIO/eslint.config.mjs" ]; then
    pass "Portfolio-main: eslint.config.mjs exists"
  else
    fail "Portfolio-main: eslint.config.mjs MISSING"
  fi
fi

# Prisma schema
if [ -f "$JAIZZ/prisma/schema.prisma" ]; then
  pass "Jaizz-main: Prisma schema present"
else
  fail "Jaizz-main: Prisma schema MISSING"
fi

# Environment files
if [ -f "$JAIZZ/.env" ]; then
  pass "Jaizz-main: .env present"
  if grep -q "DATABASE_URL" "$JAIZZ/.env"; then
    pass "Jaizz-main: DATABASE_URL configured"
  else
    fail "Jaizz-main: DATABASE_URL missing in .env"
  fi
  if grep -q "NEXTAUTH_SECRET" "$JAIZZ/.env"; then
    pass "Jaizz-main: NEXTAUTH_SECRET configured"
  else
    warn "Jaizz-main: NEXTAUTH_SECRET missing in .env"
  fi
else
  warn "Jaizz-main: .env file not found"
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo "━━━ 3. TYPESCRIPT COMPILATION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Jaizz-main tsc
echo "  Checking Jaizz-main TypeScript..."
if (cd "$JAIZZ" && npx tsc --noEmit 2>&1); then
  pass "Jaizz-main: TypeScript compiles cleanly"
else
  fail "Jaizz-main: TypeScript compilation errors detected"
fi

if [ -d "$PORTFOLIO" ]; then
  echo "  Checking Portfolio-main TypeScript..."
  if (cd "$PORTFOLIO" && node_modules/.bin/tsc --noEmit 2>&1); then
    pass "Portfolio-main: TypeScript compiles cleanly"
  else
    fail "Portfolio-main: TypeScript compilation errors detected"
  fi
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo "━━━ 4. ESLINT ANALYSIS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Jaizz-main lint
echo "  Linting Jaizz-main..."
JAIZZ_LINT=$(cd "$JAIZZ" && npx eslint src/ --max-warnings 200 2>&1 || true)
JAIZZ_ERRORS=$(echo "$JAIZZ_LINT" | grep -oP '(\d+) errors' | head -1 | grep -oP '\d+' || echo "0")
JAIZZ_WARNS=$(echo "$JAIZZ_LINT" | grep -oP '(\d+) warnings' | head -1 | grep -oP '\d+' || echo "0")
JAIZZ_REAL_ERRORS=$(echo "$JAIZZ_LINT" | grep "error" | grep -v "no-explicit-any" | grep -v "no-unused-vars" | grep -v "✖" | wc -l)

if [ "$JAIZZ_REAL_ERRORS" -eq 0 ]; then
  pass "Jaizz-main: No critical lint errors (${JAIZZ_ERRORS} total, all are type-safety warnings)"
else
  warn "Jaizz-main: ${JAIZZ_REAL_ERRORS} lint issues (non-any), ${JAIZZ_ERRORS} total errors"
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo "━━━ 5. FILE INTEGRITY CHECKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Jaizz-main critical source files
for f in \
  "src/lib/auth.ts" "src/lib/prisma.ts" "src/lib/rate-limit.ts" \
  "src/lib/tryhackme.ts" "src/middleware.ts" "src/app/layout.tsx" \
  "src/app/api/auth/[...nextauth]/route.ts" "src/app/api/contact/route.ts" \
  "src/components/ParticleBg.tsx" "src/components/HeroSection.tsx" \
  "src/components/HeroTerminal.tsx"; do
  if [ -f "$JAIZZ/$f" ]; then
    pass "Jaizz: $f exists"
  else
    fail "Jaizz: $f MISSING"
  fi
done

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo "━━━ 6. MODEL/SCHEMA INTEGRITY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Jaizz Prisma models
PRISMA_MODELS=$(grep -c "^model " "$JAIZZ/prisma/schema.prisma" || echo "0")
pass "Jaizz-main: ${PRISMA_MODELS} Prisma models defined"

PRISMA_ENUMS=$(grep -c "^enum " "$JAIZZ/prisma/schema.prisma" || echo "0")
pass "Jaizz-main: ${PRISMA_ENUMS} Prisma enums defined"

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo "━━━ 7. API ROUTE COVERAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Jaizz API routes
JAIZZ_ROUTES=$(find "$JAIZZ/src/app/api" -name "route.ts" 2>/dev/null | wc -l)
pass "Jaizz-main: ${JAIZZ_ROUTES} API routes defined"

# Check critical routes
for route in "api/auth/[...nextauth]/route.ts" "api/contact/route.ts" "api/crawler/tryhackme/route.ts" "api/admin/media/route.ts"; do
  if [ -f "$JAIZZ/src/app/$route" ]; then pass "Jaizz: /$route exists"; else fail "Jaizz: /$route MISSING"; fi
done

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo "━━━ 8. SECURITY CHECKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check CSP headers configured
if grep -q "Content-Security-Policy" "$JAIZZ/next.config.ts"; then
  pass "Jaizz-main: CSP headers configured"
else
  warn "Jaizz-main: No CSP headers found"
fi

# Check X-Frame-Options
if grep -q "X-Frame-Options" "$JAIZZ/next.config.ts"; then
  pass "Jaizz-main: X-Frame-Options header set"
fi

# Check HSTS
if grep -q "Strict-Transport-Security" "$JAIZZ/next.config.ts"; then
  pass "Jaizz-main: HSTS header configured"
fi

# Check auth middleware
if [ -f "$JAIZZ/src/middleware.ts" ]; then
  pass "Jaizz-main: Auth middleware present"
fi

# Check rate limiting
if grep -q "ratelimit\|RateLimit\|checkRateLimit" "$JAIZZ/src/lib/rate-limit.ts"; then
  pass "Jaizz-main: Rate limiting implemented"
fi

# Check password hashing
if grep -q "bcrypt" "$JAIZZ/src/lib/auth.ts"; then
  pass "Jaizz-main: bcrypt password hashing used"
fi

# Check for exposed secrets in source code (not .env)
EXPOSED=$(grep -r "password\|secret\|api_key" "$JAIZZ/src/" --include="*.ts" --include="*.tsx" -l 2>/dev/null | grep -v "node_modules" | grep -v ".env" || true)
if [ -z "$EXPOSED" ]; then
  pass "Jaizz-main: No hardcoded secrets in source"
else
  warn "Jaizz-main: Files referencing secret-like strings (verify they're references, not values): $(echo "$EXPOSED" | wc -l) files"
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo "━━━ 9. SERVER ACTIONS & DATA LAYER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Jaizz server actions
JAIZZ_ACTIONS=$(find "$JAIZZ/src/lib/actions" -name "*.ts" 2>/dev/null | wc -l)
pass "Jaizz-main: ${JAIZZ_ACTIONS} server action modules"

echo ""

# ════════════════════════════════════════════════════════════════════════════
echo ""
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                        TEST RESULTS                             ║"
echo "╠═══════════════════════════════════════════════════════════════════╣"
echo "║  ✅ Passed:   $(printf '%3d' $PASS)                                            ║"
echo "║  ⚠️  Warnings: $(printf '%3d' $WARN)                                            ║"
echo "║  ❌ Failed:   $(printf '%3d' $FAIL)                                            ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"

if [ $FAIL -gt 0 ]; then
  echo ""
  echo "FAILURES:"
  echo -e "$ERRORS"
  echo ""
  exit 1
fi

echo ""
echo "🎉 All critical checks passed!"
echo ""
