import crypto from "crypto";

export function buildQuerySignature(datasetId, query) {
  const json = JSON.stringify({ datasetId, query });
  return crypto.createHash("sha256").update(json).digest("hex");
}
