import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HelperService } from './services/helper.service';
import { SqliteService } from './services/sqlite.service';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { Camera } from '@ionic-native/camera/ngx';
import { File } from "@ionic-native/file/ngx";


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    SQLite,
    HelperService,
    SqliteService,
    Camera,
    AndroidPermissions,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
