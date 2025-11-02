# COMPREHENSIVE TEST PLAN
# Healthcare Sciences Dashboard

**Version:** 1.0
**Date:** November 2, 2025
**Branch:** making-google-cloud-ready

---

## 🎯 TEST OBJECTIVES

1. Verify all critical bug fixes
2. Validate core functionality
3. Ensure data integrity
4. Test user interactions
5. Verify API integrations
6. Performance testing
7. Security validation

---

## 🧪 TEST ENVIRONMENT SETUP

### Prerequisites:
```bash
# 1. Start server
cd healthcare_sciences_dashboard
python run_app.py

# 2. Verify server running
curl http://localhost:8000/health

# 3. Access dashboard
# Local: http://localhost:8000/dash/dashboard.html
# Public: https://civilized-undaring-anneliese.ngrok-free.dev/dash/dashboard.html
```

### Required API Keys (in .env):
- EURON_API_KEY or OPENAI_API_KEY
- ELEVENLABS_API_KEY (for voice)
- GOOGLE_API_KEY (optional)

---

## 📋 TEST CASES

### CATEGORY 1: AUDIO SYSTEM (CRITICAL)

#### TC-AUDIO-001: Single Voice Instance
**Priority:** P0
**Objective:** Verify only one voice plays at a time

**Steps:**
1. Enable Full Voice Mode
2. Ask "What are today's orders?"
3. Immediately ask "What's the compliance rate?"
4. Immediately ask "Show me lab metrics"

**Expected Result:**
- Only ONE voice plays at any time
- Previous voice stops when new question asked
- No overlapping audio
- Clean transitions between responses

**Pass Criteria:** ✅ No audio overlaps at any point

---

#### TC-AUDIO-002: stopAllAudio() Function
**Priority:** P0
**Objective:** Verify audio management works

**Steps:**
1. Open browser console
2. Type: `stopAllAudio()`
3. Verify no errors
4. Start voice response
5. Call `stopAllAudio()` during playback

**Expected Result:**
- Function executes without errors
- Audio stops immediately
- `isAudioPlaying` flag set to false
- `currentAudio` cleared to null

**Pass Criteria:** ✅ Audio stops cleanly

---

#### TC-AUDIO-003: Full Voice Mode vs Checkbox
**Priority:** P0
**Objective:** Ensure no conflicts between voice modes

**Test Scenarios:**
| Full Voice Mode | Voice Checkbox | Expected Behavior |
|-----------------|----------------|-------------------|
| ON | Checked | Single voice from Full Voice Mode |
| ON | Unchecked | Single voice from Full Voice Mode |
| OFF | Checked | Single voice from checkbox |
| OFF | Unchecked | No voice |

**Pass Criteria:** ✅ All scenarios produce single voice or no voice

---

### CATEGORY 2: DATA LOADING (CRITICAL)

#### TC-DATA-001: Orders Tab
**Priority:** P0
**Objective:** Verify Orders tab loads and displays data

**Steps:**
1. Click "Orders" tab
2. Wait for loading

**Expected Result:**
- Tab displays within 2 seconds
- Shows Monthly Orders with number
- Shows YoY Growth percentage
- Displays trend chart
- Shows product lines breakdown

**Data to Verify:**
- Monthly Orders: > 1,000,000
- Growth metrics present
- Trend data chart renders
- Product lines table visible

**Pass Criteria:** ✅ All data elements display correctly

---

#### TC-DATA-002: Compliance Tab
**Priority:** P0
**Objective:** Verify Compliance tab loads data

**Steps:**
1. Click "Compliance" tab
2. Observe data loading

**Expected Result:**
- Compliance Rate shown (e.g., 99.4%)
- Return rate displayed
- Product-specific compliance listed
- Follow-up actions visible

**Pass Criteria:** ✅ All compliance metrics display

---

#### TC-DATA-003: Lab Tab
**Priority:** P0
**Objective:** Verify Lab tab loads metrics

**Steps:**
1. Click "Lab" tab
2. Check displayed metrics

**Expected Result:**
- Daily processing volume shown
- Turnaround time (TAT) displayed
- Lab capacity utilization shown
- Quality metrics visible
- Charts render properly

**Pass Criteria:** ✅ All lab metrics display correctly

---

#### TC-DATA-004: API Endpoint Validation
**Priority:** P0
**Objective:** Verify all API endpoints respond correctly

**API Calls to Test:**
```bash
# Test each endpoint
curl http://localhost:8000/api/dashboard/tiles/order-volume
curl http://localhost:8000/api/dashboard/tiles/compliance
curl http://localhost:8000/api/dashboard/tiles/lab-metrics
curl http://localhost:8000/api/dashboard/overview
```

**Expected Result:**
- All return 200 status
- All return valid JSON
- `success: true` in response
- Data structure matches expected format

**Pass Criteria:** ✅ All endpoints return 200 OK with valid data

---

### CATEGORY 3: AI FUNCTIONALITY

#### TC-AI-001: Data Access Awareness
**Priority:** P1
**Objective:** AI knows it has access to dashboard data

