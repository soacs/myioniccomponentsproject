import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectsPage } from './projects';
import { GeneralPage } from '../general/general';
import { ListPage } from '../list/list';
import { SearchPage } from '../search/search';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    ProjectsPage,
    GeneralPage,
    ListPage,
    SearchPage
  ],
  imports: [
    IonicPageModule.forChild(ProjectsPage),
  ],
   providers: [
    Camera
  ],
  entryComponents: [
     GeneralPage,
     ListPage,
     SearchPage
  ],
})
export class ProjectsPageModule {}
