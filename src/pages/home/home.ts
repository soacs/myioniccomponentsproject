import { Component } from '@angular/core';
import { NavController, Tabs } from 'ionic-angular';
import { Platform} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  t:Tabs;
  childNavsList: Array<any>;

  constructor(public navCtrl: NavController, private platform: Platform) {
    console.log("BEGIN HomePage");
    this.t = this.navCtrl.parent;
    console.log("END HomePage");
  }

  selectTab(index: number) {
    console.log("navigateToProjectsPage....");
    //let t: Tabs = this.navCtrl.parent;
    //t = this.navCtrl.parent;
    this.t.select(index);
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter HomePage');
    this.childNavsList = this.t.getAllChildNavs();
    console.log("childNavsList.length : " + this.childNavsList.length);
    console.log("childNavsList[1].tabTitle : " + this.childNavsList[1].tabTitle);
    this.childNavsList[1].goToRoot({});

  }

  exitApp(){
    console.log('BEGIN exitApp');
    this.platform.exitApp();
    console.log('END exitApp');
  }

}
