// ===================================================================
// ELEVENLABS VOICE CONFIGURATION - EXAMPLE
// ===================================================================
// Copy this file to voice-config.local.js and add your real API keys
// voice-config.local.js is gitignored and will never be committed

const VOICE_CONFIG = {
    // Get your API key from: https://elevenlabs.io/app/settings/api-keys
    ELEVENLABS_API_KEY: 'YOUR_ELEVENLABS_API_KEY_HERE',

    // Get your voice ID from: https://elevenlabs.io/app/voice-library
    // Or use one of the pre-made voices
    VOICE_ID: 'YOUR_VOICE_ID_HERE',

    // Voice settings
    model: 'eleven_monolingual_v1',
    stability: 0.5,
    similarity_boost: 0.75
};
