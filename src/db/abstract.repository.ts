import { Connection } from './connection';

export abstract class AbstractRepository {
  protected connection = new Connection();
  protected async insertArrayObjects(tableName: string, arrayObject: object[], foreignKeyField?: string, foreign_id?: number) {
    for (let object of arrayObject) {
      this.insertAndGetID(tableName, object, foreignKeyField, foreign_id);
    }
  }

  protected getIdOrInsert = async (table: string, columns: object, conj: boolean  = false): Promise<number>=>{
    try{
      Object.keys(columns).forEach(key=>{
        if(columns[key] === null){
          delete columns[key]
        }
      })
    const result = await this.getByFields(table, columns, conj)
    if(!result.length){
      return await this.insertAndGetID(table, columns)
    }
    return result[0].id
  } catch(e){
    console.log(e)
    throw new Error
  }
  }

  protected async insertAndGetID(
    tableName: string,
    columns: object,
    foreignKeyField?: string,
    foreign_id?: number
  ): Promise<number> {
    try {
      if (foreignKeyField != undefined && foreign_id != undefined) {
        columns[foreignKeyField] = foreign_id;
      }
      const columnValues = Object.values(columns);
      const valuesPlaceholder = columnValues.map((_, i: number) => `$${i + 1}`).join(', ');
      const columnNames = Object.keys(columns)
        .map((columnName: string) => `"${columnName}"`)
        .join(', ');

      const sql = `INSERT INTO "${tableName}" (${columnNames}) VALUES (${valuesPlaceholder}) RETURNING id`;
      let result = await this.connection.sqlQuery(sql, columnValues);

      return this.getID_afterInsert(result);
    } catch (e) {
      console.log(e);
      throw new Error()
    }
  }

  protected async updateTable(tableName: string, columns: object) {
    const columnValues = Object.values(columns);
    const valuesPlaceholder = columnValues.map((_, i: number) => `$${i + 1}`).join(', ');
    const columnNames = Object.keys(columns)
      .map((columnName: string) => `${columnName}`)
      .join(', ');

    const sql = `UPDATE "${tableName}" SET (${columnNames}) = (${valuesPlaceholder}) WHERE id = ${columns['id']}`;
    await this.connection.sqlQuery(sql, columnValues);
  }

  protected getID_afterInsert(queryResult: object): number {
    let id: number;

    try {
      id = queryResult[0].id;
    } catch (error) {
      console.log(error);
    }

    return queryResult[0].id;
  }

  protected getByFields(table: string, columns: object, conj: boolean = false) {
    const columnValues = Object.values(columns);
    const columnNames = Object.keys(columns).map((columnName: string) => `${columnName}`);
    const conditions = columnNames
      .map((cond, index) => {
        return `"${cond}" = '${columnValues[index]}'`;
      })
      .join(conj ? ' AND ' : ' OR ');
      
      const query = `SELECT * FROM ${table} WHERE ${conditions}`
    return this.connection.sqlQuery(query);
  }
}
