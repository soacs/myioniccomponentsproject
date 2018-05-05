import { Component } from '@angular/core';
import { NavController, Tabs } from 'ionic-angular';
import { ProjectsPage } from '../projects/projects';
import { ListPage } from '../list/list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  }

  selectTab(index: number) {
    console.log("navigateToProjectsPage....");
    let t: Tabs = this.navCtrl.parent;
    t.select(index);
  }

}
