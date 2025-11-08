// Load configuration from config.js
const CONFIG = window.DASHBOARD_CONFIG;
const API_BASE = CONFIG.api.baseUrl;
let overviewChartsCreated = false;
let charts = {};
let currentTab = 'overview'; // Track current active tab
let currentTabData = null; // Store current tab's data for context

// Voice Recognition Setup
let recognition = null;
let synthesis = window.speechSynthesis;
let isListening = false;

// Initialize Speech Recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('reasoningInput').value = transcript;
        isListening = false;
        document.getElementById('voiceBtn').innerHTML = '🎤 Voice';
        document.getElementById('voiceBtn').classList.remove('bg-red-300');
        document.getElementById('voiceBtn').classList.add('bg-gray-200');
        // Auto-submit after voice input
        askReasoning();
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        isListening = false;
        document.getElementById('voiceBtn').innerHTML = '🎤 Voice';
        document.getElementById('voiceBtn').classList.remove('bg-red-300');
        document.getElementById('voiceBtn').classList.add('bg-gray-200');
        showToast('Voice recognition error: ' + event.error, 'error');
    };

    recognition.onend = function() {
        isListening = false;
        document.getElementById('voiceBtn').innerHTML = '🎤 Voice';
        document.getElementById('voiceBtn').classList.remove('bg-red-300');
        document.getElementById('voiceBtn').classList.add('bg-gray-200');
    };
}

// Voice Input Function
function startVoiceInput() {
    if (!recognition) {
        showToast('Voice recognition not supported in this browser', 'error');
        return;
    }

    if (isListening) {
        recognition.stop();
        isListening = false;
        document.getElementById('voiceBtn').innerHTML = '🎤 Voice';
        document.getElementById('voiceBtn').classList.remove('bg-red-300');
        document.getElementById('voiceBtn').classList.add('bg-gray-200');
    } else {
        recognition.start();
        isListening = true;
        document.getElementById('voiceBtn').innerHTML = '🎤 Listening...';
        document.getElementById('voiceBtn').classList.remove('bg-gray-200');
        document.getElementById('voiceBtn').classList.add('bg-red-300');
    }
}

// Text-to-Speech Function with ElevenLabs
let useElevenLabs = localStorage.getItem('useElevenLabs') !== 'false'; // Default true
let isFullVoiceMode = false;

// Global audio management - prevent multiple voices
let currentAudio = null;
let isAudioPlaying = false;

function stopAllAudio() {
    console.log('[AUDIO] Stopping all audio...');

    // Stop any currently playing audio
    if (currentAudio) {
        try {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio.src = '';
            currentAudio = null;
        } catch (e) {
            console.error('[AUDIO] Error stopping audio:', e);
        }
    }

    // Stop browser speech synthesis
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    isAudioPlaying = false;
    console.log('[AUDIO] All audio stopped');
}

async function speakTextElevenLabs(text) {
    // Stop any currently playing audio first
    stopAllAudio();

    // Set audio playing flag
    isAudioPlaying = true;
    // Load config from voice-config.local.js (gitignored, contains your API keys)
    const config = typeof VOICE_CONFIG !== 'undefined' ? VOICE_CONFIG : {
        ELEVENLABS_API_KEY: null,
        VOICE_ID: null,
        model: 'eleven_monolingual_v1',
        stability: 0.5,
        similarity_boost: 0.75
    };

    if (!config.ELEVENLABS_API_KEY || !config.VOICE_ID) {
        console.warn('ElevenLabs API key or Voice ID not configured. Copy voice-config.example.js to voice-config.local.js and add your keys.');
        // Fallback to browser voice
        return speakTextBrowser(text);
    }

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': config.ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                model_id: config.model,
                voice_settings: {
                    stability: config.stability,
                    similarity_boost: config.similarity_boost
                }
            })
        });

        if (!response.ok) {
            console.error('ElevenLabs API error:', response.status);
            throw new Error('ElevenLabs API failed');
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        // Store current audio globally
        currentAudio = audio;

        return new Promise((resolve, reject) => {
            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
                isAudioPlaying = false;
                currentAudio = null;
                console.log('[AUDIO] ElevenLabs audio finished');
                resolve();
            };
            audio.onerror = (e) => {
                console.error('Audio playback error:', e);
                isAudioPlaying = false;
                currentAudio = null;
                reject(e);
            };
            audio.play().catch((err) => {
                isAudioPlaying = false;
                currentAudio = null;
                reject(err);
            });
        });
    } catch (error) {
        console.error('ElevenLabs TTS error:', error);
        isAudioPlaying = false;
        currentAudio = null;
        // Fallback to browser TTS
        return speakTextBrowser(text);
    }
}

function speakTextBrowser(text) {
    if (!synthesis) {
        console.error('Speech synthesis not supported');
        isAudioPlaying = false;
        return Promise.resolve();
    }

    // Stop all audio first
    stopAllAudio();

    // Set audio playing flag
    isAudioPlaying = true;

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
            console.log('Using saved voice:', preferredVoice.name);
        }
    }

    return new Promise((resolve) => {
        utterance.onend = () => {
            isAudioPlaying = false;
            console.log('[AUDIO] Browser TTS finished');
            resolve();
        };
        utterance.onerror = () => {
            isAudioPlaying = false;
            console.log('[AUDIO] Browser TTS error');
            resolve();
        };
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

// Function to save voice preference
function saveVoicePreference(voiceName) {
    localStorage.setItem('preferredVoiceName', voiceName);
    console.log('Voice preference saved:', voiceName);
}

// Function to handle voice change
function handleVoiceChange(voiceName) {
    if (voiceName) {
        saveVoicePreference(voiceName);
        // Test the voice
        speakText('Voice changed successfully. This is how I will sound.');
    }
}

// Toggle between ElevenLabs and Browser voice
function toggleVoiceProvider(useEL) {
    useElevenLabs = useEL;
    localStorage.setItem('useElevenLabs', useEL);
    const message = useEL ? 'ElevenLabs voice enabled' : 'Browser voice enabled';
    speakText(message);
}

// Full Voice Mode - Continuous voice interaction
let recognitionInstance = null;

async function toggleFullVoiceMode() {
    const btn = document.getElementById('fullVoiceModeBtn');
    if (!btn) return;

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

function startContinuousListening() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Speech recognition not supported in this browser. Please use Chrome or Edge.');
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
                if (isFullVoiceMode && recognitionInstance) {
                    recognitionInstance.start();
                }
            }, 1000);
        }
    };

    recognitionInstance.onend = () => {
        // Restart if still in voice mode
        if (isFullVoiceMode) {
            setTimeout(() => {
                if (isFullVoiceMode && recognitionInstance) {
                    recognitionInstance.start();
                }
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
                tab_data: currentTabData,
                voice_mode: true  // Enable concise voice-friendly responses
            })
        });

        let result;
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            // API is down, use fallback
            console.log('API unavailable for voice question, using fallback');
            const mockResponse = typeof generateAIResponse === 'function'
                ? generateAIResponse(question)
                : { response: 'The backend is currently offline. Please start it with: python run_app.py', agent_used: 'Offline' };

            result = {
                success: true,
                answer: mockResponse.response
            };
        } else {
            result = await response.json();
        }

        if (result.success || result.answer) {
            const answer = result.answer || result.text || 'No response received';

            // Speak the answer using ElevenLabs
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

// Function to populate voice selector
function populateVoiceSelector() {
    const voiceSelector = document.getElementById('voiceSelector');
    if (!voiceSelector) return;

    const voices = synthesis.getVoices();
    const savedVoiceName = localStorage.getItem('preferredVoiceName');

    // Clear existing options
    voiceSelector.innerHTML = '';

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Default Voice';
    voiceSelector.appendChild(defaultOption);

    // Add all available voices
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        if (voice.name === savedVoiceName) {
            option.selected = true;
        }
        voiceSelector.appendChild(option);
    });

    console.log(`Loaded ${voices.length} voices`);
}

// Set current date
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Initialize
    switchTab('overview');
    loadOverviewData();
    loadStockData();
    renderNotes();
    generateCalendar();

    // Load voices when available
    if (synthesis) {
        // Chrome/Edge load voices asynchronously
        if (synthesis.getVoices().length > 0) {
            populateVoiceSelector();
        }
        synthesis.onvoiceschanged = () => {
            populateVoiceSelector();
        };
    }

    // Auto-refresh based on config
    if (CONFIG.features.autoRefresh) {
        setInterval(() => {
            loadOverviewData();
            loadStockData();
        }, CONFIG.api.refreshInterval);
    }
});

// AI Panel Functions
function toggleAIPanel() {
    const panel = document.getElementById('aiPanel');
    panel.classList.toggle('translate-x-full');
}

async function askAI() {
    const input = document.getElementById('aiQueryInput');
    const query = input.value.trim();
    if (!query) return;

    const chatMessages = document.getElementById('aiChatMessages');

    // Display user message
    chatMessages.innerHTML += `
        <div class="flex justify-end mb-3">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-3 max-w-[80%]">
                <p class="text-sm">${query}</p>
            </div>
        </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;
    input.value = '';

    // Show loading indicator
    chatMessages.innerHTML += `
        <div id="loading" class="flex justify-start mb-3">
            <div class="bg-gray-100 rounded-lg p-3">
                <div class="flex items-center space-x-2">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <p class="text-sm text-gray-600">Analyzing your question...</p>
                </div>
            </div>
        </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // Use tab-specific Q&A endpoint with context
        const response = await fetch(`${API_BASE}/api/query/ask-tab`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: query,
                tab: currentTab,
                tab_data: currentTabData
            })
        });

        const result = await response.json();
        document.getElementById('loading')?.remove();

        // Debug: Log the response
        console.log('AI Response:', result);
        console.log('Answer text:', result.answer);
        console.log('Success:', result.success);

        if (result.success) {
            // Display AI response with tab context indicator
            const answer = result.answer || result.text || 'No response received';

            // Escape HTML to prevent XSS and formatting issues
            const escapedAnswer = answer
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;')
                .replace(/\n/g, '<br>'); // Convert newlines to <br>

            console.log('Displaying answer, length:', answer.length);

            chatMessages.innerHTML += `
                <div class="flex justify-start mb-3">
                    <div class="bg-white border border-gray-200 rounded-lg p-4 max-w-[80%] shadow-sm">
                        <div class="flex items-center space-x-2 mb-2">
                            <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                ${result.tab_name || currentTab.toUpperCase()}
                            </span>
                            ${result.has_reasoning ? '<span class="text-xs text-gray-500">• With Reasoning</span>' : ''}
                        </div>
                        <div class="text-sm text-gray-700">${escapedAnswer}</div>
                    </div>
                </div>
            `;
        } else {
            chatMessages.innerHTML += `
                <div class="flex justify-start mb-3">
                    <div class="bg-red-50 border border-red-200 rounded-lg p-3 max-w-[80%]">
                        <p class="text-sm text-red-700">Error: ${result.error || 'Failed to get response'}</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        document.getElementById('loading')?.remove();
        chatMessages.innerHTML += `
            <div class="flex justify-start mb-3">
                <div class="bg-red-50 border border-red-200 rounded-lg p-3 max-w-[80%]">
                    <p class="text-sm text-red-700">Error: ${error.message}</p>
                </div>
            </div>
        `;
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function askQuick(query) {
    document.getElementById('aiQueryInput').value = query;
    askAI();
}

// Notes Functions
let notes = JSON.parse(localStorage.getItem('ceoNotes') || '[]');

function saveNote() {
    const noteText = document.getElementById('quickNotes').value.trim();
    if (!noteText) return;

    const note = {
        id: Date.now(),
        text: noteText,
        timestamp: new Date().toLocaleString()
    };

    notes.unshift(note);

    // Keep only configured max notes
    if (notes.length > CONFIG.overview.widgets.notes.maxNotes) {
        notes = notes.slice(0, CONFIG.overview.widgets.notes.maxNotes);
    }

    localStorage.setItem('ceoNotes', JSON.stringify(notes));

    document.getElementById('quickNotes').value = '';
    renderNotes();
}

function renderNotes() {
    const container = document.getElementById('savedNotes');
    if (notes.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = notes.slice(0, CONFIG.overview.widgets.notes.displayNotes).map(note => `
        <div class="bg-white rounded-lg shadow p-3 border border-amber-300">
            <p class="text-sm text-gray-700">${note.text}</p>
            <div class="flex items-center justify-between mt-2">
                <p class="text-xs text-gray-500">${note.timestamp}</p>
                <button onclick="deleteNote(${note.id})" class="text-xs text-red-600 hover:underline">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem('ceoNotes', JSON.stringify(notes));
    renderNotes();
}

