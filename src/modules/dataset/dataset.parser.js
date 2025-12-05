import XLSX from "xlsx";
import fs from "fs";
import { parse as csvParseSync } from "csv-parse/sync";

export function loadFileRows(filePath) {
  if (filePath.endsWith(".xlsx") || filePath.endsWith(".xls")) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
  }

  if (filePath.endsWith(".csv")) {
    const content = fs.readFileSync(filePath);
    return csvParseSync(content, { columns: true });
  }

  throw new Error("Unsupported file type");
}
