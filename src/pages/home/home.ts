import { Component } from '@angular/core';
import { NavController, Tabs } from 'ionic-angular';
import { Platform} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private platform: Platform) {
    console.log("BEGIN HomePage");
    let t: Tabs = this.navCtrl.parent;
    console.log("END HomePage");
  }

  selectTab(index: number) {
    console.log("navigateToProjectsPage....");
    let t: Tabs = this.navCtrl.parent;
    t.select(index);
  }

  exitApp(){
    console.log('BEGIN exitApp');
    this.platform.exitApp();
    console.log('END exitApp');
  }

}
