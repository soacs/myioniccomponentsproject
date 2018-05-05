import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectsPage } from './projects';
import { GeneralPage } from '../general/general';
import { ListPage } from '../list/list';
import { SearchPage } from '../search/search';
import { PublishPage } from '../publish/publish';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    ProjectsPage,
    GeneralPage,
    ListPage,
    SearchPage,
    PublishPage
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
     SearchPage,
     PublishPage
  ],
})
export class ProjectsPageModule {}
