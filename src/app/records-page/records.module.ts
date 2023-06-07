import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecordsPage, ReversePipe } from './records.page';

import { RecordsPageRoutingModule } from './records-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RecordsPageRoutingModule,
  ],
  declarations: [RecordsPage, ReversePipe],
})
export class RecordsPageModule {}
