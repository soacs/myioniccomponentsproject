import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestmePage } from './testme';

@NgModule({
  declarations: [
    TestmePage,
  ],
  imports: [
    IonicPageModule.forChild(TestmePage),
  ],
})
export class TestmePageModule {}
