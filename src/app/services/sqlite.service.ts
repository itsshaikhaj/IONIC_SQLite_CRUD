import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {


  private dbInstance: SQLiteObject;
  readonly db_name: string = "test.db";
  readonly db_table: string = "userTable";
  COMPANIES: Array<any>;

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private helperService: HelperService
  ) {
    // this.databaseConn();
  }



  // Create SQLite database 
  databaseConn() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: this.db_name,
        location: 'default'
      }).then((sqLite: SQLiteObject) => {
        this.dbInstance = sqLite;
        sqLite.executeSql(`
                  CREATE TABLE IF NOT EXISTS ${this.db_table} (
                    _id INTEGER PRIMARY KEY, 
                    name varchar(255),
                    email varchar(255),
                    city varchar(255),
                    address varchar(255)
                  )`, [])
          .then((res) => {
          })
          .catch((error) => alert(JSON.stringify(error)));
      })
        .catch((error) => alert(JSON.stringify(error)));
    });
  }

  // Crud
  public create(name, email, city, address) {
    return this.dbInstance.executeSql(`
      INSERT INTO ${this.db_table} (name, email, city, address) VALUES ('${name}', '${email}', '${city}', '${address}')`, [])
  }

  getAllRecords() {
    return this.dbInstance.executeSql(`SELECT * FROM ${this.db_table}`, []).then((res) => {
      this.COMPANIES = [];
      if (res.rows.length > 0) {
      console.log('res :', res);
        for (var i = 0; i < res.rows.length; i++) {
          this.COMPANIES.push(res.rows.item(i));
        }
        console.log('this.COMPANIES :', this.COMPANIES);
        return this.COMPANIES;
      }
    }, (e) => {
      alert(JSON.stringify(e));
    });
  }

  // Get user
  getUser(id): Promise<any> {
    return this.dbInstance.executeSql(`SELECT * FROM ${this.db_table} WHERE _id = ?`, [id])
      .then((res) => {
      console.log('res :', res);
        return {
          _id: res.rows.item(0)._id,
          name: res.rows.item(0).name,
          email: res.rows.item(0).email,
          city: res.rows.item(0).city,
          address: res.rows.item(0).address,
        }
      });
  }

  // Update
  update(id, name, email, city, address) {
    let data = [name, email, city, address];
    return this.dbInstance.executeSql(`UPDATE ${this.db_table} SET name = ?, email = ?, city = ?, address = ? WHERE _id = ${id}`, data)
  }

  // Delete
  delete(user) {
    return this.dbInstance.executeSql(`
      DELETE FROM ${this.db_table} WHERE _id = ${user}`, [])

  }

}
