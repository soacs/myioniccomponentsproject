import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ProjectsPage} from './projects';
import {GeneralPage} from '../general/general';
import {ListPage} from '../list/list';
import {SearchPage} from '../search/search';
import {PublishPage} from '../publish/publish';
import {RecordingsPage} from '../recordings/recordings';
import {PopoverPage} from '../popover/popover';
import {Camera} from '@ionic-native/camera';
import {DetailsPage} from '../details/details';

@NgModule({
  declarations: [
    ProjectsPage,
    GeneralPage,
    ListPage,
    SearchPage,
    PublishPage,
    RecordingsPage,
    PopoverPage,
    DetailsPage
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
    PublishPage,
    RecordingsPage,
    PopoverPage,
    DetailsPage
  ],
})
export class ProjectsPageModule {
}
