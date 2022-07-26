import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {


  private dbInstance: SQLiteObject;
  readonly db_name: string = "test.db";
  readonly db_table: string = "userTable";
  COMPANIES: Array<any>;
  loader: any;
  isLoading: boolean = false;

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private helperService: HelperService,
    public loadingController: LoadingController,
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
                    address varchar(255),
                    profile_pic text
                  )`, [])
          .then((res) => {
          })
          .catch((error) =>
            alert(JSON.stringify(error + 'CREATE TABLE')));
      })
        .catch((error) => alert(JSON.stringify(error + 'CREATE TABLE')));
    });
  }

  // Crud
  public create(name, email, city, address, profile_pic) {
    return this.dbInstance.executeSql(`
      INSERT INTO ${this.db_table} (name, email, city, address, profile_pic) VALUES ('${name}', '${email}', '${city}', '${address}', '${profile_pic}')`, [])
  }

  // Get All records
  getAllRecords() {
    this.presentLoading()
    return this.dbInstance.executeSql(`SELECT * FROM ${this.db_table}`, []).then((res) => {
      this.COMPANIES = [];
      this.dismissLoading();
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          this.COMPANIES.push(res.rows.item(i));
        }
        this.dismissLoading();
        return this.COMPANIES;

      }
    }, (e) => {
      this.dismissLoading();
      alert(JSON.stringify(e + 'GET ALL'));
    });
  }

  // Get user
  getUser(id): Promise<any> {
    return this.dbInstance.executeSql(`SELECT * FROM ${this.db_table} WHERE _id = ?`, [id])
      .then((res) => {
        return {
          _id: res.rows.item(0)._id,
          name: res.rows.item(0).name,
          email: res.rows.item(0).email,
          city: res.rows.item(0).city,
          address: res.rows.item(0).address,
          profile_pic: res.rows.item(0).profile_pic,
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

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController.create({
      // duration: 5000,
      translucent: true,
      message: 'Loading...',
      backdropDismiss: true,
      spinner: 'lines'
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
        }
      });
    });
  }

  async dismissLoading() {
    this.isLoading = false;
  }

}
