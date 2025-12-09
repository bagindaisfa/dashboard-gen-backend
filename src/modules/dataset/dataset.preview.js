import fs from "fs";
import XLSX from "xlsx";
import { parse } from "csv-parse";

export const datasetPreview = {
  async previewFile(filePath, limit = 50) {
    if (filePath.endsWith(".xlsx")) {
      const workbook = XLSX.readFile(filePath, { sheetStubs: true });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      // Read only limited rows
      const json = XLSX.utils.sheet_to_json(sheet, {
        range: `A1:Z${limit + 1}`,
      });

      return json.slice(0, limit);
    }

    if (filePath.endsWith(".csv")) {
      return await new Promise((resolve, reject) => {
        const rows = [];
        let count = 0;

        fs.createReadStream(filePath)
          .pipe(parse({ columns: true }))
          .on("data", (row) => {
            if (count < limit) {
              rows.push(row);
              count++;
            } else {
              // stop reading early
              this.destroy?.();
            }
          })
          .on("end", () => resolve(rows))
          .on("error", reject);
      });
    }

    throw new Error("Unsupported file type for preview");
  },
};
