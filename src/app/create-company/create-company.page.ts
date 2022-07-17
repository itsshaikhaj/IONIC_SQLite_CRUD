import { SqliteService } from './../services/sqlite.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.page.html',
  styleUrls: ['./create-company.page.scss'],
})
export class CreateCompanyPage implements OnInit {
  name: any;
  email: any;
  city: any;
  address: any;
  id: any;
  isEdit: boolean = false;

  constructor(
    private helper: HelperService,
    private router: Router,
    private sqLiteService: SqliteService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    if (typeof this.activatedRoute.snapshot.paramMap.get('id') != undefined && this.activatedRoute.snapshot.paramMap.get('id') != null && this.activatedRoute.snapshot.paramMap.get('id') != '') {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('this.id :', this.id);
    this.sqLiteService.getUser(this.id).then((res) => {
      this.name = res['name'];
      this.email = res['email']; 
      this.city = res['city']; 
      this.address = res['address']; 
      this.isEdit = true;
    })
    }
  }

  addCompany() {
    this.sqLiteService.create(this.name, this.email, this.city, this.address).then((res: any) => {
      this.helper.presentToastSuccess('Record added successfully!');
      this.router.navigate(['/home'])
    }, (e) => {
      alert(JSON.stringify(e.err));
    });
  }

  updateCompany() {
    this.sqLiteService.update(this.id, this.name, this.email, this.city, this.address).then(() => {
      this.helper.presentToastSuccess('Record updated successfully!');
       this.router.navigate(['/home']);
    })
 }
}
