import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectsPage } from './projects';
import { GeneralPage } from '../general/general';
import { ListPage } from '../list/list';
import { Camera, CameraOptions } from '@ionic-native/camera';

@NgModule({
  declarations: [
    ProjectsPage,
    GeneralPage,
    ListPage
  ],
  imports: [
    IonicPageModule.forChild(ProjectsPage),
  ],
   providers: [
    Camera
  ],
  entryComponents: [
     GeneralPage,
     ListPage
  ],
})
export class ProjectsPageModule {}
