import prisma from "../utils/prisma.js";
import pkg from "pg";
const { Client } = pkg;

export const dbConnectionService = {
  testConnection: async (config) => {
    const client = new Client(config);

    try {
      await client.connect();
      await client.end();
      return true;
    } catch (err) {
      return false;
    }
  },

  saveConnection: async (orgId, userId, config) => {
    return prisma.databaseConnection.create({
      data: {
        orgId,
        createdBy: userId,
        type: "postgres",
        config,
      },
    });
  },

  getTables: async (connection) => {
    const client = new Client(connection.config);
    await client.connect();

    const res = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    await client.end();
    return res.rows.map((r) => r.table_name);
  },

  getColumns: async (connection, table) => {
    const client = new Client(connection.config);
    await client.connect();

    const res = await client.query(
      `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = $1
    `,
      [table]
    );

    await client.end();
    return res.rows;
  },

  previewTable: async (connection, table) => {
    const client = new Client(connection.config);
    await client.connect();

    const res = await client.query(`
      SELECT *
      FROM ${table}
      LIMIT 20
    `);

    await client.end();
    return res.rows;
  },
};
