import { UAParser } from "ua-parser-js";

const location = (req) => {
  const userAgent = req.headers["user-agent"] || "";
  const parser = new UAParser(userAgent);

  const ipAddress = (
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "0.0.0.0"
  )
    .split(",")[0]
    .trim();
  const device = parser.getDevice().type || "desktop";
  const browser = parser.getBrowser().name || "unknown";
  const os = parser.getOS().name || "unknown";

  return { ipAddress, userAgent, device, browser, os };
};

export default location;
