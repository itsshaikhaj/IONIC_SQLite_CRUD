import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  companyList: any = [];

  constructor(
    private router: Router,
    public sqLiteService: SqliteService,
  ) {
    this.sqLiteService.databaseConn();
  }

  ionViewDidEnter() {  
    this.sqLiteService.getAllRecords();
    console.log('this.sqLiteService.getAllRecords() :', this.sqLiteService.getAllRecords());
    this.companyList = this.sqLiteService.getAllRecords()
    console.log('this.companyList :', this.companyList);
  }

  goToDetails() {
    this.router.navigate(['/company-details'])
  }

}