**Test Questions:**
1. "What emails do I have?"
2. "What's on my calendar today?"
3. "Show me today's orders"
4. "What's the compliance rate?"

**Expected Result:**
- AI references ACTUAL dashboard data
- Provides specific numbers
- Never says "I can't access"
- Answers confidently

**Pass Criteria:** ✅ AI uses real data in all responses

---

#### TC-AI-002: Voice Response Format
**Priority:** P1
**Objective:** Voice responses are concise and clean

**Steps:**
1. Enable Full Voice Mode
2. Ask "Tell me about orders"
3. Listen to response

**Expected Result:**
- Response is 1-2 sentences max
- No special characters spoken (*, #, -, •)
- Natural, conversational tone
- Clear and understandable

**Pass Criteria:** ✅ Response ≤ 2 sentences, no special chars

---

#### TC-AI-003: Context Awareness
**Priority:** P1
**Objective:** AI understands current tab context

**Steps:**
1. Go to Orders tab
2. Ask AI "What can you tell me about this?"
3. Go to Compliance tab
4. Ask same question

**Expected Result:**
- On Orders tab: Talks about orders
- On Compliance tab: Talks about compliance
- Context switches automatically
- Relevant data referenced

**Pass Criteria:** ✅ AI context matches current tab

---

### CATEGORY 4: REMINDERS FEATURE

#### TC-REM-001: Create Reminder
**Priority:** P2
**Objective:** Can create new reminder

**Steps:**
1. Click "+ Add" on Quick Reminders
2. Enter title: "Review Q4 reports"
3. Enter description: "Before Friday"
4. Save

**Expected Result:**
- Reminder appears in list
- Title and description displayed
- Checkbox unchecked (not complete)
- Delete button visible

**Pass Criteria:** ✅ Reminder created and visible

---

#### TC-REM-002: Complete Reminder
**Priority:** P2
**Objective:** Can mark reminder as complete

**Steps:**
1. Create a reminder
2. Click checkbox

**Expected Result:**
- Text shows strikethrough
- Checkbox checked
- Reminder stays in list

**Pass Criteria:** ✅ Visual indication of completion

---

#### TC-REM-003: Delete Reminder
**Priority:** P2
**Objective:** Can delete reminder

**Steps:**
1. Create a reminder
2. Click X button

**Expected Result:**
- Reminder removed from list
- Change persists after refresh

**Pass Criteria:** ✅ Reminder deleted

---

#### TC-REM-004: Persistence
**Priority:** P2
**Objective:** Reminders persist across sessions

**Steps:**
1. Create 3 reminders
2. Refresh page
3. Check reminders list

**Expected Result:**
- All 3 reminders still visible
- State preserved (completed/uncompleted)
- Order maintained

**Pass Criteria:** ✅ All reminders persist

---

### CATEGORY 5: USER INTERFACE

#### TC-UI-001: Tab Navigation
**Priority:** P1
**Objective:** All tabs accessible and functional

**Tabs to Test:**
- Overview
- Orders
- Compliance
- Reimbursement
- Costs
- Lab
- Regional
- Forecasting
- Market
- Milestones
- Communications
- Calendar
- Personal

**Expected Result:**
- All tabs clickable
- Content loads for each
- No JavaScript errors
- Active tab highlighted

**Pass Criteria:** ✅ All 13 tabs work

---

#### TC-UI-002: Charts Rendering
**Priority:** P1
**Objective:** All charts display correctly

**Charts to Verify:**
1. Orders trend chart
2. Compliance chart
3. Reimbursement chart
4. Costs breakdown chart
5. Lab metrics chart
6. Forecasting chart

**Expected Result:**
- All charts render
- Data points visible
- Legend displays
- Tooltips work on hover
- No visual glitches

**Pass Criteria:** ✅ All 6 charts render properly

---

#### TC-UI-003: Responsive Design
**Priority:** P2
**Objective:** Dashboard works on different screen sizes

**Test Sizes:**
- Desktop: 1920x1080
- Laptop: 1366x768
- Tablet: 1024x768
- Mobile: 375x667

**Expected Result:**
- Layout adjusts appropriately
- No horizontal scroll
- Content readable
- Buttons accessible

**Pass Criteria:** ✅ Usable on all sizes

---

### CATEGORY 6: PERFORMANCE

#### TC-PERF-001: Page Load Time
**Priority:** P2
**Objective:** Dashboard loads quickly

**Measurement:**
- Open browser DevTools
- Go to Network tab
- Load dashboard
- Check DOMContentLoaded time

**Expected Result:**
- Initial load < 3 seconds
- All content loaded < 5 seconds
- No blocking resources

**Pass Criteria:** ✅ Load time < 5 seconds

---

#### TC-PERF-002: API Response Time
**Priority:** P2
**Objective:** APIs respond quickly

**Test:**
```bash
time curl http://localhost:8000/api/dashboard/overview
```

**Expected Result:**
- Response time < 1 second
- Consistent across multiple calls

**Pass Criteria:** ✅ API responds < 1 second

---

#### TC-PERF-003: Voice Response Latency
**Priority:** P2
**Objective:** Voice responses start quickly

**Steps:**
1. Enable Full Voice Mode
2. Ask question
3. Measure time to first audio

**Expected Result:**
- Audio starts < 3 seconds
- Smooth playback
- No stuttering

**Pass Criteria:** ✅ Voice starts < 3 seconds

---

### CATEGORY 7: ERROR HANDLING

#### TC-ERR-001: Offline Mode
**Priority:** P2
**Objective:** System handles offline gracefully

**Steps:**
1. Stop backend server
2. Refresh dashboard
3. Try to load tabs
4. Try to ask AI questions

**Expected Result:**
- Falls back to TEST_DATA
- Shows offline message
- No crashes
- Functionality continues with test data

**Pass Criteria:** ✅ Graceful degradation

---

#### TC-ERR-002: Invalid API Responses
**Priority:** P2
**Objective:** Handles bad API data

**Test:**
- Simulate 500 error from API
- Simulate malformed JSON
- Simulate empty responses

**Expected Result:**
- Error caught and logged
- Falls back to test data
- User-friendly error message
- No white screen of death

**Pass Criteria:** ✅ No crashes, fallback works

---

#### TC-ERR-003: Browser Console Errors
**Priority:** P1
**Objective:** No JavaScript errors

**Steps:**
1. Open browser console
2. Use all features for 10 minutes
3. Check for errors

**Expected Result:**
- Zero JavaScript errors
- Warnings acceptable if documented
- No "undefined" errors
- No "null reference" errors

**Pass Criteria:** ✅ Zero errors in console

---

### CATEGORY 8: SECURITY

#### TC-SEC-001: API Keys Hidden
**Priority:** P1
**Objective:** API keys not exposed in frontend

**Steps:**
1. Open browser DevTools
2. Check Sources tab
3. Search for "API_KEY", "sk-", "key"

**Expected Result:**
- No API keys in JavaScript
- No keys in HTML
- voice-config.local.js gitignored
- .env not in source

**Pass Criteria:** ✅ No exposed secrets

---

#### TC-SEC-002: XSS Protection
**Priority:** P1
**Objective:** Input properly sanitized

**Test Input:**
```
<script>alert('XSS')</script>
```

**Where to Test:**
- Reminders title
- AI questions
- Any user input

**Expected Result:**
- Script tags escaped
- HTML entities used
- No script execution

**Pass Criteria:** ✅ No XSS vulnerability

---

### CATEGORY 9: INTEGRATION

#### TC-INT-001: ElevenLabs Voice
**Priority:** P1
**Objective:** Voice synthesis works

**Steps:**
1. Configure ElevenLabs API key
2. Enable voice
3. Ask question

**Expected Result:**
- Voice plays successfully
- Clear audio quality
- Correct voice ID used
- No API errors

**Pass Criteria:** ✅ Voice works with ElevenLabs

---

#### TC-INT-002: LLM Integration
**Priority:** P1
**Objective:** Multiple LLM providers work

**Test Providers:**
- Euron (primary)
- OpenAI (fallback)
- Google Gemini (fallback)
- DeepSeek (fallback)

**Expected Result:**
- All providers return responses
- Fallback chain works
- Error handling graceful

**Pass Criteria:** ✅ At least 2 providers work

---

## 🎯 TEST EXECUTION

### Priority Levels:
- **P0 (Critical):** Must pass before release - 10 tests
- **P1 (High):** Should pass, blockers if fail - 12 tests
- **P2 (Medium):** Important but not blocking - 11 tests

### Total Test Cases: **33**

---

## ✅ ACCEPTANCE CRITERIA

Dashboard is **READY FOR PRODUCTION** when:

1. ✅ All P0 tests pass (100%)
2. ✅ 90%+ of P1 tests pass
3. ✅ 80%+ of P2 tests pass
4. ✅ Zero critical errors in console
5. ✅ Performance benchmarks met
6. ✅ Security tests pass
7. ✅ Documentation complete

---

## 📊 TEST REPORT TEMPLATE

```
TEST EXECUTION REPORT
Date: [DATE]
Tester: [NAME]
Environment: [LOCAL/STAGING/PROD]

RESULTS:
- P0 Tests: [X/10] passed
- P1 Tests: [X/12] passed
- P2 Tests: [X/11] passed
- Total: [X/33] passed ([XX]%)

CRITICAL FAILURES:
- [List any P0 failures]

ISSUES FOUND:
- [Issue 1]
- [Issue 2]

RECOMMENDATIONS:
- [Recommendation 1]
- [Recommendation 2]

SIGN-OFF:
[ ] Ready for Production
[ ] Needs Fixes
[ ] Blocked

```

---

## 🚀 AUTOMATED TESTING (Future)

### Recommended Tools:
- **Jest** - Unit testing
- **Cypress** - E2E testing
- **Playwright** - Browser automation
- **pytest** - Backend API testing

### Priority Automation:
1. API endpoint tests
2. Audio system tests
3. Tab navigation tests
4. AI response validation

---

*Test Plan Version: 1.0*
*Last Updated: November 2, 2025*
*Status: Ready for Execution*
