import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManangerPageRoutingModule } from './mananger-routing.module';

import { ManangerPage } from './mananger.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManangerPageRoutingModule
  ],
  declarations: [ManangerPage]
})
export class ManangerPageModule {};