function viewAllNotes() {
    alert(`You have ${notes.length} saved notes.`);
}

// Tab Switching
function switchTab(tabName) {
    // Update UI
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('[id^="tab-"]').forEach(el => el.classList.remove('tab-active'));
    document.getElementById('content-' + tabName).classList.remove('hidden');
    document.getElementById('tab-' + tabName).classList.add('tab-active');

    // Track current tab for context-aware AI
    currentTab = tabName;

    // Load tab data and update context
    if (tabName === 'orders') loadOrdersData();
    else if (tabName === 'compliance') loadComplianceData();
    else if (tabName === 'reimbursement') loadReimbursementData();
    else if (tabName === 'costs') loadCostsData();
    else if (tabName === 'lab') loadLabData();
    else if (tabName === 'regional') loadRegionalData();
    else if (tabName === 'forecasting') loadForecastingData();
    else if (tabName === 'market') loadMarketData();
    else if (tabName === 'milestones') loadMilestonesData();

    // Update AI panel header to show current context
    updateAIPanelContext(tabName);
}

function updateAIPanelContext(tabName) {
    // Add visual indicator of which tab AI is contextually aware of
    const aiTitle = document.querySelector('#aiPanel h2');
    if (aiTitle) {
        const tabNames = {
            'overview': '📊 Dashboard',
            'email': '📬 Communications',
            'personal': '💼 Personal',
            'orders': '📈 Orders',
            'compliance': '✅ Compliance',
            'reimbursement': '💵 Reimbursement',
            'costs': '💰 Costs',
            'lab': '🔬 Lab',
            'regional': '🗺️ Regional',
            'forecasting': '🔮 Forecast',
            'market': '📰 Market',
            'milestones': '🎯 Projects'
        };
        const displayName = tabNames[tabName] || tabName;
        aiTitle.innerHTML = `Ask Me Anything <span class="text-xs font-normal text-blue-600 ml-2">(${displayName})</span>`;
    }
}

// Create Overview Charts
function createOverviewCharts(data) {
    if (overviewChartsCreated) return;

    try {
        // Orders Progress Ring Chart
        const orderCanvas = document.getElementById('overviewOrdersChart');
        if (orderCanvas) {
            const orderTrends = data.order_volume.trend_data || [];
            const orderLabels = orderTrends.map(t => t.period);
            const orderValues = orderTrends.map(t => t.count);

            // Take first 3 periods for rings
            const ringOrderLabels = orderLabels.slice(0, Math.min(3, orderLabels.length));
            const ringOrderValues = orderValues.slice(0, Math.min(3, orderValues.length));

            const maxOrderValue = Math.max(...ringOrderValues) * 1.2;
            const orderMaxValues = ringOrderValues.map(() => maxOrderValue);

            charts.overviewOrders = createProgressRingChart({
                canvasId: 'overviewOrdersChart',
                labels: ringOrderLabels,
                values: ringOrderValues,
                maxValues: orderMaxValues,
                title: 'Order Volume Progress',
                centerLabel: 'Orders',
                showCenterText: true
            });
            console.log('Successfully created overview orders chart');
        } else {
            console.warn('overviewOrdersChart canvas not found');
        }
    } catch (error) {
        console.error('Error creating overview orders chart:', error);
    }

    try {
        // Operating Costs Progress Ring Chart
        const costCanvas = document.getElementById('overviewFinancialsChart');
        if (costCanvas) {
            const costTrends = data.operating_costs.monthly_trend.slice(-6) || [];
            const costLabels = costTrends.map(m => m.month);
            const costValues = costTrends.map(m => m.total_cost / 1000000);

            // Take last 3 months for rings
            const ringCostLabels = costLabels.slice(-3);
            const ringCostValues = costValues.slice(-3);

            const maxCostValue = Math.max(...ringCostValues) * 1.2;
            const costMaxValues = ringCostValues.map(() => maxCostValue);

            charts.overviewFinancials = createProgressRingChart({
                canvasId: 'overviewFinancialsChart',
                labels: ringCostLabels,
                values: ringCostValues,
                maxValues: costMaxValues,
                title: 'Operating Costs ($M)',
                centerLabel: 'Costs',
                showCenterText: true
            });
            console.log('Successfully created overview financials chart');
        } else {
            console.warn('overviewFinancialsChart canvas not found');
        }
    } catch (error) {
        console.error('Error creating overview financials chart:', error);
    }

    overviewChartsCreated = true;
}

// Load Overview Data
async function loadOverviewData() {
    let data;
    try {
        const response = await fetch(`${API_BASE}${CONFIG.api.endpoints.overview}`);
        const result = await response.json();
        if (result.success) {
            data = result.data;
        } else {
            // Use test data as fallback
            data = TEST_DATA.overview;
        }
    } catch (error) {
        console.log('API unavailable, using test data');
        // Use test data as fallback
        data = TEST_DATA.overview;
    }

    try {
        // Transform data to match expected structure if using test data
        if (!data.reimbursement.reimbursement_percentage) {
            // Calculate reimbursement percentage
            data.reimbursement.reimbursement_percentage = (data.reimbursement.total_reimbursed / (data.reimbursement.total_reimbursed + data.reimbursement.pending_amount)) * 100;
            data.reimbursement.claims_reimbursed = data.order_volume.monthly_orders - Math.floor(data.order_volume.monthly_orders * 0.02);
        }
        if (!data.lab_metrics.average_turnaround_hours) {
            data.lab_metrics.average_turnaround_hours = data.lab_metrics.average_tat_hours;
            data.lab_metrics.target_turnaround_hours = 42;
            data.lab_metrics.lab_capacity = {
                utilization_percentage: data.lab_metrics.capacity_utilization
            };
            data.lab_metrics.efficiency_score = 94.5;
            data.lab_metrics.error_rate = 0.8;
        }
        if (!data.operating_costs.total_operating_costs) {
            data.operating_costs.total_operating_costs = data.operating_costs.total_monthly_costs;
        }
        if (!data.forecasting.next_quarter_orders) {
            data.forecasting.next_quarter_orders = data.forecasting.quarterly_forecast[0].predicted_orders;
        }
        if (!data.stock) {
            data.stock = {
                current_price: { price: 127.45, change: 2.35, change_percentage: '+1.88' },
                day_high: 128.90,
                day_low: 125.20,
                volume: 2450000,
                pe_ratio: 24.5,
                market_cap: '$3.2B'
            };
        }
        if (!data.milestones.total_projects) {
            const projects = data.milestones.projects;
            data.milestones.total_projects = projects.length;
            data.milestones.projects_on_track = projects.filter(p => p.status === 'on_track').length;
            data.milestones.projects_at_risk = projects.filter(p => p.status === 'at_risk').length;
            data.milestones.projects_delayed = projects.filter(p => p.status === 'delayed').length;
            data.milestones.active_projects = projects.map(p => ({
                project_name: p.name,
                completion_percentage: p.completion,
                overall_status: p.status
            }));
            data.milestones.critical_items = [];
        }
        if (!data.market_intelligence.latest_news) {
            data.market_intelligence.latest_news = data.market_intelligence.news.map(n => ({
                title: n.title,
                summary: n.title,
                source: n.source,
                date: n.timestamp,
                importance: n.relevance
            }));
            data.market_intelligence.competitor_updates = data.market_intelligence.competitors.map(c => ({
                competitor_name: c.name,
                description: c.activity,
                impact_level: c.impact
            }));
            data.market_intelligence.critical_alerts = [];
        }
        if (!data.regional.territories[0].orders) {
            data.regional.territories = data.regional.territories.map(t => ({
                ...t,
                orders: t.total_orders
            }));
        }

        // Update KPI cards
        document.getElementById('overview-orders').textContent = data.order_volume.monthly_orders.toLocaleString();
        document.getElementById('overview-orders-growth').textContent = `↑ ${data.order_volume.growth_metrics.mom}% MoM`;

        document.getElementById('overview-compliance').textContent = `${(100 - data.compliance.overall_return_rate).toFixed(1)}%`;
        document.getElementById('overview-compliance-returns').textContent = `${data.compliance.total_returns} returns`;

        document.getElementById('overview-reimbursement').textContent = `${data.reimbursement.reimbursement_percentage.toFixed(1)}%`;
        document.getElementById('overview-reimbursement-claims').textContent = `${data.reimbursement.claims_reimbursed.toLocaleString()} approved`;

        document.getElementById('overview-lab').textContent = `${data.lab_metrics.average_turnaround_hours.toFixed(1)}h`;
        document.getElementById('overview-lab-target').textContent = `Target: ${data.lab_metrics.target_turnaround_hours}h`;

        document.getElementById('overview-costs').textContent = `$${(data.operating_costs.total_operating_costs / 1000000).toFixed(1)}M`;
        document.getElementById('overview-costs-trend').textContent = `Monthly`;

        document.getElementById('overview-forecast').textContent = `${(data.forecasting.next_quarter_orders / 1000).toFixed(0)}K`;
        document.getElementById('overview-forecast-growth').textContent = `Projected`;

        // Create charts
        createOverviewCharts(data);

        // Stock summary
        document.getElementById('overview-stock-summary').innerHTML = `
            <div class="text-center mb-4">
                <p class="text-sm text-gray-600">HCS Stock Price</p>
                <p class="text-4xl font-bold ${data.stock.current_price.change >= 0 ? 'text-green-600' : 'text-red-600'}">$${data.stock.current_price.price}</p>
                <p class="text-sm ${data.stock.current_price.change >= 0 ? 'text-green-600' : 'text-red-600'} mt-2">${data.stock.current_price.change >= 0 ? '↑' : '↓'} $${Math.abs(data.stock.current_price.change).toFixed(2)} (${data.stock.current_price.change_percentage}%)</p>
            </div>
            <div class="space-y-2 text-sm border-t pt-4">
                <div class="flex justify-between">
                    <span class="text-gray-600">Day High:</span>
                    <span class="font-semibold">$${data.stock.day_high}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Day Low:</span>
                    <span class="font-semibold">$${data.stock.day_low}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Volume:</span>
                    <span class="font-semibold">${(data.stock.volume / 1000000).toFixed(2)}M</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">P/E Ratio:</span>
                    <span class="font-semibold">${data.stock.pe_ratio}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Market Cap:</span>
                    <span class="font-semibold">${data.stock.market_cap}</span>
                </div>
            </div>
        `;

        // Regional
        document.getElementById('overview-regional').innerHTML = data.regional.territories.slice(0, CONFIG.limits.topTerritories).map(t => `
            <div class="flex justify-between text-sm hover:bg-gray-50 p-2 rounded cursor-pointer" onclick="switchTab('regional')">
                <span class="font-medium">${t.territory_name}</span>
                <span class="font-bold text-blue-600">${t.orders.toLocaleString()}</span>
            </div>
        `).join('');

        // Projects
        document.getElementById('overview-projects').innerHTML = `
            <div class="space-y-2">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Total Projects:</span>
                    <span class="font-bold">${data.milestones.total_projects}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">On Track:</span>
                    <span class="font-bold text-green-600">${data.milestones.projects_on_track}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">At Risk:</span>
                    <span class="font-bold text-orange-600">${data.milestones.projects_at_risk}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Delayed:</span>
                    <span class="font-bold text-red-600">${data.milestones.projects_delayed}</span>
                </div>
            </div>
            ${data.milestones.active_projects.slice(0, CONFIG.limits.recentProjects).map(p => `
                <div class="text-xs p-2 rounded mt-2 ${p.overall_status === 'on_track' ? 'bg-green-50' : p.overall_status === 'at_risk' ? 'bg-orange-50' : 'bg-red-50'}">
                    <div class="flex justify-between mb-1">
                        <span class="font-medium">${p.project_name}</span>
                        <span class="font-bold">${p.completion_percentage}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-1">
                        <div class="${p.overall_status === 'on_track' ? 'bg-green-500' : p.overall_status === 'at_risk' ? 'bg-orange-500' : 'bg-red-500'} h-1 rounded-full" style="width: ${p.completion_percentage}%"></div>
                    </div>
                </div>
            `).join('')}
        `;

        // Alerts
        const alerts = [];
        if (data.milestones.critical_items.length > 0) {
            alerts.push(...data.milestones.critical_items.map(item => `<div class="bg-orange-50 border-l-4 border-orange-500 rounded p-2 text-xs">${item}</div>`));
        }
        if (data.market_intelligence.critical_alerts.length > 0) {
            alerts.push(...data.market_intelligence.critical_alerts.map(alert => `<div class="bg-red-50 border-l-4 border-red-500 rounded p-2 text-xs">${alert}</div>`));
        }
        document.getElementById('overview-alerts').innerHTML = alerts.length > 0 ? alerts.slice(0, CONFIG.limits.criticalAlerts).join('') : '<p class="text-gray-600 text-sm">No critical alerts</p>';

        // Operations
        document.getElementById('overview-stats').innerHTML = `
            <div class="space-y-3">
                <div>
                    <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-600">Lab Capacity:</span>
                        <span class="font-bold">${data.lab_metrics.lab_capacity.utilization_percentage.toFixed(0)}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full" style="width: ${data.lab_metrics.lab_capacity.utilization_percentage}%"></div>
                    </div>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Efficiency:</span>
                    <span class="font-bold">${data.lab_metrics.efficiency_score}%</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Error Rate:</span>
                    <span class="font-bold ${data.lab_metrics.error_rate < 1 ? 'text-green-600' : 'text-orange-600'}">${data.lab_metrics.error_rate}%</span>
                </div>
            </div>
        `;

        // Market Intelligence
        document.getElementById('overview-market').innerHTML = data.market_intelligence.latest_news.slice(0, CONFIG.limits.marketNews).map(n => `
            <div class="text-sm p-3 rounded border-l-4 ${n.importance === 'high' ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'}">
                <p class="font-semibold text-xs mb-1">${n.title}</p>
                <p class="text-xs text-gray-600">${n.summary}</p>
                <p class="text-xs text-gray-500 mt-1">${n.source} | ${n.date}</p>
            </div>
        `).join('');

        // Competitors
        document.getElementById('overview-competitors').innerHTML = data.market_intelligence.competitor_updates.slice(0, CONFIG.limits.competitorUpdates).map(c => `
            <div class="text-sm p-3 rounded border-l-4 ${c.impact_level === 'high' ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'}">
                <p class="font-semibold text-xs mb-1">${c.competitor_name}</p>
                <p class="text-xs text-gray-700">${c.description}</p>
                <p class="text-xs text-gray-500 mt-1">Impact: ${c.impact_level.toUpperCase()}</p>
            </div>
        `).join('');

        // Update current tab data for AI context
        if (currentTab === 'overview') {
            currentTabData = data;
        }

    } catch (error) {
        console.error('Error loading overview:', error);
    }
}

