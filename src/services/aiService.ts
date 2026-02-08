import { supabase } from "@/integrations/supabase/client";
import { Hotel } from "@/constants/types";

interface SovereignSearchResult {
  recommendedIds: string[];
  strategicBriefing: string;
  marketInsight: string;
}

interface SuperiorityItem {
  attribute: string;
  marketStandard: string;
  zenithAdvantage: string;
}

interface SuperiorityAnalysis {
  items: SuperiorityItem[];
}

interface ChatResponse {
  text: string;
  sources: string[];
}

async function callOracle<T>(action: string, payload: any): Promise<T> {
  const { data, error } = await supabase.functions.invoke("sovereign-oracle", {
    body: { action, payload },
  });

  if (error) {
    console.error(`Oracle ${action} error:`, error);
    throw error;
  }

  // Handle fallback responses
  if (data?.fallback) {
    console.warn(`Oracle ${action}: using fallback response`);
    return data.fallback as T;
  }

  return data as T;
}

export async function processSovereignSearch(
  query: string,
  hotels: Hotel[]
): Promise<SovereignSearchResult> {
  try {
    return await callOracle<SovereignSearchResult>("sovereign-search", {
      query,
      hotels: hotels.map((h) => ({
        id: h.id,
        name: h.name,
        location: h.location,
        country: h.country,
        tier: h.tier,
        rating: h.rating,
        amenities: h.amenities,
      })),
    });
  } catch {
    return {
      recommendedIds: hotels.map((h) => h.id),
      strategicBriefing:
        "Protocolo de Contingência Zenith: Excedido limite neural. Exibindo buffer de fundação.",
      marketInsight: "Volatilidade offline.",
    };
  }
}

export async function streamSovereignSearch(
  query: string,
  hotels: Hotel[],
  onDelta: (text: string) => void,
  onDone: (recommendedIds: string[]) => void
): Promise<void> {
  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sovereign-oracle`;

  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        action: "sovereign-search-stream",
        payload: {
          query,
          hotels: hotels.map((h) => ({
            id: h.id,
            name: h.name,
            location: h.location,
            tier: h.tier,
          })),
        },
      }),
    });

    if (!resp.ok || !resp.body) {
      throw new Error("Stream failed");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            fullText += content;
            onDelta(content);
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Extract hotel IDs from response like [hotel-1, hotel-2]
    const idMatch = fullText.match(/\[([^\]]+)\]/);
    const recommendedIds = idMatch
      ? idMatch[1].split(",").map((id) => id.trim())
      : hotels.map((h) => h.id);

    onDone(recommendedIds);
  } catch {
    onDelta("Protocolo de Contingência Zenith: Modo streaming offline.");
    onDone(hotels.map((h) => h.id));
  }
}

export async function getHotelInsight(hotel: Hotel): Promise<string> {
  try {
    const result = await callOracle<{ text: string }>("hotel-insight", {
      hotel: {
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        country: hotel.country,
        tier: hotel.tier,
        rating: hotel.rating,
        amenities: hotel.amenities,
        description: hotel.description,
      },
    });
    return result.text;
  } catch {
    return "Ativo validado via Protocolo de Contingência Zenith.";
  }
}

export async function getSuperiorityAnalysis(
  hotel: Hotel
): Promise<SuperiorityAnalysis> {
  try {
    return await callOracle<SuperiorityAnalysis>("superiority-analysis", {
      hotel: {
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        tier: hotel.tier,
        rating: hotel.rating,
        amenities: hotel.amenities,
      },
    });
  } catch {
    return {
      items: [
        {
          attribute: "Privacidade",
          marketStandard: "Limitada",
          zenithAdvantage: "Soberana (Buffer)",
        },
      ],
    };
  }
}

export async function getChatResponse(
  message: string,
  hotel: Hotel,
  history: { role: string; parts: { text: string }[] }[]
): Promise<ChatResponse> {
  try {
    return await callOracle<ChatResponse>("chat", {
      message,
      hotel: {
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        country: hotel.country,
        tier: hotel.tier,
        amenities: hotel.amenities,
      },
      history,
    });
  } catch {
    return {
      text: "⚠️ Oráculo em modo de segurança (Quota).",
      sources: [],
    };
  }
}

export async function processVisualSearch(
  _imageFile: File,
  hotels: Hotel[]
): Promise<{
  recommendedIds: string[];
  visualAnalysis: string;
  matchReason: string;
}> {
  // Visual search requires image processing - using fallback for now
  return {
    recommendedIds: hotels.length > 0 ? [hotels[0].id] : [],
    visualAnalysis: "Estética identificada no buffer local.",
    matchReason: "Conformidade Zenith detectada.",
  };
}

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<{ text: string; value: number; currency: string; rate: number; sources: string[] }> {
  // Currency conversion - using static fallback
  return {
    text: "Câmbio Offline",
    value: amount,
    currency: to,
    rate: 1,
    sources: [],
  };
}
