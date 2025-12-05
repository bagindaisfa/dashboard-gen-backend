import { Client } from "pg";
import prisma from "../../core/prisma.js";
import { ApiError } from "../../core/error.js";

export const dbConnectionService = {
  async testConnection(config) {
    const client = new Client(config);
    try {
      await client.connect();
      await client.end();
      return true;
    } catch (err) {
      return false;
    }
  },

  saveConnection: (orgId, userId, config) => {
    return prisma.databaseConnection.create({
      data: {
        orgId,
        createdBy: userId,
        type: "postgres",
        config, // stored as JSON
      },
    });
  },

  getTables: async (connection) => {
    if (!connection) throw ApiError.notFound("Database connection not found");
    const client = new Client(connection.config);
    await client.connect();

    const res = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );

    await client.end();

    return res.rows.map((x) => x.table_name);
  },

  getColumns: async (connection, table) => {
    if (!connection) throw ApiError.notFound("Database connection not found");
    const client = new Client(connection.config);
    await client.connect();

    const res = await client.query(
      `SELECT column_name, data_type
       FROM information_schema.columns
       WHERE table_name = $1`,
      [table]
    );

    await client.end();

    return res.rows;
  },

  previewTable: async (connection, table, page = 1, limit = 20) => {
    if (!connection) throw ApiError.notFound("Database connection not found");
    const client = new Client(connection.config);
    await client.connect();

    const offset = (page - 1) * limit;

    const res = await client.query(
      `SELECT * FROM ${table} LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    await client.end();

    return {
      page,
      limit,
      rows: res.rows,
    };
  },
};