// Load Stock Data
async function loadStockData() {
    let data;
    try {
        const response = await fetch(`${API_BASE}${CONFIG.api.endpoints.stock}`);
        const result = await response.json();
        if (result.success) {
            data = result.data.current_price;
        } else {
            data = TEST_DATA.stock.current_price;
        }
    } catch (error) {
        console.log('API unavailable, using test data for stock');
        data = TEST_DATA.stock.current_price;
    }

    try {
        document.getElementById('stockPrice').innerHTML = `
            <p class="text-xs text-gray-600">HCS Stock</p>
            <p class="text-xl font-bold ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}">$${data.price}</p>
            <p class="text-xs ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}">${data.change >= 0 ? '↑' : '↓'} ${data.change_percentage}%</p>
        `;
    } catch (error) {
        console.error('Error rendering stock data:', error);
    }
}

// Email Functions
function composeEmail() {
    showToast('Opening email composer...', 'success');
    // Auto-close notification
    setTimeout(() => {
        // Email composer would open here
        console.log('Email composer opened');
    }, 500);
}

function loadEmails(folder) {
    showToast(`Loading ${folder} emails...`, 'info');
    // Auto-close and load
    setTimeout(() => {
        console.log(`Loaded ${folder} folder`);
    }, 500);
}

function refreshEmails() {
    showToast('Refreshing emails...', 'info');
    // Auto-close and refresh
    setTimeout(() => {
        console.log('Emails refreshed');
    }, 500);
}

function aiSummarizeEmails() {
    showToast('AI is analyzing your inbox...', 'info');
    setTimeout(() => {
        showToast('Inbox summary ready! Check AI panel.', 'success');
    }, 2000);
}

function aiPriorityEmails() {
    showToast('AI is identifying priority emails...', 'info');
    setTimeout(() => {
        showToast('Priority emails highlighted.', 'success');
    }, 2000);
}

function escalateToHuman() {
    showToast('Escalating to human support...', 'warning');
    setTimeout(() => {
        showToast('Support team notified. You will be contacted shortly.', 'success');
        // Could integrate with support ticket system here
        console.log('Escalated to human support');
    }, 1500);
}

// Calendar Functions
function scheduleNewMeeting() {
    showToast('Opening meeting scheduler...', 'success');
    setTimeout(() => {
        console.log('Meeting scheduler opened');
    }, 500);
}

// Toast Notification System (replaces annoying alerts)
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-orange-500',
        info: 'bg-gray-700'
    };

    toast.className = `fixed bottom-6 right-6 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all transform translate-y-0 opacity-100`;
    toast.textContent = message;
    toast.style.animation = 'slideInUp 0.3s ease-out';

    document.body.appendChild(toast);

    // Auto-close after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function generateCalendar() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = '';

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="p-2"></div>';
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate();
        html += `
            <div class="p-2 text-center hover:bg-gray-100 rounded cursor-pointer ${isToday ? 'bg-gray-700 text-white font-bold' : 'text-gray-700'}">
                ${day}
            </div>
        `;
    }

    grid.innerHTML = html;
}

// ==================== BUSINESS TAB LOAD FUNCTIONS ====================

async function loadOrdersData() {
    console.log('=== loadOrdersData CALLED ===');
    const container = document.getElementById('orders-content');
    console.log('Container found:', !!container);

    let data;
    try {
        console.log('Starting API fetch...');
        const response = await fetch(`${API_BASE}${CONFIG.api.endpoints.overview}`);
        console.log('Response received:', response.status);
        const result = await response.json();
        console.log('Result parsed, success:', result.success);

        if (result.success) {
            data = result.data.order_volume;
            console.log('Using API data');
        } else {
            data = TEST_DATA.overview.order_volume;
            console.log('Using TEST_DATA');
        }
    } catch (error) {
        console.log('API error, using test data for orders:', error.message);
        data = TEST_DATA.overview.order_volume;
    }

    console.log('Data ready, has trend_data:', !!data?.trend_data);
    console.log('Data object:', data);
    console.log('Has monthly_orders:', !!data?.monthly_orders);
    console.log('Has growth_metrics:', !!data?.growth_metrics);

    try {
        // Ensure data has required fields
        if (!data.peak_day_orders) {
            data.peak_day_orders = Math.max(...data.trend_data.map(t => t.count));
        }
        if (data.trend_data && data.trend_data.length > 0 && !data.trend_data[0].growth) {
            for (let i = 1; i < data.trend_data.length; i++) {
                data.trend_data[i].growth = ((data.trend_data[i].count - data.trend_data[i-1].count) / data.trend_data[i-1].count * 100).toFixed(1);
            }
            data.trend_data[0].growth = 0;
        }
        // API returns product_lines, not by_category
        if (!data.by_category && data.product_lines) {
            data.by_category = data.product_lines.map(p => ({
                category: p.product_line,
                orders: p.orders,
                count: p.orders,
                percentage: p.percentage
            }));
        } else if (data.by_category && data.by_category.length > 0 && !data.by_category[0].count) {
            data.by_category = data.by_category.map(c => ({
                ...c,
                count: c.orders
            }));
        }

        container.innerHTML = `
            <div class="space-y-6">
                <!-- KPI Cards -->
                <div class="grid grid-cols-4 gap-6">
                    <div class="bg-white border border-blue-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Monthly Orders</h3>
                        <p class="text-3xl font-bold text-blue-600">${data.monthly_orders.toLocaleString()}</p>
                        <p class="text-xs text-green-600 mt-2">↑ ${data.growth_metrics.mom}% MoM</p>
                    </div>
                    <div class="bg-white border border-green-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">YoY Growth</h3>
                        <p class="text-3xl font-bold text-green-600">${data.growth_metrics.yoy}%</p>
                        <p class="text-xs text-gray-500 mt-2">Year over year</p>
                    </div>
                    <div class="bg-white border border-purple-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Average Daily</h3>
                        <p class="text-3xl font-bold text-purple-600">${data.average_daily_orders.toLocaleString()}</p>
                        <p class="text-xs text-gray-500 mt-2">Orders per day</p>
                    </div>
                    <div class="bg-white border border-orange-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Peak Day</h3>
                        <p class="text-3xl font-bold text-orange-600">${data.peak_day_orders.toLocaleString()}</p>
                        <p class="text-xs text-gray-500 mt-2">Highest single day</p>
                    </div>
                </div>

                <!-- Charts -->
                <div class="grid grid-cols-2 gap-6">
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">📈 Order Volume Trend</h3>
                        <div class="h-80"><canvas id="ordersDetailChart"></canvas></div>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">📊 Orders by Category</h3>
                        <div class="h-80"><canvas id="ordersCategoryChart"></canvas></div>
                    </div>
                </div>

                <!-- Detailed Stats -->
                <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">📋 Monthly Breakdown</h3>
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-sm">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-2 text-left font-semibold">Period</th>
                                    <th class="px-4 py-2 text-right font-semibold">Orders</th>
                                    <th class="px-4 py-2 text-right font-semibold">Growth</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${data.trend_data.slice(-6).map(t => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-4 py-2">${t.period}</td>
                                        <td class="px-4 py-2 text-right font-semibold">${t.count.toLocaleString()}</td>
                                        <td class="px-4 py-2 text-right ${t.growth >= 0 ? 'text-green-600' : 'text-red-600'}">${t.growth >= 0 ? '↑' : '↓'} ${Math.abs(t.growth)}%</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Create Apple Watch-style progress ring charts (with delay to ensure DOM is ready)
        setTimeout(() => {
            try {
                const recentTrends = data.trend_data.slice(-3);  // Last 3 periods
                const maxTrendValue = Math.max(...recentTrends.map(t => t.count)) * 1.2;

                createProgressRingChart({
                    canvasId: 'ordersDetailChart',
                    labels: recentTrends.map(t => t.period),
                    values: recentTrends.map(t => t.count),
                    maxValues: recentTrends.map(() => maxTrendValue),
                    title: 'Order Volume Trend',
                    showCenterText: true,
                    centerLabel: recentTrends[0].period
                });

                const topCategories = data.by_category.slice(0, 3);  // Top 3 categories
                const maxCategoryValue = Math.max(...topCategories.map(c => c.count)) * 1.2;

                createProgressRingChart({
                    canvasId: 'ordersCategoryChart',
                    labels: topCategories.map(c => c.category),
                    values: topCategories.map(c => c.count),
                    maxValues: topCategories.map(() => maxCategoryValue),
                    title: 'Orders by Category',
                    showCenterText: true,
                    centerLabel: topCategories[0].category
                });

                console.log('Orders tab charts created successfully');
            } catch (error) {
                console.error('Error creating orders tab charts:', error);
            }
        }, 100);

        // Update current tab data for AI context
        if (currentTab === 'orders') {
            currentTabData = data;
        }

    } catch (error) {
        console.error('Error rendering orders data:', error);
        container.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
                <h3 class="text-red-800 font-bold mb-2">Error Loading Orders Data</h3>
                <p class="text-red-600 text-sm">${error.message}</p>
                <pre class="text-xs text-red-500 mt-2 overflow-auto">${error.stack}</pre>
            </div>
        `;
    }
}

