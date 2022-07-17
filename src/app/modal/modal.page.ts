import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  modelId: any;
  name: any;
  mobileNumber: any;
  spin: boolean = false;
  data: any;
  constructor(
    public navParams: NavParams,
    public popOverCtrl : PopoverController,
  ) { }

  ngOnInit() {
    this.modelId = this.navParams.data.paramID;
    this.data = this.navParams.data.data;
  }

  close(data: any) {
    this.popOverCtrl.dismiss(data);
  }

}
