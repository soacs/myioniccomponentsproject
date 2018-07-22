import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { ProjectsPage } from '../projects/projects';
import { Platform} from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = ProjectsPage;

  constructor(private platform: Platform) {
    console.log("BEGIN TabsPage");
    this.platform = platform;
    console.log("END TabsPage");
  }
  exitApp(){
    console.log('BEGIN exitApp');
    this.platform.exitApp();
    console.log('END exitApp');
  }
}
