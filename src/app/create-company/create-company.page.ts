import { SqliteService } from './../services/sqlite.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from '../services/helper.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from "@ionic-native/file/ngx";
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";

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
  capturedSnapURL: any;

  cameraOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.CAMERA,
    allowEdit: false, //To enable/disable the user editing in camera
    encodingType: this.camera.EncodingType.PNG,
    correctOrientation: true,
  }
  loader: any;

  constructor(
    private helper: HelperService,
    private router: Router,
    private sqLiteService: SqliteService,
    private activatedRoute: ActivatedRoute,
    private camera: Camera,
    private file: File,
    public actionSheetController: ActionSheetController,
    private androidPermissions: AndroidPermissions,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {

    if (typeof this.activatedRoute.snapshot.paramMap.get('id') != undefined && this.activatedRoute.snapshot.paramMap.get('id') != null && this.activatedRoute.snapshot.paramMap.get('id') != '') {
      this.id = this.activatedRoute.snapshot.paramMap.get('id');
      this.sqLiteService.presentLoading().then(() => {
        this.sqLiteService.getUser(this.id).then((res) => {
          this.sqLiteService.dismissLoading();
          this.name = res['name'];
          this.email = res['email'];
          this.city = res['city'];
          this.address = res['address'];
          this.isEdit = true;
        });
      });
    }
  }

  getPermission() {
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA).then((data: any) => {
      if (data.hasPermission) {
        this.takeSnap();
      }
      else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      }
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select profile using...",
      buttons: [
        {
          text: "Camera",
          handler: () => {
            this.takeSnap();
          },
        },
        {
          text: "Gallery",
          handler: () => {
            this.selectPhoto();
          },
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => { },
        },
      ],
    });
    await actionSheet.present();
  }


  takeSnap() {
    this.sqLiteService.presentLoading().then(() => {
      this.camera.getPicture(this.cameraOptions).then((imageData) => {
        // this.camera.DestinationType.FILE_URI gives file URI saved in local
        // this.camera.DestinationType.DATA_URL gives base64 URI
        this.sqLiteService.dismissLoading();
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.capturedSnapURL = base64Image;
      }, (err) => {
        this.sqLiteService.dismissLoading();
        // Handle error
      });
    });
  }


  selectPhoto(): void {
    this.sqLiteService.presentLoading().then(() => {
      const optionsGallery: CameraOptions = {
        quality: 80,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true,
      };
      this.camera.getPicture(optionsGallery).then(
        (imageData) => {
          this.sqLiteService.dismissLoading();
          this.capturedSnapURL = 'data:image/jpeg;base64,' + imageData;
        },
        (err) => {
          this.sqLiteService.dismissLoading();
        });
    });
  }

  addCompany() {
    if (!this.name) {
      this.helper.presentToastError('please enter name!')
    }
    else if (!this.email) {
      this.helper.presentToastError('please enter email!')
    }
    else if (!this.city) {
      this.helper.presentToastError('please enter city!')
    }
    else if (!this.address) {
      this.helper.presentToastError('please enter address!')
    }
    else {
      this.presentLoading('Adding...').then(() => {
        this.sqLiteService.create(this.name, this.email, this.city, this.address, this.capturedSnapURL).then((res: any) => {
          this.helper.presentToastSuccess('Record added successfully!');
          this.dismissLoading();
          this.router.navigate(['/home'])
        }, (e) => {
          this.dismissLoading();
          alert(JSON.stringify(e.err));
        });
      });
    }

  }

  updateCompany() {
    this.presentLoading('Updating...').then(() => {
      this.sqLiteService.update(this.id, this.name, this.email, this.city, this.address).then(() => {
        this.helper.presentToastSuccess('Record updated successfully!');
        this.dismissLoading();
        this.router.navigate(['/home']);
      })
    })
  }

  async presentLoading(message: any) {
    this.loader = await this.loadingController.create({
      translucent: true,
      message: message,
      backdropDismiss: true,
      spinner: 'lines'
    });
    await this.loader.present();
  }

  async dismissLoading() {
    await this.loader.dismiss();
  }
}
