# ElevenLabs Voice Integration & Full Voice Mode

## Overview
This guide shows how to integrate ElevenLabs text-to-speech and create a Full Voice Mode for hands-free operation.

## Step 1: ElevenLabs Voice Function

Replace the `speakText` function in `dashboard.js` (around line 73) with this:

```javascript
// Text-to-Speech Function with ElevenLabs
let useElevenLabs = localStorage.getItem('useElevenLabs') !== 'false'; // Default true
let isFullVoiceMode = false;

async function speakTextElevenLabs(text) {
    const ELEVENLABS_API_KEY = 'sk_7e3adcb3fbbdde6e407e6b93857b2b6e816c1cada21205fe';
    const VOICE_ID = '2qfp6zPuviqeCOZIE9RZ';

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            })
        });

        if (!response.ok) {
            throw new Error('ElevenLabs API failed');
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        return new Promise((resolve, reject) => {
            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
                resolve();
            };
            audio.onerror = reject;
            audio.play();
        });
    } catch (error) {
        console.error('ElevenLabs TTS error:', error);
        // Fallback to browser TTS
        return speakTextBrowser(text);
    }
}

function speakTextBrowser(text) {
    if (!synthesis) {
        console.error('Speech synthesis not supported');
        return Promise.resolve();
    }

    synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    // Load and apply saved voice preference
    const savedVoiceName = localStorage.getItem('preferredVoiceName');
    if (savedVoiceName) {
        const voices = synthesis.getVoices();
        const preferredVoice = voices.find(voice => voice.name === savedVoiceName);
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
    }

    return new Promise((resolve) => {
        utterance.onend = resolve;
        synthesis.speak(utterance);
    });
}

async function speakText(text) {
    if (useElevenLabs) {
        return await speakTextElevenLabs(text);
    } else {
        return await speakTextBrowser(text);
    }
}
```

## Step 2: Full Voice Mode Feature

Add these functions after the speakText functions:

```javascript
// Full Voice Mode - Continuous voice interaction
async function toggleFullVoiceMode() {
    const btn = document.getElementById('fullVoiceModeBtn');
    isFullVoiceMode = !isFullVoiceMode;

    if (isFullVoiceMode) {
        btn.classList.remove('bg-blue-100');
        btn.classList.add('bg-red-200', 'animate-pulse');
        btn.innerHTML = '🔴 Voice Mode Active';

        // Welcome message
        await speakText('Full voice mode activated. I am listening. How can I help you?');

        // Start continuous listening
        startContinuousListening();
    } else {
        btn.classList.remove('bg-red-200', 'animate-pulse');
        btn.classList.add('bg-blue-100');
        btn.innerHTML = '🎤 Full Voice Mode';

        stopContinuousListening();
        await speakText('Voice mode deactivated');
    }
}

let recognitionInstance = null;

function startContinuousListening() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Speech recognition not supported in this browser');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = async (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log('Heard:', transcript);

        // Show what was heard
        const indicator = document.getElementById('voiceModeIndicator');
        if (indicator) {
            indicator.textContent = `Heard: "${transcript}"`;
        }

        // Process the question
        await processVoiceQuestion(transcript);
    };

    recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (isFullVoiceMode && event.error !== 'no-speech') {
            // Restart if still in voice mode and error isn't just silence
            setTimeout(() => {
                if (isFullVoiceMode) {
                    recognitionInstance.start();
                }
            }, 1000);
        }
    };

    recognitionInstance.onend = () => {
        // Restart if still in voice mode
        if (isFullVoiceMode) {
            setTimeout(() => {
                recognitionInstance.start();
            }, 500);
        }
    };

    recognitionInstance.start();
}

function stopContinuousListening() {
    if (recognitionInstance) {
        recognitionInstance.stop();
        recognitionInstance = null;
    }
}

async function processVoiceQuestion(question) {
    try {
        // Use tab-specific Q&A endpoint with context
        const response = await fetch(`${API_BASE}/api/query/ask-tab`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                tab: currentTab,
                tab_data: currentTabData
            })
        });

        let result;
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            // Fallback to mock response
            const mockResponse = typeof generateAIResponse === 'function'
                ? generateAIResponse(question)
                : { response: 'The backend is currently offline.', agent_used: 'Offline' };

            result = {
                success: true,
                answer: mockResponse.response
            };
        } else {
            result = await response.json();
        }

        if (result.success || result.answer) {
            const answer = result.answer || result.text || 'No response received';

            // Speak the answer
            await speakText(answer);

            // Optionally display in the chat
            addVoiceMessageToChat(question, answer);
        }
    } catch (error) {
        console.error('Voice question error:', error);
        await speakText('Sorry, I encountered an error processing your question.');
    }
}

function addVoiceMessageToChat(question, answer) {
    const messagesDiv = document.getElementById('reasoningMessages');
    if (!messagesDiv) return;

    // Add user question
    const userMsg = document.createElement('div');
    userMsg.className = 'bg-blue-50 border border-blue-100 rounded-lg p-3 mb-2';
    userMsg.innerHTML = `<p class="text-xs font-semibold text-gray-700">🎤 You (voice):</p><p class="text-xs text-gray-800">${question}</p>`;
    messagesDiv.insertBefore(userMsg, messagesDiv.firstChild);

    // Add AI response
    const aiMsg = document.createElement('div');
    aiMsg.className = 'bg-white border border-gray-300 shadow-sm rounded-lg p-3 mb-2';
    const escapedAnswer = answer
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, '<br>');
    aiMsg.innerHTML = `
        <div class="flex items-start gap-2 mb-2">
            <span class="text-xs font-semibold text-gray-700">🤖 AI:</span>
            <span class="text-xs text-gray-500">🔊 Voice Response</span>
        </div>
        <div class="text-xs text-gray-700">${escapedAnswer}</div>
    `;
    messagesDiv.insertBefore(aiMsg, messagesDiv.firstChild);
}
```

