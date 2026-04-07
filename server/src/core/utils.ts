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
