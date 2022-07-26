import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  companyList: any = [];
  backButtonSubscription: any;
  loader: any;

  constructor(
    private router: Router,
    public sqLiteService: SqliteService,
    public platform: Platform,
    private alertCtrl: AlertController,
    public loadingController: LoadingController,
  ) {
    this.sqLiteService.databaseConn();
  }

  ionViewDidEnter() {
    this.sqLiteService.getAllRecords();
    this.companyList = this.sqLiteService.getAllRecords()
  }

  ngAfterViewInit() {
    this.backButtonSubscription =
      this.platform.backButton.subscribeWithPriority(11, () => {
        ("back button pressed");
        if (window.location.pathname == '/home') {
          this.exitApp();
        }
        else {
          this.backButtonSubscription.unsubscribe();
        }
      });
  }

  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }

  goToDetails() {
    this.router.navigate(['/company-details'])
  }




  async exitApp() {
    const me = this;
    const alert = await this.alertCtrl.create({
      header: "Exit App",
      message: "Are you sure you want to exit app?",
      buttons: [
        {
          text: "No",
          role: "no",
          handler: () => { },
        },
        {
          text: "Yes",
          handler: () => {
            (navigator as any).app.exitApp();
          },
        },
      ],
    });
    await alert.present();
  }
}
