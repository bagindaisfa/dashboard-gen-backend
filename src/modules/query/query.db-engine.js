import pkg from "pg";
const { Client } = pkg;

export const dbQueryEngine = {
  run: async ({ dataset, query, connection }) => {
    const client = new Client({
      host: connection.host,
      port: connection.port,
      database: connection.database,
      user: connection.username,
      password: connection.password,
    });

    await client.connect();

    let sql = `SELECT * FROM ${dataset.config.table}`;
    const params = [];
    let whereClauses = [];

    // 1. FILTERING
    if (query.filters) {
      query.filters.forEach((f, i) => {
        const paramKey = `$${i + 1}`;

        switch (f.op) {
          case "=":
            whereClauses.push(`"${f.field}" = ${paramKey}`);
            params.push(f.value);
            break;
          case "!=":
            whereClauses.push(`"${f.field}" != ${paramKey}`);
            params.push(f.value);
            break;
          case ">":
            whereClauses.push(`"${f.field}" > ${paramKey}`);
            params.push(f.value);
            break;
          case "<":
            whereClauses.push(`"${f.field}" < ${paramKey}`);
            params.push(f.value);
            break;
          case "contains":
            whereClauses.push(`"${f.field}" ILIKE ${paramKey}`);
            params.push(`%${f.value}%`);
            break;
        }
      });
    }

    if (whereClauses.length) {
      sql += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    // 2. SORTING
    if (query.sort) {
      sql += ` ORDER BY "${query.sort.field}" ${query.sort.order}`;
    }

    // 3. PAGINATION
    const page = query.page || 1;
    const limit = query.limit || 50;
    const offset = (page - 1) * limit;

    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    const { rows } = await client.query(sql, params);

    await client.end();

    return {
      page,
      limit,
      rows,
    };
  },
};
