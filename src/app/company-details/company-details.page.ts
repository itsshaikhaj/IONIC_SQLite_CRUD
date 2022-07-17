import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { HelperService } from '../services/helper.service';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.page.html',
  styleUrls: ['./company-details.page.scss'],
})
export class CompanyDetailsPage implements OnInit {
  dataReturned: any;
  name: any;
  email: any;
  city: any;
  address: any;
  id: any;
  constructor(
    public popoverCtrl : PopoverController,
    private sqLiteService: SqliteService,
    private helperService: HelperService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getCompanyDetails();
  }

  async addOrEditContact(type:any, item:any) {
    let data = item ? item : {};
    data.type = type
    const popover = await this.popoverCtrl.create({
      component: ModalPage,
      componentProps: {
        "paramID":1,
        "data" : item,
      },
      animated: true,
      showBackdrop: false,
      mode: "md",
      backdropDismiss: true,
      cssClass: 'my-psp-pop',
    });
    popover.onDidDismiss().then((dataReturned) => {
      if(dataReturned.data == undefined){
        return;
      }
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        if (this.dataReturned == 'submitted') {
          this.getCompanyDetails();
        }
      }
    });
      return await popover.present();
  }

  remove(id) {
    this.sqLiteService.delete(id).then(() => {
      this.helperService.presentToastSuccess('Record deleted successfully!')
      this.router.navigate(['/home'])
    })
    .catch(e => {
      alert(JSON.stringify(e))
    });
  }

  getCompanyDetails() {
    this.sqLiteService.getUser(this.id).then((res) => {
      this.name = res['name'];
      this.email = res['email']; 
      this.city = res['city']; 
      this.address = res['address']; 
    })
  }
}