async function loadComplianceData() {
    const container = document.getElementById('compliance-content');

    let data;
    try {
        const response = await fetch(`${API_BASE}${CONFIG.api.endpoints.overview}`);
        const result = await response.json();

        if (result.success) {
            data = result.data.compliance;
        } else {
            data = TEST_DATA.overview.compliance;
        }
    } catch (error) {
        console.log('API unavailable, using test data for compliance');
        data = TEST_DATA.overview.compliance;
    }

    try {
        // Ensure data has required fields
        if (!data.rejection_rate) {
            data.rejection_rate = data.overall_return_rate * 0.6; // Estimate rejection is 60% of returns
        }

        container.innerHTML = `
            <div class="space-y-6">
                <!-- KPI Cards -->
                <div class="grid grid-cols-4 gap-6">
                    <div class="bg-white border border-green-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Compliance Rate</h3>
                        <p class="text-3xl font-bold text-green-600">${(100 - data.overall_return_rate).toFixed(1)}%</p>
                        <p class="text-xs text-gray-500 mt-2">Overall compliance</p>
                    </div>
                    <div class="bg-white border border-orange-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Total Returns</h3>
                        <p class="text-3xl font-bold text-orange-600">${data.total_returns.toLocaleString()}</p>
                        <p class="text-xs text-gray-500 mt-2">This month</p>
                    </div>
                    <div class="bg-white border border-blue-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Total Claims</h3>
                        <p class="text-3xl font-bold text-blue-600">${data.total_claims.toLocaleString()}</p>
                        <p class="text-xs text-gray-500 mt-2">Processed</p>
                    </div>
                    <div class="bg-white border border-purple-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Rejection Rate</h3>
                        <p class="text-3xl font-bold text-purple-600">${data.rejection_rate.toFixed(1)}%</p>
                        <p class="text-xs text-gray-500 mt-2">Needs improvement</p>
                    </div>
                </div>

                <!-- Charts -->
                <div class="grid grid-cols-2 gap-6">
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">✅ Compliance Trend</h3>
                        <div class="h-80"><canvas id="complianceTrendChart"></canvas></div>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">📊 Return Reasons</h3>
                        <div class="h-80"><canvas id="complianceReasonsChart"></canvas></div>
                    </div>
                </div>

                <!-- Top Issues -->
                <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">⚠️ Top Compliance Issues</h3>
                    <div class="space-y-3">
                        ${data.top_return_reasons.map(reason => `
                            <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                                <div>
                                    <p class="font-semibold text-gray-800">${reason.reason}</p>
                                    <p class="text-sm text-gray-600">${reason.count} instances</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-lg font-bold text-orange-600">${reason.percentage.toFixed(1)}%</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Create Apple Watch-style progress ring charts (with delay to ensure DOM is ready)
        setTimeout(() => {
            try {
                const recentMonths = data.monthly_trend.slice(-3);  // Last 3 months

                createProgressRingChart({
                    canvasId: 'complianceTrendChart',
                    labels: recentMonths.map(t => t.month),
                    values: recentMonths.map(t => 100 - t.return_rate),
                    maxValues: [100, 100, 100],  // Compliance rate is always out of 100%
                    title: 'Compliance Trend',
                    showCenterText: true,
                    centerLabel: recentMonths[0].month
                });

                const topReasons = data.top_return_reasons.slice(0, 3);  // Top 3 reasons
                const maxReasonCount = Math.max(...topReasons.map(r => r.count)) * 1.2;

                createProgressRingChart({
                    canvasId: 'complianceReasonsChart',
                    labels: topReasons.map(r => r.reason),
                    values: topReasons.map(r => r.count),
                    maxValues: topReasons.map(() => maxReasonCount),
                    title: 'Return Reasons',
                    showCenterText: true,
                    centerLabel: topReasons[0].reason
                });

                console.log('Compliance tab charts created successfully');
            } catch (error) {
                console.error('Error creating compliance tab charts:', error);
            }
        }, 100);

        // Update current tab data for AI context
        if (currentTab === 'compliance') {
            currentTabData = data;
        }

    } catch (error) {
        console.error('Error rendering compliance data:', error);
        container.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
                <h3 class="text-red-800 font-bold mb-2">Error Loading Compliance Data</h3>
                <p class="text-red-600 text-sm">${error.message}</p>
                <pre class="text-xs text-red-500 mt-2 overflow-auto">${error.stack}</pre>
            </div>
        `;
    }
}

async function loadReimbursementData() {
    const container = document.getElementById('reimbursement-content');

    let data;
    try {
        const response = await fetch(`${API_BASE}${CONFIG.api.endpoints.overview}`);
        const result = await response.json();

        if (result.success) {
            data = result.data.reimbursement;
        } else {
            data = TEST_DATA.overview.reimbursement;
        }
    } catch (error) {
        console.log('API unavailable, using test data for reimbursement');
        data = TEST_DATA.overview.reimbursement;
    }

    try {
        // Ensure data has required fields - calculate reimbursement_rate if missing
        if (!data.reimbursement_percentage && data.claims_reimbursed && data.total_claims) {
            data.reimbursement_percentage = (data.claims_reimbursed / data.total_claims) * 100;
        }
        if (!data.by_payer) {
            data.by_payer = [];
        }
        // Ensure each payer has reimbursement_rate
        data.by_payer.forEach(payer => {
            if (!payer.reimbursement_rate && payer.reimbursed_claims && payer.claims) {
                payer.reimbursement_rate = (payer.reimbursed_claims / payer.claims) * 100;
            }
        });

        container.innerHTML = `
            <div class="space-y-6">
                <!-- KPI Cards -->
                <div class="grid grid-cols-4 gap-6">
                    <div class="bg-white border border-purple-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Reimbursement Rate</h3>
                        <p class="text-3xl font-bold text-purple-600">${data.reimbursement_percentage.toFixed(1)}%</p>
                        <p class="text-xs text-green-600 mt-2">↑ ${data.growth_rate}% vs last month</p>
                    </div>
                    <div class="bg-white border border-green-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Claims Reimbursed</h3>
                        <p class="text-3xl font-bold text-green-600">${data.claims_reimbursed.toLocaleString()}</p>
                        <p class="text-xs text-gray-500 mt-2">This month</p>
                    </div>
                    <div class="bg-white border border-blue-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Total Amount</h3>
                        <p class="text-3xl font-bold text-blue-600">$${(data.total_reimbursed_amount / 1000000).toFixed(1)}M</p>
                        <p class="text-xs text-gray-500 mt-2">Reimbursed</p>
                    </div>
                    <div class="bg-white border border-orange-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Avg Turnaround</h3>
                        <p class="text-3xl font-bold text-orange-600">${data.average_turnaround_days}</p>
                        <p class="text-xs text-gray-500 mt-2">Days to reimburse</p>
                    </div>
                </div>

                <!-- Charts -->
                <div class="grid grid-cols-2 gap-6">
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">💵 Reimbursement Trend</h3>
                        <div class="h-80"><canvas id="reimbursementTrendChart"></canvas></div>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">📊 By Payer Type</h3>
                        <div class="h-80"><canvas id="reimbursementPayerChart"></canvas></div>
                    </div>
                </div>

                <!-- Payer Breakdown -->
                <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">🏥 Payer Performance</h3>
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-sm">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-2 text-left font-semibold">Payer</th>
                                    <th class="px-4 py-2 text-right font-semibold">Claims</th>
                                    <th class="px-4 py-2 text-right font-semibold">Reimbursement %</th>
                                    <th class="px-4 py-2 text-right font-semibold">Avg Days</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${data.by_payer.map(payer => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-4 py-2 font-medium">${payer.payer_name}</td>
                                        <td class="px-4 py-2 text-right">${payer.claims.toLocaleString()}</td>
                                        <td class="px-4 py-2 text-right">
                                            <span class="px-2 py-1 rounded-full text-xs font-semibold ${payer.reimbursement_rate >= 95 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                                                ${payer.reimbursement_rate.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td class="px-4 py-2 text-right">${payer.avg_turnaround_days} days</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Create charts
        const trendCtx = document.getElementById('reimbursementTrendChart').getContext('2d');
        new Chart(trendCtx, {
            type: 'bar',
            data: {
                labels: data.monthly_trend.map(t => t.month),
                datasets: [{
                    label: 'Reimbursement Rate',
                    data: data.monthly_trend.map(t => t.reimbursement_percentage),
                    borderColor: 'rgb(107, 114, 128)',
                    backgroundColor: 'rgba(156, 163, 175, 0.3)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: (value) => value + '%'
                        }
                    }
                }
            }
        });

        const payerCtx = document.getElementById('reimbursementPayerChart').getContext('2d');
        new Chart(payerCtx, {
            type: 'bar',
            data: {
                labels: data.by_payer.map(p => p.payer_name),
                datasets: [{
                    data: data.by_payer.map(p => p.claims),
                    backgroundColor: ['#A855F7', '#3B82F6', '#10B981', '#F59E0B', '#EF4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Update current tab data for AI context
        if (currentTab === 'reimbursement') {
            currentTabData = data;
        }

    } catch (error) {
        console.error('Error rendering reimbursement data:', error);
    }
}

async function loadCostsData() {
    const container = document.getElementById('costs-content');

    let data;
    try {
        const response = await fetch(`${API_BASE}${CONFIG.api.endpoints.overview}`);
        const result = await response.json();

        if (result.success) {
            data = result.data.operating_costs;
        } else {
            data = TEST_DATA.overview.operating_costs;
        }
    } catch (error) {
        console.log('API unavailable, using test data for costs');
        data = TEST_DATA.overview.operating_costs;
    }

    try {
        // Ensure data has required fields - map total_monthly_costs to total_operating_costs if needed
        if (!data.total_operating_costs && data.total_monthly_costs) {
            data.total_operating_costs = data.total_monthly_costs;
        }
        if (!data.breakdown) {
            data.breakdown = { labor: 0, equipment: 0, supplies: 0, overhead: 0 };
        }

        container.innerHTML = `
            <div class="space-y-6">
                <!-- KPI Cards -->
                <div class="grid grid-cols-4 gap-6">
                    <div class="bg-white border border-red-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Total Operating Costs</h3>
                        <p class="text-3xl font-bold text-red-600">$${(data.total_operating_costs / 1000000).toFixed(1)}M</p>
                        <p class="text-xs text-gray-500 mt-2">This month</p>
                    </div>
                    <div class="bg-white border border-blue-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Labor Costs</h3>
                        <p class="text-3xl font-bold text-blue-600">$${(data.breakdown.labor / 1000000).toFixed(1)}M</p>
                        <p class="text-xs text-gray-500 mt-2">${((data.breakdown.labor / data.total_operating_costs) * 100).toFixed(0)}% of total</p>
                    </div>
                    <div class="bg-white border border-purple-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Equipment</h3>
                        <p class="text-3xl font-bold text-purple-600">$${(data.breakdown.equipment / 1000000).toFixed(1)}M</p>
                        <p class="text-xs text-gray-500 mt-2">${((data.breakdown.equipment / data.total_operating_costs) * 100).toFixed(0)}% of total</p>
                    </div>
                    <div class="bg-white border border-orange-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Supplies</h3>
                        <p class="text-3xl font-bold text-orange-600">$${(data.breakdown.supplies / 1000000).toFixed(1)}M</p>
                        <p class="text-xs text-gray-500 mt-2">${((data.breakdown.supplies / data.total_operating_costs) * 100).toFixed(0)}% of total</p>
                    </div>
                </div>

                <!-- Charts -->
                <div class="grid grid-cols-2 gap-6">
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">💰 Cost Trend</h3>
                        <div class="h-80"><canvas id="costsTrendChart"></canvas></div>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">📊 Cost Breakdown</h3>
                        <div class="h-80"><canvas id="costsBreakdownChart"></canvas></div>
                    </div>
                </div>

                <!-- Monthly Breakdown -->
                <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">📅 Monthly Cost Analysis</h3>
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-sm">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-2 text-left font-semibold">Month</th>
                                    <th class="px-4 py-2 text-right font-semibold">Total Cost</th>
                                    <th class="px-4 py-2 text-right font-semibold">Labor</th>
                                    <th class="px-4 py-2 text-right font-semibold">Equipment</th>
                                    <th class="px-4 py-2 text-right font-semibold">Supplies</th>
                                    <th class="px-4 py-2 text-right font-semibold">Overhead</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${data.monthly_trend.slice(-6).map(month => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-4 py-2 font-medium">${month.month}</td>
                                        <td class="px-4 py-2 text-right font-semibold">$${(month.total_cost / 1000000).toFixed(2)}M</td>
                                        <td class="px-4 py-2 text-right">$${(month.labor / 1000000).toFixed(2)}M</td>
                                        <td class="px-4 py-2 text-right">$${(month.equipment / 1000000).toFixed(2)}M</td>
                                        <td class="px-4 py-2 text-right">$${(month.supplies / 1000000).toFixed(2)}M</td>
                                        <td class="px-4 py-2 text-right">$${(month.overhead / 1000000).toFixed(2)}M</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Create charts
        const trendCtx = document.getElementById('costsTrendChart').getContext('2d');
        new Chart(trendCtx, {
            type: 'bar',
            data: {
                labels: data.monthly_trend.map(t => t.month),
                datasets: [{
                    label: 'Operating Costs',
                    data: data.monthly_trend.map(t => t.total_cost / 1000000),
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => '$' + value + 'M'
                        }
                    }
                }
            }
        });

        const breakdownCtx = document.getElementById('costsBreakdownChart').getContext('2d');
        new Chart(breakdownCtx, {
            type: 'bar',
            data: {
                labels: ['Labor', 'Equipment', 'Supplies', 'Overhead'],
                datasets: [{
                    data: [
                        data.breakdown.labor,
                        data.breakdown.equipment,
                        data.breakdown.supplies,
                        data.breakdown.overhead
                    ],
                    backgroundColor: ['#3B82F6', '#A855F7', '#F59E0B', '#EF4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Update current tab data for AI context
        if (currentTab === 'costs') {
            currentTabData = data;
        }

    } catch (error) {
        console.error('Error rendering costs data:', error);
    }
}

async function loadLabData() {
    const container = document.getElementById('lab-content');

    let data;
    try {
        const response = await fetch(`${API_BASE}${CONFIG.api.endpoints.overview}`);
        const result = await response.json();

        if (result.success) {
            data = result.data.lab_metrics;
        } else {
            data = TEST_DATA.overview.lab_metrics;
        }
    } catch (error) {
        console.log('API unavailable, using test data for lab');
        data = TEST_DATA.overview.lab_metrics;
    }

    try {
        // Ensure data has required fields - map average_tat_hours to average_turnaround_hours if needed
        if (!data.average_turnaround_hours && data.average_tat_hours) {
            data.average_turnaround_hours = data.average_tat_hours;
        }
        if (!data.lab_capacity) {
            data.lab_capacity = { utilization_percentage: 0, current_load: 0, max_capacity: 0 };
        }
        if (!data.tests_by_type) {
            data.tests_by_type = [];
        }

        container.innerHTML = `
            <div class="space-y-6">
                <!-- KPI Cards -->
                <div class="grid grid-cols-4 gap-6">
                    <div class="bg-white border border-orange-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Average TAT</h3>
                        <p class="text-3xl font-bold text-orange-600">${data.average_turnaround_hours.toFixed(1)}h</p>
                        <p class="text-xs text-gray-500 mt-2">Target: ${data.target_turnaround_hours}h</p>
                    </div>
                    <div class="bg-white border border-blue-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Lab Capacity</h3>
                        <p class="text-3xl font-bold text-blue-600">${data.lab_capacity.utilization_percentage.toFixed(0)}%</p>
                        <p class="text-xs text-gray-500 mt-2">${data.lab_capacity.current_load.toLocaleString()} / ${data.lab_capacity.max_capacity.toLocaleString()}</p>
                    </div>
                    <div class="bg-white border border-green-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Efficiency Score</h3>
                        <p class="text-3xl font-bold text-green-600">${data.efficiency_score}%</p>
                        <p class="text-xs text-gray-500 mt-2">Overall efficiency</p>
                    </div>
                    <div class="bg-white border border-purple-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Error Rate</h3>
                        <p class="text-3xl font-bold ${data.error_rate < 1 ? 'text-green-600' : 'text-red-600'}">${data.error_rate}%</p>
                        <p class="text-xs text-gray-500 mt-2">Quality metric</p>
                    </div>
                </div>

                <!-- Charts -->
                <div class="grid grid-cols-2 gap-6">
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">🔬 TAT Trend</h3>
                        <div class="h-80"><canvas id="labTatChart"></canvas></div>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">📊 Tests by Type</h3>
                        <div class="h-80"><canvas id="labTestsChart"></canvas></div>
                    </div>
                </div>

                <!-- Capacity Metrics -->
                <div class="grid grid-cols-2 gap-6">
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">⚙️ Lab Capacity Utilization</h3>
                        <div class="space-y-4">
                            <div>
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-gray-600">Current Utilization</span>
                                    <span class="font-bold">${data.lab_capacity.utilization_percentage.toFixed(1)}%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-4">
                                    <div class="bg-blue-500 h-4 rounded-full" style="width: ${data.lab_capacity.utilization_percentage}%"></div>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <p class="text-sm text-gray-600">Current Load</p>
                                    <p class="text-2xl font-bold text-blue-600">${data.lab_capacity.current_load.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-600">Max Capacity</p>
                                    <p class="text-2xl font-bold text-gray-800">${data.lab_capacity.max_capacity.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">📈 Performance Metrics</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                <span class="text-sm text-gray-700">Efficiency Score</span>
                                <span class="text-xl font-bold text-green-600">${data.efficiency_score}%</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                <span class="text-sm text-gray-700">Average TAT</span>
                                <span class="text-xl font-bold text-orange-600">${data.average_turnaround_hours.toFixed(1)}h</span>
                            </div>
                            <div class="flex justify-between items-center p-3 ${data.error_rate < 1 ? 'bg-green-50' : 'bg-red-50'} rounded-lg">
                                <span class="text-sm text-gray-700">Error Rate</span>
                                <span class="text-xl font-bold ${data.error_rate < 1 ? 'text-green-600' : 'text-red-600'}">${data.error_rate}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Create Apple Watch-style progress ring charts (with delay to ensure DOM is ready)
        setTimeout(() => {
            try {
                const recentTat = data.turnaround_trend.slice(-3);  // Last 3 periods

                createProgressRingChart({
                    canvasId: 'labTatChart',
                    labels: recentTat.map(t => t.period),
                    values: recentTat.map(t => t.avg_hours),
                    maxValues: recentTat.map(() => data.target_turnaround_hours * 1.5),  // Show target as max
                    title: 'TAT Trend',
                    showCenterText: true,
                    centerLabel: recentTat[0].period
                });

                const topTests = data.tests_by_type.slice(0, 3);  // Top 3 test types
                const maxTestCount = Math.max(...topTests.map(t => t.count)) * 1.2;

                createProgressRingChart({
                    canvasId: 'labTestsChart',
                    labels: topTests.map(t => t.test_type),
                    values: topTests.map(t => t.count),
                    maxValues: topTests.map(() => maxTestCount),
                    title: 'Tests by Type',
                    showCenterText: true,
                    centerLabel: topTests[0].test_type
                });

                console.log('Labs tab charts created successfully');
            } catch (error) {
                console.error('Error creating labs tab charts:', error);
            }
        }, 100);

        // Update current tab data for AI context
        if (currentTab === 'lab') {
            currentTabData = data;
        }

    } catch (error) {
        console.error('Error rendering lab data:', error);
        container.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
                <h3 class="text-red-800 font-bold mb-2">Error Loading Labs Data</h3>
                <p class="text-red-600 text-sm">${error.message}</p>
                <pre class="text-xs text-red-500 mt-2 overflow-auto">${error.stack}</pre>
            </div>
        `;
    }
}

async function loadRegionalData() {
    const container = document.getElementById('regional-content');

    let data;
    try {
        const response = await fetch(`${API_BASE}${CONFIG.api.endpoints.overview}`);
        const result = await response.json();

        if (result.success) {
            data = result.data.regional;
        } else {
            data = TEST_DATA.overview.regional;
        }
    } catch (error) {
        console.log('API unavailable, using test data for regional');
        data = TEST_DATA.overview.regional;
    }

    try {
        // Ensure data has required fields
        if (!data.territories) {
            data.territories = [];
        }

        container.innerHTML = `
            <div class="space-y-6">
                <!-- Top Territories -->
                <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">🏆 Top Performing Territories</h3>
                    <div class="grid grid-cols-4 gap-4">
                        ${data.territories.slice(0, 4).map((territory, index) => `
                            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-2xl font-bold text-blue-600">#${index + 1}</span>
                                    <span class="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">↑ ${territory.growth_percentage}%</span>
                                </div>
                                <h4 class="font-bold text-gray-800 mb-1">${territory.territory_name}</h4>
                                <p class="text-2xl font-bold text-blue-600">${territory.orders.toLocaleString()}</p>
                                <p class="text-xs text-gray-600 mt-1">orders</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Charts -->
                <div class="grid grid-cols-2 gap-6">
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">🗺️ Orders by Territory</h3>
                        <div class="h-80"><canvas id="regionalOrdersChart"></canvas></div>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">📈 Growth Comparison</h3>
                        <div class="h-80"><canvas id="regionalGrowthChart"></canvas></div>
                    </div>
                </div>

                <!-- Detailed Territory Table -->
                <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">📊 All Territories Performance</h3>
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-sm">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-2 text-left font-semibold">Rank</th>
                                    <th class="px-4 py-2 text-left font-semibold">Territory</th>
                                    <th class="px-4 py-2 text-right font-semibold">Orders</th>
                                    <th class="px-4 py-2 text-right font-semibold">Revenue</th>
                                    <th class="px-4 py-2 text-right font-semibold">Growth</th>
                                    <th class="px-4 py-2 text-center font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${data.territories.map((territory, index) => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-4 py-2 font-bold text-gray-600">#${index + 1}</td>
                                        <td class="px-4 py-2 font-medium">${territory.territory_name}</td>
                                        <td class="px-4 py-2 text-right font-semibold">${territory.orders.toLocaleString()}</td>
                                        <td class="px-4 py-2 text-right">$${(territory.revenue / 1000000).toFixed(1)}M</td>
                                        <td class="px-4 py-2 text-right">
                                            <span class="px-2 py-1 rounded-full text-xs font-semibold ${territory.growth_percentage >= 10 ? 'bg-green-100 text-green-700' : territory.growth_percentage >= 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}">
                                                ${territory.growth_percentage >= 0 ? '↑' : '↓'} ${Math.abs(territory.growth_percentage)}%
                                            </span>
                                        </td>
                                        <td class="px-4 py-2 text-center">
                                            <span class="px-2 py-1 rounded-full text-xs font-semibold ${index < 3 ? 'bg-green-100 text-green-700' : index < 7 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}">
                                                ${index < 3 ? 'Excellent' : index < 7 ? 'Good' : 'Average'}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Create charts
        const ordersCtx = document.getElementById('regionalOrdersChart').getContext('2d');
        new Chart(ordersCtx, {
            type: 'bar',
            data: {
                labels: data.territories.map(t => t.territory_name),
                datasets: [{
                    label: 'Orders',
                    data: data.territories.map(t => t.orders),
                    backgroundColor: '#3B82F6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: { legend: { display: false } }
            }
        });

        const growthCtx = document.getElementById('regionalGrowthChart').getContext('2d');
        new Chart(growthCtx, {
            type: 'bar',
            data: {
                labels: data.territories.map(t => t.territory_name),
                datasets: [{
                    label: 'Growth %',
                    data: data.territories.map(t => t.growth_percentage),
                    backgroundColor: data.territories.map(t => t.growth_percentage >= 0 ? '#22C55E' : '#EF4444')
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => value + '%'
                        }
                    }
                }
            }
        });

        // Update current tab data for AI context
        if (currentTab === 'regional') {
            currentTabData = data;
        }

    } catch (error) {
        console.error('Error rendering regional data:', error);
    }
}

async function loadForecastingData() {
    const container = document.getElementById('forecasting-content');

    let data;
    try {
        const response = await fetch(`${API_BASE}${CONFIG.api.endpoints.overview}`);
        const result = await response.json();

        if (result.success) {
            data = result.data.forecasting;
        } else {
            data = TEST_DATA.overview.forecasting;
        }
    } catch (error) {
        console.log('API unavailable, using test data for forecasting');
        data = TEST_DATA.overview.forecasting;
    }

    try {
        // Ensure data has required fields
        if (!data.quarterly_forecast) {
            data.quarterly_forecast = [];
        }
        if (!data.assumptions) {
            data.assumptions = { market_growth_rate: 0, seasonality_factor: 'N/A' };
        }

        container.innerHTML = `
            <div class="space-y-6">
                <!-- KPI Cards -->
                <div class="grid grid-cols-4 gap-6">
                    <div class="bg-white border border-indigo-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Next Quarter Forecast</h3>
                        <p class="text-3xl font-bold text-indigo-600">${(data.next_quarter_orders / 1000).toFixed(0)}K</p>
                        <p class="text-xs text-green-600 mt-2">↑ ${data.forecast_growth}% projected</p>
                    </div>
                    <div class="bg-white border border-purple-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Revenue Forecast</h3>
                        <p class="text-3xl font-bold text-purple-600">$${(data.revenue_forecast / 1000000).toFixed(1)}M</p>
                        <p class="text-xs text-gray-500 mt-2">Next quarter</p>
                    </div>
                    <div class="bg-white border border-blue-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Confidence Level</h3>
                        <p class="text-3xl font-bold text-blue-600">${data.confidence_level}%</p>
                        <p class="text-xs text-gray-500 mt-2">Forecast accuracy</p>
                    </div>
                    <div class="bg-white border border-green-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Year-End Projection</h3>
                        <p class="text-3xl font-bold text-green-600">${(data.year_end_projection / 1000000).toFixed(1)}M</p>
                        <p class="text-xs text-gray-500 mt-2">Total orders</p>
                    </div>
                </div>

                <!-- Charts -->
                <div class="grid grid-cols-2 gap-6">
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">🔮 Order Forecast</h3>
                        <div class="h-80"><canvas id="forecastOrdersChart"></canvas></div>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">💰 Revenue Forecast</h3>
                        <div class="h-80"><canvas id="forecastRevenueChart"></canvas></div>
                    </div>
                </div>

                <!-- Forecast Details -->
                <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">📊 Quarterly Forecast Breakdown</h3>
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-sm">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-2 text-left font-semibold">Quarter</th>
                                    <th class="px-4 py-2 text-right font-semibold">Orders</th>
                                    <th class="px-4 py-2 text-right font-semibold">Revenue</th>
                                    <th class="px-4 py-2 text-right font-semibold">Growth</th>
                                    <th class="px-4 py-2 text-center font-semibold">Confidence</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${data.quarterly_forecast.map(quarter => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-4 py-2 font-medium">${quarter.quarter}</td>
                                        <td class="px-4 py-2 text-right font-semibold">${quarter.orders.toLocaleString()}</td>
                                        <td class="px-4 py-2 text-right">$${(quarter.revenue / 1000000).toFixed(2)}M</td>
                                        <td class="px-4 py-2 text-right">
                                            <span class="px-2 py-1 rounded-full text-xs font-semibold ${quarter.growth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                                                ${quarter.growth >= 0 ? '↑' : '↓'} ${Math.abs(quarter.growth)}%
                                            </span>
                                        </td>
                                        <td class="px-4 py-2 text-center">
                                            <span class="px-2 py-1 rounded-full text-xs font-semibold ${quarter.confidence >= 85 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                                                ${quarter.confidence}%
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Key Assumptions -->
                <div class="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">📝 Key Assumptions</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-white rounded-lg p-4">
                            <p class="text-sm text-gray-600 mb-2">Market Growth Rate</p>
                            <p class="text-xl font-bold text-indigo-600">${data.assumptions.market_growth_rate}%</p>
                        </div>
                        <div class="bg-white rounded-lg p-4">
                            <p class="text-sm text-gray-600 mb-2">Seasonality Factor</p>
                            <p class="text-xl font-bold text-purple-600">${data.assumptions.seasonality_factor}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Create charts
        const ordersCtx = document.getElementById('forecastOrdersChart').getContext('2d');
        new Chart(ordersCtx, {
            type: 'bar',
            data: {
                labels: data.quarterly_forecast.map(q => q.quarter),
                datasets: [{
                    label: 'Forecast',
                    data: data.quarterly_forecast.map(q => q.orders),
                    backgroundColor: 'rgba(156, 163, 175, 0.7)',
                    borderColor: 'rgb(107, 114, 128)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: { legend: { display: false } }
            }
        });

        const revenueCtx = document.getElementById('forecastRevenueChart').getContext('2d');
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: data.quarterly_forecast.map(q => q.quarter),
                datasets: [{
                    label: 'Revenue Forecast',
                    data: data.quarterly_forecast.map(q => q.revenue / 1000000),
                    borderColor: 'rgb(107, 114, 128)',
                    backgroundColor: 'rgba(156, 163, 175, 0.3)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => '$' + value + 'M'
                        }
                    }
                }
            }
        });

        // Update current tab data for AI context
        if (currentTab === 'forecasting') {
            currentTabData = data;
        }

    } catch (error) {
        console.error('Error rendering forecasting data:', error);
    }
}

async function loadMarketData() {
    const container = document.getElementById('market-content');

    let data;
    try {
        const response = await fetch(`${API_BASE}${CONFIG.api.endpoints.overview}`);
        const result = await response.json();

        if (result.success) {
            data = result.data.market_intelligence;
        } else {
            data = TEST_DATA.overview.market_intelligence;
        }
    } catch (error) {
        console.log('API unavailable, using test data for market');
        data = TEST_DATA.overview.market_intelligence;
    }

    try {
        // Ensure data has required fields
        if (!data.critical_alerts) {
            data.critical_alerts = [];
        }
        if (!data.latest_news) {
            data.latest_news = [];
        }
        if (!data.competitor_updates) {
            data.competitor_updates = [];
        }
        if (!data.market_trends) {
            data.market_trends = { market_share: [], market_size_billions: 0, growth_rate: 0 };
        }

        container.innerHTML = `
            <div class="space-y-6">
                <!-- Critical Alerts -->
                ${data.critical_alerts.length > 0 ? `
                    <div class="bg-red-50 border-2 border-red-500 rounded-xl p-6">
                        <h3 class="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                            <span class="text-2xl">🚨</span> Critical Market Alerts
                        </h3>
                        <div class="space-y-3">
                            ${data.critical_alerts.map(alert => `
                                <div class="bg-white border-l-4 border-red-500 p-4 rounded">
                                    <p class="font-semibold text-red-900">${alert}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Latest News -->
                <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">📰 Latest Market News</h3>
                    <div class="space-y-4">
                        ${data.latest_news.map(news => `
                            <div class="border-l-4 ${news.importance === 'high' ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'} p-4 rounded">
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-bold text-gray-900">${news.title}</h4>
                                    <span class="px-2 py-1 rounded-full text-xs font-semibold ${news.importance === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}">
                                        ${news.importance.toUpperCase()}
                                    </span>
                                </div>
                                <p class="text-sm text-gray-700 mb-2">${news.summary}</p>
                                <div class="flex justify-between text-xs text-gray-500">
                                    <span>${news.source}</span>
                                    <span>${news.date}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Competitor Updates -->
                <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">🏢 Competitor Activity</h3>
                    <div class="space-y-4">
                        ${data.competitor_updates.map(update => `
                            <div class="border-l-4 ${update.impact_level === 'high' ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'} p-4 rounded">
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-bold text-gray-900">${update.competitor_name}</h4>
                                    <span class="px-2 py-1 rounded-full text-xs font-semibold ${update.impact_level === 'high' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}">
                                        ${update.impact_level.toUpperCase()} IMPACT
                                    </span>
                                </div>
                                <p class="text-sm text-gray-700">${update.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Market Trends -->
                <div class="grid grid-cols-2 gap-6">
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">📈 Market Share Trends</h3>
                        <div class="space-y-3">
                            ${data.market_trends.market_share.map(share => `
                                <div>
                                    <div class="flex justify-between text-sm mb-1">
                                        <span class="font-medium">${share.company}</span>
                                        <span class="font-bold">${share.percentage}%</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2">
                                        <div class="bg-blue-500 h-2 rounded-full" style="width: ${share.percentage}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">🎯 Industry Insights</h3>
                        <div class="space-y-3">
                            <div class="bg-gray-100 border border-gray-300 rounded-lg p-3">
                                <p class="text-sm text-gray-700"><strong>Market Size:</strong> $${data.market_trends.market_size_billions}B</p>
                            </div>
                            <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p class="text-sm text-gray-700"><strong>Growth Rate:</strong> ${data.market_trends.growth_rate}% YoY</p>
                            </div>
                            <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                <p class="text-sm text-gray-700"><strong>Emerging Trend:</strong> ${data.market_trends.emerging_trend}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Update current tab data for AI context
        if (currentTab === 'market') {
            currentTabData = data;
        }

    } catch (error) {
        console.error('Error rendering market data:', error);
    }
}

async function loadMilestonesData() {
    const container = document.getElementById('milestones-content');

    let data;
    try {
        const response = await fetch(`${API_BASE}${CONFIG.api.endpoints.overview}`);
        const result = await response.json();

        if (result.success) {
            data = result.data.milestones;
        } else {
            data = TEST_DATA.overview.milestones;
        }
    } catch (error) {
        console.log('API unavailable, using test data for milestones');
        data = TEST_DATA.overview.milestones;
    }

    try {
        // Ensure data has required fields
        if (!data.critical_items) {
            data.critical_items = [];
        }
        if (!data.active_projects) {
            data.active_projects = [];
        }
        if (!data.total_projects && data.active_projects) {
            data.total_projects = data.active_projects.length;
        }
        if (!data.projects_on_track && data.active_projects) {
            data.projects_on_track = data.active_projects.filter(p => p.overall_status === 'on_track').length;
        }
        if (!data.projects_at_risk && data.active_projects) {
            data.projects_at_risk = data.active_projects.filter(p => p.overall_status === 'at_risk').length;
        }
        if (!data.projects_delayed && data.active_projects) {
            data.projects_delayed = data.active_projects.filter(p => p.overall_status === 'delayed').length;
        }

        container.innerHTML = `
            <div class="space-y-6">
                <!-- Summary Cards -->
                <div class="grid grid-cols-4 gap-6">
                    <div class="bg-white border border-blue-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Total Projects</h3>
                        <p class="text-3xl font-bold text-blue-600">${data.total_projects || 0}</p>
                        <p class="text-xs text-gray-500 mt-2">Active projects</p>
                    </div>
                    <div class="bg-white border border-green-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">On Track</h3>
                        <p class="text-3xl font-bold text-green-600">${data.projects_on_track || 0}</p>
                        <p class="text-xs text-gray-500 mt-2">${data.total_projects > 0 ? Math.round((data.projects_on_track / data.total_projects) * 100) : 0}% of total</p>
                    </div>
                    <div class="bg-white border border-orange-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">At Risk</h3>
                        <p class="text-3xl font-bold text-orange-600">${data.projects_at_risk || 0}</p>
                        <p class="text-xs text-gray-500 mt-2">Need attention</p>
                    </div>
                    <div class="bg-white border border-red-200 rounded-xl shadow-sm p-6">
                        <h3 class="text-sm text-gray-600 mb-2">Delayed</h3>
                        <p class="text-3xl font-bold text-red-600">${data.projects_delayed || 0}</p>
                        <p class="text-xs text-gray-500 mt-2">Behind schedule</p>
                    </div>
                </div>

                <!-- Critical Items -->
                ${data.critical_items && data.critical_items.length > 0 ? `
                    <div class="bg-orange-50 border-2 border-orange-500 rounded-xl p-6">
                        <h3 class="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
                            <span class="text-2xl">⚠️</span> Critical Items Requiring Attention
                        </h3>
                        <div class="space-y-2">
                            ${data.critical_items.map(item => `
                                <div class="bg-white border-l-4 border-orange-500 p-3 rounded">
                                    <p class="text-sm font-semibold text-gray-800">${item}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Active Projects -->
                <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">🎯 Active Projects</h3>
                    ${data.active_projects && data.active_projects.length > 0 ? `
                        <div class="space-y-4">
                            ${data.active_projects.map(project => `
                                <div class="border rounded-lg p-4 ${
                                    project.overall_status === 'on_track' ? 'border-green-200 bg-green-50' :
                                    project.overall_status === 'at_risk' ? 'border-orange-200 bg-orange-50' :
                                    'border-red-200 bg-red-50'
                                }">
                                    <div class="flex justify-between items-start mb-3">
                                        <div class="flex-1">
                                            <h4 class="font-bold text-gray-900">${project.project_name}</h4>
                                            ${project.description ? `<p class="text-sm text-gray-600 mt-1">${project.description}</p>` : ''}
                                        </div>
                                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                                            project.overall_status === 'on_track' ? 'bg-green-100 text-green-700' :
                                            project.overall_status === 'at_risk' ? 'bg-orange-100 text-orange-700' :
                                            'bg-red-100 text-red-700'
                                        }">
                                            ${project.overall_status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>

                                    <div class="mb-3">
                                        <div class="flex justify-between text-sm mb-1">
                                            <span class="text-gray-600">Progress</span>
                                            <span class="font-bold">${project.completion_percentage}%</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-full h-2">
                                            <div class="${
                                                project.overall_status === 'on_track' ? 'bg-green-500' :
                                                project.overall_status === 'at_risk' ? 'bg-orange-500' :
                                                'bg-red-500'
                                            } h-2 rounded-full" style="width: ${project.completion_percentage}%"></div>
                                        </div>
                                    </div>

                                    ${project.start_date || project.target_end_date || project.project_owner ? `
                                        <div class="grid grid-cols-3 gap-3 mb-3">
                                            ${project.start_date ? `
                                                <div class="text-sm">
                                                    <p class="text-gray-600">Start Date</p>
                                                    <p class="font-semibold">${project.start_date}</p>
                                                </div>
                                            ` : ''}
                                            ${project.target_end_date ? `
                                                <div class="text-sm">
                                                    <p class="text-gray-600">Target End</p>
                                                    <p class="font-semibold">${project.target_end_date}</p>
                                                </div>
                                            ` : ''}
                                            ${project.project_owner ? `
                                                <div class="text-sm">
                                                    <p class="text-gray-600">Owner</p>
                                                    <p class="font-semibold">${project.project_owner}</p>
                                                </div>
                                            ` : ''}
                                        </div>
                                    ` : ''}

                                    ${project.key_milestones && project.key_milestones.length > 0 ? `
                                        <div class="border-t pt-3">
                                            <p class="text-sm font-semibold text-gray-700 mb-2">Key Milestones:</p>
                                            <div class="space-y-2">
                                                ${project.key_milestones.map(milestone => `
                                                    <div class="flex items-center gap-2 text-sm">
                                                        <span class="${milestone.status === 'completed' ? 'text-green-600' : milestone.status === 'in_progress' ? 'text-blue-600' : 'text-gray-400'}">
                                                            ${milestone.status === 'completed' ? '✓' : milestone.status === 'in_progress' ? '◐' : '○'}
                                                        </span>
                                                        <span class="flex-1">${milestone.milestone_name}</span>
                                                        <span class="text-xs text-gray-500">${milestone.target_date}</span>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <p class="text-gray-500 text-center py-8">No active projects at this time</p>
                    `}
                </div>
            </div>
        `;

        // Update current tab data for AI context
        if (currentTab === 'milestones') {
            currentTabData = data;
        }

    } catch (error) {
        console.error('Error rendering milestones data:', error);
    }
}

// ==================== INTERACTIVE METRIC CHARTS ====================

// Store metric data and chart instances for interactive period switching
let metricData = {};
let metricCharts = {};
let currentPeriods = {};

// Initialize from config
Object.keys(CONFIG.metrics).forEach(metricKey => {
    metricData[metricKey] = null;
    currentPeriods[metricKey] = CONFIG.metrics[metricKey].defaultPeriod;
});

// Generate sample data for doughnut charts (all periods combined)
function generateMetricData(metric, period) {
    const metricConfig = CONFIG.metrics[metric];

    // For doughnut charts, return data for all periods
    const labels = CONFIG.charts.doughnutLabels;
    const data = metricConfig.periods.map(p => {
        const baseValue = metricConfig.baseValues[p];
        const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
        return baseValue * (1 + variance);
    });

    return { labels, data };
}

// Update metric chart when period button is clicked
function updateMetricPeriod(metric, period) {
    currentPeriods[metric] = period;

    // Update button styles
    const buttons = document.querySelectorAll(`[data-metric="${metric}"]`);
    const metricConfig = CONFIG.metrics[metric];

    buttons.forEach(btn => {
        const btnPeriod = btn.getAttribute('data-period');
        if (btnPeriod === period) {
            // Apply active button style from config
            btn.style.backgroundColor = metricConfig.bgColor;
            btn.style.color = metricConfig.textColor;
            btn.className = `period-btn px-2 py-1 text-xs rounded font-semibold`;
        } else {
            btn.style.backgroundColor = '';
            btn.style.color = '';
            btn.className = 'period-btn px-2 py-1 text-xs rounded hover:bg-gray-100 text-gray-600';
        }
    });

    // Update chart
    const { labels, data } = generateMetricData(metric, period);
    const chart = metricCharts[metric];

    if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
    }
}

// Create all metric charts
function createMetricCharts() {
    Object.keys(CONFIG.metrics).forEach(metric => {
        try {
            const canvasId = `chart${metric.charAt(0).toUpperCase() + metric.slice(1)}`;
            const canvas = document.getElementById(canvasId);

            if (!canvas) {
                console.warn(`Canvas element ${canvasId} not found for metric ${metric}`);
                return;
            }

            const metricConfig = CONFIG.metrics[metric];
            const { labels, data } = generateMetricData(metric, metricConfig.defaultPeriod);

            // Create Apple Watch style progress rings
            const ringLabels = labels.slice(0, Math.min(3, labels.length));
            const ringValues = data.slice(0, Math.min(3, data.length));

            // Calculate max values for each ring (for progress calculation)
            const maxValue = Math.max(...ringValues) * 1.2; // 120% of max for scaling
            const maxValues = ringValues.map(() => maxValue);

            metricCharts[metric] = createProgressRingChart({
                canvasId: canvasId,
                labels: ringLabels,
                values: ringValues,
                maxValues: maxValues,
                title: metricConfig.label,
                centerLabel: ringLabels[0],
                showCenterText: true
            });

            console.log(`Successfully created chart for ${metric}`);
        } catch (error) {
            console.error(`Error creating chart for ${metric}:`, error);
        }
    });
}

// ==================== AI REASONING WIDGET ====================

let reasoningWidgetCollapsed = false;

function toggleReasoningWidget() {
    const widget = document.getElementById('aiReasoningWidget');
    const content = document.getElementById('reasoningContent');
    const btn = event.target;

    if (reasoningWidgetCollapsed) {
        content.classList.remove('hidden');
        btn.textContent = '−';
        reasoningWidgetCollapsed = false;
    } else {
        content.classList.add('hidden');
        btn.textContent = '+';
        reasoningWidgetCollapsed = true;
    }
}

function analyzeCurrentPage() {
    const currentTab = getCurrentTab();
    document.getElementById('reasoningInput').value = `Analyze all metrics on the ${currentTab} page and provide insights`;
    askReasoning();
}

function getCurrentTab() {
    const activeTab = document.querySelector('[id^="tab-"].tab-active');
    return activeTab ? activeTab.id.replace('tab-', '') : 'overview';
}

// ==================== QUICK NOTES ====================

function saveQuickNote() {
    const input = document.getElementById('quickNoteInput');
    const note = input.value.trim();
    if (!note) return;

    const notes = JSON.parse(localStorage.getItem('quickNotes') || '[]');
    notes.unshift({
        id: Date.now(),
        text: note,
        timestamp: new Date().toLocaleString()
    });

    // Keep only configured max notes
    if (notes.length > CONFIG.overview.widgets.notes.maxNotes) {
        notes = notes.slice(0, CONFIG.overview.widgets.notes.maxNotes);
    }

    localStorage.setItem('quickNotes', JSON.stringify(notes));
    input.value = '';
    renderQuickNotes();
}

function renderQuickNotes() {
    const display = document.getElementById('quickNotesDisplay');
    if (!display) return;

    const notes = JSON.parse(localStorage.getItem('quickNotes') || '[]');

    if (notes.length === 0) {
        display.innerHTML = '<p class="text-gray-400 text-xs">No notes yet</p>';
        return;
    }

    display.innerHTML = notes.slice(0, CONFIG.overview.widgets.notes.displayNotes).map(note => `
        <div class="bg-amber-50 border-l-2 border-amber-500 p-2 rounded">
            <p class="text-gray-800">${note.text}</p>
            <p class="text-gray-400 text-xs mt-1">${note.timestamp}</p>
        </div>
    `).join('');
}

// ==================== AI ASSISTANT FUNCTIONS ====================

async function askReasoning() {
    const input = document.getElementById('reasoningInput');
    const question = input.value.trim();
    if (!question) return;

    const messagesDiv = document.getElementById('reasoningMessages');

    // Add user question at the TOP (insert before first child)
    const userMsg = document.createElement('div');
    userMsg.className = 'bg-blue-50 border border-blue-100 rounded-lg p-3 mb-2';
    userMsg.innerHTML = `<p class="text-xs font-semibold text-gray-700">You:</p><p class="text-xs text-gray-800">${question}</p>`;
    messagesDiv.insertBefore(userMsg, messagesDiv.firstChild);

    // Add loading at the TOP
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'bg-blue-50 rounded-lg p-3 mb-2';
    loadingMsg.id = 'loading-reasoning';
    loadingMsg.innerHTML = '<div class="flex items-center gap-2"><div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div><div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div><div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div><span class="text-xs text-gray-600 ml-2">Analyzing...</span></div>';
    messagesDiv.insertBefore(loadingMsg, messagesDiv.firstChild);

    input.value = '';

    try {
        let result;
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

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('API unavailable');
            }

            result = await response.json();
        } catch (apiError) {
            // Fallback to smart mock response when API is unavailable
            console.log('API unavailable, using smart mock response:', apiError);

            // Use generateAIResponse if available, otherwise use simple fallback
            let mockResponse;
            try {
                if (typeof generateAIResponse === 'function') {
                    mockResponse = generateAIResponse(question);
                } else {
                    mockResponse = {
                        response: `I understand you're asking about "${question}". The AI backend is currently offline. Please start the backend server with 'python run_app.py' to get intelligent AI-powered responses. In the meantime, you can view the dashboard data and test metrics.`,
                        agent_used: 'Offline Mode'
                    };
                }
            } catch (genError) {
                console.error('Error generating mock response:', genError);
                mockResponse = {
                    response: `The AI backend is currently offline. Please start the backend server with 'python run_app.py' to get AI-powered responses.`,
                    agent_used: 'Offline Mode'
                };
            }

            result = {
                success: true,
                answer: mockResponse.response + '\n\n💡 Note: This is a test response. For full AI analysis, start the backend with: python run_app.py',
                tab_name: currentTab,
                model: 'Test Mode (' + mockResponse.agent_used + ')'
            };
        }

        console.log('Ask Reasoning Response:', result);

        // Remove loading
        document.getElementById('loading-reasoning')?.remove();

        if (result.success || result.answer) {
            // Add AI response at the TOP
            const aiMsg = document.createElement('div');
            aiMsg.className = 'bg-white border border-gray-300 shadow-sm rounded-lg p-3 mb-2';

            const answer = result.answer || result.text || 'No response received';

            // Check if voice response is enabled (but NOT if Full Voice Mode is active to avoid duplicates)
            const voiceEnabled = document.getElementById('voiceResponseEnabled')?.checked;
            if (voiceEnabled && !isFullVoiceMode) {
                speakText(answer);
            }

            // Escape HTML and convert newlines
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
                    <span class="text-xs text-gray-500">${result.tab_name || currentTab}</span>
                </div>
                <div class="text-xs text-gray-700">${escapedAnswer}</div>
                ${result.model ? `<div class="text-xs text-gray-400 mt-1 italic">Model: ${result.model}</div>` : ''}
                ${voiceEnabled ? '<div class="text-xs text-gray-400 mt-1 italic">🔊 Voice response played</div>' : ''}
            `;
            messagesDiv.insertBefore(aiMsg, messagesDiv.firstChild);
        } else {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'bg-red-50 border border-red-200 rounded-lg p-3 mb-2';
            errorMsg.innerHTML = `<p class="text-xs text-red-800">Error: ${result.error || 'Failed to get response'}</p>`;
            messagesDiv.insertBefore(errorMsg, messagesDiv.firstChild);
        }
    } catch (error) {
        document.getElementById('loading-reasoning')?.remove();
        const errorMsg = document.createElement('div');
        errorMsg.className = 'bg-red-50 border border-red-200 rounded-lg p-3 mb-2';
        errorMsg.innerHTML = `<p class="text-xs text-red-800">Error: ${error.message}</p>`;
        messagesDiv.insertBefore(errorMsg, messagesDiv.firstChild);
        console.error('Ask Reasoning Error:', error);
    }
}

async function askQuick(question) {
    const messagesDiv = document.getElementById('reasoningMessages');

    // Add user question at the TOP (insert before first child)
    const userMsg = document.createElement('div');
    userMsg.className = 'bg-blue-50 border border-blue-100 rounded-lg p-3 mb-2';
    userMsg.innerHTML = `<p class="text-xs font-semibold text-gray-700">You:</p><p class="text-xs text-gray-800">${question}</p>`;
    messagesDiv.insertBefore(userMsg, messagesDiv.firstChild);

    // Add loading at the TOP
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'bg-blue-50 rounded-lg p-3 mb-2';
    loadingMsg.id = 'loading-quick';
    loadingMsg.innerHTML = '<div class="flex items-center gap-2"><div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div><div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div><div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div><span class="text-xs text-gray-600 ml-2">Analyzing...</span></div>';
    messagesDiv.insertBefore(loadingMsg, messagesDiv.firstChild);

    try {
        let result;
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

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('API unavailable');
            }

            result = await response.json();
        } catch (apiError) {
            // Fallback to smart mock response when API is unavailable
            console.log('API unavailable for quick question, using smart mock response:', apiError);

            // Use generateAIResponse if available, otherwise use simple fallback
            let mockResponse;
            try {
                if (typeof generateAIResponse === 'function') {
                    mockResponse = generateAIResponse(question);
                } else {
                    mockResponse = {
                        response: `I understand you're asking about "${question}". The AI backend is currently offline. Please start the backend server with 'python run_app.py' to get intelligent AI-powered responses.`,
                        agent_used: 'Offline Mode'
                    };
                }
            } catch (genError) {
                console.error('Error generating mock response:', genError);
                mockResponse = {
                    response: `The AI backend is currently offline. Please start the backend server with 'python run_app.py' to get AI-powered responses.`,
                    agent_used: 'Offline Mode'
                };
            }

            result = {
                success: true,
                answer: mockResponse.response + '\n\n💡 Note: This is a test response. For full AI analysis, start the backend with: python run_app.py',
                tab_name: currentTab,
                model: 'Test Mode (' + mockResponse.agent_used + ')'
            };
        }

        console.log('Ask Quick Response:', result);

        // Remove loading
        document.getElementById('loading-quick')?.remove();

        if (result.success || result.answer) {
            // Add AI response at the TOP
            const aiMsg = document.createElement('div');
            aiMsg.className = 'bg-white border border-gray-300 shadow-sm rounded-lg p-3 mb-2';

            const answer = result.answer || result.text || 'No response received';

            // Check if voice response is enabled (but NOT if Full Voice Mode is active to avoid duplicates)
            const voiceEnabled = document.getElementById('voiceResponseEnabled')?.checked;
            if (voiceEnabled && !isFullVoiceMode) {
                speakText(answer);
            }

            // Escape HTML and convert newlines
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
                    <span class="text-xs text-gray-500">${result.tab_name || currentTab}</span>
                </div>
                <div class="text-xs text-gray-700">${escapedAnswer}</div>
                ${result.model ? `<div class="text-xs text-gray-400 mt-1 italic">Model: ${result.model}</div>` : ''}
                ${voiceEnabled ? '<div class="text-xs text-gray-400 mt-1 italic">🔊 Voice response played</div>' : ''}
            `;
            messagesDiv.insertBefore(aiMsg, messagesDiv.firstChild);
        } else {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'bg-red-50 border border-red-200 rounded-lg p-3 mb-2';
            errorMsg.innerHTML = `<p class="text-xs text-red-800">Error: ${result.error || 'Failed to get response'}</p>`;
            messagesDiv.insertBefore(errorMsg, messagesDiv.firstChild);
        }
    } catch (error) {
        document.getElementById('loading-quick')?.remove();
        const errorMsg = document.createElement('div');
        errorMsg.className = 'bg-red-50 border border-red-200 rounded-lg p-3 mb-2';
        errorMsg.innerHTML = `<p class="text-xs text-red-800">Error: ${error.message}</p>`;
        messagesDiv.insertBefore(errorMsg, messagesDiv.firstChild);
        console.error('Ask Quick Error:', error);
    }
}

// Initialize metric charts and quick notes on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('Initializing metric charts...');
        createMetricCharts();
        renderQuickNotes();
        console.log('Chart initialization complete');
    }, 1500);  // Increased timeout to ensure all elements are loaded
});

// ==================== REMINDERS FUNCTIONALITY ====================
let reminders = JSON.parse(localStorage.getItem('quickReminders') || '[]');

function loadReminders() {
    const list = document.getElementById('quick-reminders-list');
    if (!list) return;

    if (reminders.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center py-4">No reminders yet</p>';
        return;
    }

    list.innerHTML = reminders.map((reminder, index) => {
        const checked = reminder.completed ? 'checked' : '';
        const lineThrough = reminder.completed ? 'line-through text-gray-400' : '';
        const desc = reminder.description ? '<p class="text-gray-600">' + reminder.description + '</p>' : '';
        return '<div class="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200">' +
            '<input type="checkbox" onchange="toggleReminder(' + index + ')" ' + checked + ' class="mt-1">' +
            '<div class="flex-1 ' + lineThrough + '">' +
            '<p class="font-semibold text-gray-800">' + reminder.title + '</p>' +
            desc +
            '</div>' +
            '<button onclick="deleteReminder(' + index + ')" class="text-red-500 hover:text-red-700">×</button>' +
            '</div>';
    }).join('');
}

function addReminder(title, description) {
    if (!title) {
        title = prompt('Reminder title:');
        if (!title) return;
        description = prompt('Description (optional):') || '';
    }

    reminders.push({
        id: Date.now(),
        title: title,
        description: description || '',
        completed: false,
        created: new Date().toISOString()
    });

    localStorage.setItem('quickReminders', JSON.stringify(reminders));
    loadReminders();
    return true;
}

function toggleReminder(index) {
    reminders[index].completed = !reminders[index].completed;
    localStorage.setItem('quickReminders', JSON.stringify(reminders));
    loadReminders();
}

function deleteReminder(index) {
    reminders.splice(index, 1);
    localStorage.setItem('quickReminders', JSON.stringify(reminders));
    loadReminders();
}

function getReminders() {
    return reminders;
}

// Initialize reminders when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadReminders);
} else {
    loadReminders();
}