## Step 3: Update HTML (dashboard.html)

Add these buttons in the CEO Assistant section (after the existing voice button, around line 165):

```html
<!-- After existing voice controls -->
<div class="mt-2">
    <button onclick="toggleFullVoiceMode()" id="fullVoiceModeBtn" class="w-full bg-blue-100 hover:bg-blue-200 text-gray-800 px-3 py-2 rounded-lg text-sm font-semibold shadow-sm transition">
        🎤 Full Voice Mode
    </button>
    <div id="voiceModeIndicator" class="text-xs text-gray-600 mt-1 text-center h-4"></div>
</div>

<div class="mt-2">
    <label class="flex items-center gap-2">
        <input type="checkbox" id="elevenLabsToggle" checked onchange="toggleVoiceProvider(this.checked)" class="rounded">
        <span class="text-xs text-gray-600">Use ElevenLabs Voice</span>
    </label>
</div>
```

Add this JavaScript function for the toggle:

```javascript
function toggleVoiceProvider(useEL) {
    useElevenLabs = useEL;
    localStorage.setItem('useElevenLabs', useEL);
    const message = useEL ? 'ElevenLabs voice enabled' : 'Browser voice enabled';
    speakText(message);
}
```

## Step 4: Test Everything

1. **Stop all servers** (from PowerShell):
   ```powershell
   Get-Process python | Stop-Process -Force
   ```

2. **Start fresh**:
   ```bash
   cd healthcare_sciences_dashboard
   python run_app.py
   ```

3. **Open dashboard**:
   http://localhost:3000/dashboard.html

4. **Try Full Voice Mode**:
   - Click "Full Voice Mode" button
   - Wait for "I am listening" response
   - Ask questions verbally
   - Get responses in your ElevenLabs voice

## Features

✅ **ElevenLabs Integration** - High-quality voice from your configured voice
✅ **Full Voice Mode** - Hands-free continuous operation
✅ **Fallback Support** - Uses browser TTS if ElevenLabs fails
✅ **Voice Provider Toggle** - Switch between ElevenLabs and browser voices
✅ **Continuous Listening** - Auto-restarts after each question
✅ **Visual Feedback** - Shows what was heard and responses

## Usage

1. Enable "Use ElevenLabs Voice" checkbox
2. Click "Full Voice Mode" button
3. Wait for activation confirmation
4. Speak your questions naturally
5. Listen to AI responses in your voice
6. Click button again to deactivate

The system will keep listening and responding until you turn it off!
