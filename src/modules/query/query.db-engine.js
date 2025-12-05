import pkg from "pg";
const { Client } = pkg;
import { ApiError } from "../../core/error.js";
import { detectColumnType } from "../query/query.type.js";
import { dbConnectionService } from "../db/dbConnection.service.js";

export const dbQueryEngine = {
  run: async ({ dataset, query, connection }) => {
    const cfg = connection.config;

    const client = new Client({
      host: cfg.host,
      port: cfg.port,
      database: cfg.database,
      user: cfg.user,
      password: cfg.password,
    });

    await client.connect();

    const table = dataset.config.table;

    // ==========================================
    // STEP 1 — LOAD COLUMN SCHEMA
    // ==========================================
    const schema = await dbConnectionService.getTableSchema(connection, table);

    // Build { column_name: "number" | "string" | "date" }
    const columnTypes = {};
    schema.forEach((col) => {
      columnTypes[col.column_name] = detectColumnType(col.data_type);
    });

    // ==========================================
    // STEP 2 — BUILD SQL BASE
    // ==========================================
    let sql = `SELECT * FROM "${table}"`;
    const params = [];
    let where = [];

    // ----------------------------
    // 1) FILTERING
    // ----------------------------
    if (query.filters) {
      query.filters.forEach((f) => {
        const field = f.field;
        const type = columnTypes[field];

        if (!type) throw ApiError.badRequest(`Unknown field: ${field}`);

        let value = f.value;

        // Convert types
        if (type === "number") {
          value = Number(value);
          if (isNaN(value))
            throw ApiError.badRequest(`Value for ${field} must be number`);
        }

        if (type === "date") {
          value = new Date(value);
          if (value.toString() === "Invalid Date") {
            throw ApiError.badRequest(`Invalid date format for ${field}`);
          }
        }

        const paramKey = `$${params.length + 1}`;

        if (f.op === "contains") {
          if (type !== "string") {
            throw ApiError.badRequest(`contains only valid for string columns`);
          }
          params.push(`%${value}%`);
          where.push(`"${field}" ILIKE ${paramKey}`);
          return;
        }

        // Other ops (=, !=, <, >)
        switch (f.op) {
          case "=":
          case "!=":
          case ">":
          case "<":
            params.push(value);
            where.push(`"${field}" ${f.op} ${paramKey}`);
            break;

          default:
            throw ApiError.badRequest(`Unsupported operator: ${f.op}`);
        }
      });
    }

    if (where.length > 0) {
      sql += ` WHERE ${where.join(" AND ")}`;
    }

    // ----------------------------
    // 2) GROUP BY
    // ----------------------------
    if (query.groupBy) {
      const field = query.groupBy;

      if (!columnTypes[field])
        throw ApiError.badRequest(`Unknown field: ${field}`);

      const groupSql = `
        SELECT "${field}", COUNT(*) AS count
        FROM "${table}"
        ${where.length > 0 ? `WHERE ${where.join(" AND ")}` : ""}
        GROUP BY "${field}"
      `;

      const { rows } = await client.query(groupSql, params);
      await client.end();

      return rows;
    }

    // ----------------------------
    // 3) AGGREGATION
    // ----------------------------
    if (query.aggregate) {
      const { field, op } = query.aggregate;

      if (!columnTypes[field])
        throw ApiError.badRequest(`Unknown field: ${field}`);

      const type = columnTypes[field];

      const opMap = {
        sum: "SUM",
        avg: "AVG",
        max: "MAX",
        min: "MIN",
        count: "COUNT",
      };

      if (!opMap[op]) throw ApiError.badRequest(`Unsupported aggregate: ${op}`);
      if (type !== "number" && op !== "count") {
        throw ApiError.badRequest(
          `Aggregation '${op}' only valid for numeric columns`
        );
      }

      const aggSql = `
        SELECT ${opMap[op]}("${field}") AS value
        FROM "${table}"
        ${where.length > 0 ? `WHERE ${where.join(" AND ")}` : ""}
      `;

      const { rows } = await client.query(aggSql, params);
      await client.end();
      return rows[0];
    }

    // ----------------------------
    // 4) SORTING (sanitized)
    // ----------------------------
    if (query.sort && query.sort.field) {
      const field = query.sort.field;
      const order = query.sort.order?.toUpperCase() === "DESC" ? "DESC" : "ASC";

      if (!columnTypes[field])
        throw ApiError.badRequest(`Unknown field: ${field}`);

      const type = columnTypes[field];

      if (type === "string") {
        sql += ` ORDER BY LOWER("${field}") ${order}`;
      } else {
        sql += ` ORDER BY "${field}" ${order}`;
      }
    }

    // ----------------------------
    // 5) PAGINATION
    // ----------------------------
    const limit = query.limit || 50;
    const page = query.page || 1;
    const offset = (page - 1) * limit;

    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    const { rows } = await client.query(sql, params);

    // ----------------------------
    // 6) COUNT TOTAL ROWS
    // ----------------------------
    const countSql = `
      SELECT COUNT(*) AS total
      FROM "${table}"
      ${where.length > 0 ? `WHERE ${where.join(" AND ")}` : ""}
    `;
    const countRes = await client.query(countSql, params);

    await client.end();

    return {
      total: Number(countRes.rows[0].total),
      page,
      limit,
      rows,
      columnTypes,
    };
  },
};
