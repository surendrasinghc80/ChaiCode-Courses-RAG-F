export const dynamic = "force-dynamic";

// POST /api/tts
// Body: { text: string, voiceId?: string, modelId?: string, stability?: number, similarityBoost?: number }
export async function POST(req) {
  try {
    const {
      text,
      voiceId,
      modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2",
      speed = 0.9,
      stability = 0.5,
      similarityBoost = 0.75,
      style = 0.0,
      use_speaker_boost = true,
      // Optional: output_format per ElevenLabs docs
      // format: "mp3_44100_128",
    } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Missing text" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Server missing ELEVENLABS_API_KEY" }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        }
      );
    }

    const resolvedVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID;
    if (!resolvedVoiceId) {
      return new Response(
        JSON.stringify({
          error: "No voiceId provided and ELEVENLABS_VOICE_ID not set",
        }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        }
      );
    }

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${resolvedVoiceId}`;

    const body = {
      text,
      model_id: modelId,
      voice_settings: {
        stability,
        similarity_boost: similarityBoost,
        style,
        use_speaker_boost,
        speed,
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(
        JSON.stringify({ error: "ElevenLabs error", details: errText }),
        {
          status: 502,
          headers: { "content-type": "application/json" },
        }
      );
    }

    const audioBuffer = await res.arrayBuffer();
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Unexpected error", details: String(e) }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}
