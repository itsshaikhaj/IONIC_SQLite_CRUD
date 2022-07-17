import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyDetailsPageRoutingModule } from './company-details-routing.module';

import { CompanyDetailsPage } from './company-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyDetailsPageRoutingModule
  ],
  declarations: [CompanyDetailsPage]
})
export class CompanyDetailsPageModule {}
