import { Request } from "express";

export function generateMetadata(request: Request): Record<string, any> {
  return {
    ip: request.ip,
    userAgent: request.headers["user-agent"],
    referer: request.headers.referer,
    host: request.headers.host,
    method: request.method,
    url: request.originalUrl,
    timestamp: new Date().toISOString(),
  };
}

type TrafficSource = {
  type: "paid" | "organic" | "direct" | "referral";
  platform?: string;
  source?: string;
};

export function detectTrafficSource(req: Request): TrafficSource {
  const url = new URL(req.protocol + "://" + req.get("host") + req.originalUrl);

  const utmSource = url.searchParams.get("utm_source");
  const utmMedium = url.searchParams.get("utm_medium");
  const utmCampaign = url.searchParams.get("utm_campaign");

  const referrer = req.get("referer") || "";

  // 1. Tráfego pago (UTM)
  if (utmMedium && ["cpc", "paid", "ppc", "ads"].includes(utmMedium)) {
    return {
      type: "paid",
      platform: utmSource || "unknown",
      source: utmCampaign || undefined,
    };
  }

  // 2. Social / plataformas conhecidas
  const socialPlatforms: Record<string, string> = {
    "facebook.com": "facebook",
    "instagram.com": "instagram",
    "t.co": "twitter",
    "linkedin.com": "linkedin",
    "youtube.com": "youtube",
    "wa.me": "whatsapp",
  };

  for (const domain in socialPlatforms) {
    if (referrer.includes(domain)) {
      return {
        type: "referral",
        platform: socialPlatforms[domain],
        source: "social",
      };
    }
  }

  // 3. Orgânico (search engines)
  const searchEngines = ["google.", "bing.", "yahoo.", "duckduckgo."];

  if (searchEngines.some((se) => referrer.includes(se))) {
    return {
      type: "organic",
      platform: "search",
      source: "seo",
    };
  }

  // 4. Referral genérico
  if (referrer) {
    return {
      type: "referral",
      platform: new URL(referrer).hostname,
    };
  }

  // 5. Direct (sem referrer nem UTM)
  return {
    type: "direct",
  };
}
