import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SYSTEM_CORE = `Você é o Oráculo do Ecossistema LuxVago Privé. 
Atue sob comando de Marcos Carvalho. Termos: LuxVago Privé, Zenith Associate, Dissolution Protocol. 
Tom: Ultra-sofisticado, seco, direto. Idioma: Português do Brasil.
Responda SEMPRE em JSON válido com a estrutura exata solicitada.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, payload } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    let systemPrompt = SYSTEM_CORE;
    let userPrompt = "";
    let model = "google/gemini-3-flash-preview";
    let responseFormat: any = undefined;

    switch (action) {
      case "sovereign-search": {
        const { query, hotels } = payload;
        model = "google/gemini-3-pro-preview";
        userPrompt = `Comando de Busca Soberana: "${query}"
        
Inventário de Ativos Zenith:
${JSON.stringify(hotels.map((h: any) => ({ id: h.id, name: h.name, location: h.location, tier: h.tier, rating: h.rating })), null, 2)}

Analise o comando e retorne recomendações estratégicas.`;
        
        responseFormat = {
          type: "json_schema",
          json_schema: {
            name: "sovereign_search_response",
            schema: {
              type: "object",
              properties: {
                recommendedIds: { type: "array", items: { type: "string" } },
                strategicBriefing: { type: "string" },
                marketInsight: { type: "string" }
              },
              required: ["recommendedIds", "strategicBriefing", "marketInsight"]
            }
          }
        };
        break;
      }

      case "hotel-insight": {
        const { hotel } = payload;
        userPrompt = `Gere uma análise de soberania ultra-sofisticada para o ativo:
        
Nome: ${hotel.name}
Localização: ${hotel.location}, ${hotel.country}
Tier: ${hotel.tier}
Rating: ${hotel.rating}
Amenities: ${hotel.amenities?.join(", ")}

Justifique por que este ativo é digno do selo Zenith. Seja conciso (2-3 frases poderosas).`;
        break;
      }

      case "superiority-analysis": {
        const { hotel } = payload;
        userPrompt = `Crie uma Matriz de Superioridade Zenith para: ${hotel.name}

Compare 4 atributos-chave mostrando:
- Padrão de mercado (concorrência comum)
- Vantagem Zenith (nosso diferencial soberano)

Atributos sugeridos: Privacidade, Serviço, Gastronomia, Exclusividade.`;
        
        responseFormat = {
          type: "json_schema",
          json_schema: {
            name: "superiority_matrix",
            schema: {
              type: "object",
              properties: {
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      attribute: { type: "string" },
                      marketStandard: { type: "string" },
                      zenithAdvantage: { type: "string" }
                    },
                    required: ["attribute", "marketStandard", "zenithAdvantage"]
                  }
                }
              },
              required: ["items"]
            }
          }
        };
        break;
      }

      case "chat": {
        const { message, hotel, history } = payload;
        model = "google/gemini-3-pro-preview";
        systemPrompt = `${SYSTEM_CORE}
        
Contexto: Você é o concierge virtual do hotel ${hotel.name} em ${hotel.location}.
Amenities disponíveis: ${hotel.amenities?.join(", ")}
Responda consultas de forma sofisticada e direta.`;
        
        // Build conversation from history
        const messages = [
          { role: "system", content: systemPrompt },
          ...(history || []).map((h: any) => ({
            role: h.role,
            content: h.parts?.[0]?.text || h.content || ""
          })),
          { role: "user", content: message }
        ];

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ model, messages }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          if (response.status === 429) {
            return new Response(JSON.stringify({ 
              error: "Rate limit excedido. Aguarde alguns segundos.",
              text: "⚠️ Oráculo em pausa neural. Tente novamente em instantes."
            }), {
              status: 429,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          if (response.status === 402) {
            return new Response(JSON.stringify({ 
              error: "Créditos de IA insuficientes.",
              text: "⚠️ Protocolo de contingência: recursos neurais esgotados."
            }), {
              status: 402,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          throw new Error(`AI Gateway error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "";

        return new Response(JSON.stringify({ text, sources: [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        throw new Error(`Ação desconhecida: ${action}`);
    }

    // Standard request for non-chat actions
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];

    const requestBody: any = { model, messages };
    if (responseFormat) {
      requestBody.response_format = responseFormat;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit excedido",
          fallback: getFallbackResponse(action, payload)
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "Créditos insuficientes",
          fallback: getFallbackResponse(action, payload)
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI Gateway error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse JSON response if expected
    if (responseFormat) {
      try {
        const parsed = JSON.parse(content);
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        return new Response(JSON.stringify({ 
          raw: content,
          fallback: getFallbackResponse(action, payload)
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ text: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Sovereign Oracle error:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      fallback: { 
        text: "Protocolo de Contingência Zenith ativado. Operando em modo offline." 
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function getFallbackResponse(action: string, payload: any) {
  switch (action) {
    case "sovereign-search":
      return {
        recommendedIds: payload.hotels?.map((h: any) => h.id) || [],
        strategicBriefing: "Protocolo de Contingência Zenith: Exibindo buffer de fundação.",
        marketInsight: "Análise de mercado temporariamente offline."
      };
    case "superiority-analysis":
      return {
        items: [
          { attribute: "Privacidade", marketStandard: "Limitada", zenithAdvantage: "Soberana" },
          { attribute: "Serviço", marketStandard: "Padrão", zenithAdvantage: "Antecipatório" },
          { attribute: "Gastronomia", marketStandard: "Convencional", zenithAdvantage: "Michelin Exclusivo" },
          { attribute: "Exclusividade", marketStandard: "Massificada", zenithAdvantage: "30 Associates/Cluster" }
        ]
      };
    case "hotel-insight":
      return { text: "Ativo validado via Protocolo de Contingência Zenith." };
    default:
      return { text: "Operação em modo de segurança." };
  }
}
