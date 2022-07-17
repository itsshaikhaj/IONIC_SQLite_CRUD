import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    public toastController: ToastController,
    ) { }

  async presentToastSuccess(message: any, duration: any = 1000) {
    this.toastController.getTop().then((val) => {
      if (val) {
        this.toastController.dismiss();
        return;
      }
    });
    const toast = await this.toastController.create({
      message,
      duration: duration,
      position: 'top',
      cssClass: 'my-custom-toastSuceess',
    });
    toast.present();
  }
  async presentToastError(message: any, duration: any = 1000) {
    this.toastController.getTop().then((val) => {
      if (val) {
        this.toastController.dismiss();
        return;
      }
    });
    const toast = await this.toastController.create({
      message,
      // duration: duration,
      position: 'top',
      cssClass: 'my-custom-toastError',
      buttons: [
        {
          text: 'X',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            toast.dismiss();
          }
        }]
    });
    toast.present();
  }
  async presentToast(msg, duration) {
    const toast = await this.toastController.create({
      message: msg,
      // duration: duration,
      position: 'top',
      buttons: [
        {
          text: 'X',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
            toast.dismiss();
          }
        }]
    });
    toast.present();
  }
}
