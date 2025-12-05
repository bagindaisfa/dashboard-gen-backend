import pkg from "pg";
const { Client } = pkg;
import { ApiError } from "../../core/error.js";

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

    // START building SQL
    let sql = `SELECT * FROM "${table}"`;
    const params = [];
    let where = [];

    // ----------------------------
    // 1) FILTERING
    // ----------------------------
    if (query.filters) {
      query.filters.forEach((f) => {
        const paramKey = `$${params.length + 1}`;
        params.push(
          f.op === "contains" ? `%${f.value}%` : f.value
        );

        let condition = null;
        switch (f.op) {
          case "=":
          case "!=":
          case ">":
          case "<":
            condition = `"${f.field}" ${f.op} ${paramKey}`;
            break;
          case "contains":
            condition = `"${f.field}" ILIKE ${paramKey}`;
            break;
          default:
            throw ApiError.badRequest(`Unsupported operator: ${f.op}`);
        }
        where.push(condition);
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

      const opMap = {
        sum: "SUM",
        avg: "AVG",
        max: "MAX",
        min: "MIN",
        count: "COUNT",
      };

      if (!opMap[op]) {
        throw ApiError.badRequest(`Unsupported aggregate: ${op}`);
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
      const order = query.sort.order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      sql += ` ORDER BY "${query.sort.field}" ${order}`;
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
    };
  },
};
