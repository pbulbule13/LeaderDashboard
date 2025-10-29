Comprehensive Test Plan — HealthCare Sciences Dashboard

Scope
- API routes (dashboard tiles, queries, voice agent)
- Tab-specific Q&A (ask-tab)
- Python-only UI (/ui) form flow
- Front-end dashboard behaviors (tabs, buttons, charts) — covered as manual/e2e plan using Python tooling (no JS authoring)

Test Categories
- Smoke: basic availability and health
- API functional: endpoints return expected structure, error handling
- Agent stubs: LLM-dependent paths are stubbed for determinism
- UI server-rendered: /ui GET/POST flows
- E2E (optional): browser automation with Python Playwright (no JavaScript authored)

Environment
- Set OPENAI_API_KEY or configure model envs as needed. For CI, tests stub LLM calls.
- Start FastAPI app (or use TestClient in pytest as provided).

Automated Tests (Pytest)
- tests/unit/test_revenue_agent.py — revenue agent behaviors
- tests/test_products_agent.py — products agent tile + query
- tests/unit/integration/test_api.py — health, products tile, query ask
- tests/integration/test_query_ask_tab.py — ask-tab success, list tabs
- tests/integration/test_ui_routes.py — Python-only UI GET/POST
- tests/integration/test_voice_agent_routes.py — voice-agent query stub

Manual/E2E UI Tests (Playwright for Python – no JS code)
1) Tabs
   - Switch among: Overview, Orders, Compliance, Reimbursement, Costs, Lab, Regional, Forecasting, Market, Milestones.
   - Verify content container visibility toggles per tab.
   - Validate active tab class changes and ARIA attributes (if present).

2) Buttons/Controls
   - Quick notes: add/delete, persistence via localStorage (if applicable).
   - Time period toggles on charts (Orders/Reimbursement/Compliance/Lab/Costs/Forecast): labels, active state, data refresh.
   - “Analyze This Page”, quick ask presets populate the query and submit.

3) Charts
   - Render without errors for each chart canvas id.
   - Data bounds: y-axis begins at zero where expected; formats match config (%, $M, K).
   - Live updates (if any) do not throw exceptions; no memory leaks on tab switches.

4) AI Assistant Panels
   - Right-panel chat: sends to /api/query/ask-tab and displays answer text.
   - Inline reasoning widget: submits and renders response; loading indicators clear.

5) Python UI (/ui)
   - GET /ui renders form and tab selector defaulting to Overview.
   - POST /ui/ask echoes answer and preserves selected tab and question.

Suggested Improvements (Found During Review)
- Endpoint consistency: unify “Ask me anything” to use /api/query/ask-tab everywhere. Avoid calling voice-agent for dashboard analytics.
- Remove duplicate askReasoning functions in dashboard.js to prevent overrides and inconsistent behavior.
- Encoding issues: several garbled glyphs in dashboard.html/config.js/diagnose_ai_issue.py. Standardize UTF-8 and replace decorative emoji with plain text or SVG.
- ReasoningAgent env key: uses VOICE_AGENT_voice_agent_name; likely intended VOICE_AGENT_NAME.
- prompts_config.py: stray characters in comments/strings (e.g., “A�”). Clean up for readability.
- Defensive UI: when API is down, clearly show fallback/test data indicator in widgets.
- Graph routing: add explicit handling for general queries to AssistantAgent before synthesize to reduce “intent: unknown”.

Playwright (Python) E2E Sketch (optional)
- Install: pip install pytest-playwright; playwright install chromium
- Sample:
  - Navigate to dashboard.html via http server.
  - Click tab buttons and assert content visibility.
  - Type in “Ask me anything” textarea; submit; assert response bubble appears.
  - Locate chart canvases and verify they are attached and have non-zero size.

Exit Criteria
- All automated tests pass with LLM calls stubbed.
- Manual/E2E checks verified on at least one browser.

