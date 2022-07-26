import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private androidPermissions: AndroidPermissions,
    public platform: Platform,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.router.navigateByUrl('splash');
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        result => {
          if (!result.hasPermission) {
            this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA]).then((data: any) => {
              if (data.hasPermission) {
                return data.hasPermission;
              }
            });
          }
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      );
    });
    // this.statusBar.styleDefault();
    // this.splashScreen.hide();  
  }
}
