import { loadFileRows } from "../dataset/dataset.parser.js";

export const fileQueryEngine = {
  run: ({ dataset, query }) => {
    let rows = loadFileRows(dataset.config.filePath);

    // 1. Filtering
    if (query.filters) {
      for (let f of query.filters) {
        rows = rows.filter((row) => {
          const v = row[f.field];
          switch (f.op) {
            case "=":
              return v == f.value;
            case "!=":
              return v != f.value;
            case ">":
              return Number(v) > Number(f.value);
            case "<":
              return Number(v) < Number(f.value);
            case "contains":
              return String(v)
                .toLowerCase()
                .includes(String(f.value).toLowerCase());
            default:
              return true;
          }
        });
      }
    }

    // 2. Sorting
    if (query.sort) {
      const { field, order } = query.sort;
      rows = rows.sort((a, b) => {
        if (order === "asc") return a[field] > b[field] ? 1 : -1;
        return a[field] < b[field] ? 1 : -1;
      });
    }

    // 3. Grouping
    if (query.groupBy) {
      const field = query.groupBy;
      const grouped = {};

      for (let row of rows) {
        const key = row[field];
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(row);
      }

      return Object.entries(grouped).map(([key, items]) => ({
        key,
        count: items.length,
      }));
    }

    // 4. Aggregation
    if (query.aggregate) {
      const { field, op } = query.aggregate;

      const nums = rows.map((r) => Number(r[field])).filter((n) => !isNaN(n));

      let value = null;
      switch (op) {
        case "sum":
          value = nums.reduce((a, b) => a + b, 0);
          break;
        case "avg":
          value = nums.reduce((a, b) => a + b, 0) / nums.length;
          break;
        case "max":
          value = Math.max(...nums);
          break;
        case "min":
          value = Math.min(...nums);
          break;
        case "count":
          value = rows.length;
          break;
      }

      return { value };
    }

    // -----------------------------------------------------
    // 5. SELECT (projection)
    // -----------------------------------------------------
    if (
      query.select &&
      Array.isArray(query.select) &&
      !query.select.includes("*")
    ) {
      rows = rows.map((row) => {
        const picked = {};
        query.select.forEach((field) => {
          picked[field] = row[field];
        });
        return picked;
      });
    }

    // 6. Pagination
    const total = rows.length;
    const limit = query.limit || 50;
    const page = query.page || 1;
    const offset = (page - 1) * limit;

    return {
      total,
      page,
      limit,
      rows: rows.slice(offset, offset + limit),
    };
  },
};
