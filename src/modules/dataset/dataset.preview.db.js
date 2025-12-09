import { dbConnectionService } from "../db/dbConnection.service";

export const dbDatasetPreview = {
  async preview(connection, table, limit = 50) {
    const client = await dbConnectionService.testConnection(connection);

    // Try to detect first column for safe ordering
    const schema = await dbConnectionService.getTableSchema(connection, table);
    const firstColumn = schema[0]?.column_name;

    const sql = firstColumn
      ? `SELECT * FROM "${table}" ORDER BY "${firstColumn}" ASC LIMIT ${limit}`
      : `SELECT * FROM "${table}" LIMIT ${limit}`;

    const { rows } = await client.query(sql);

    await client.end();
    return rows;
  },
};
