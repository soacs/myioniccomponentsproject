import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GeneralPage} from '../general/general';
import {ListPage} from '../list/list';
import {SearchPage} from '../search/search';
import {PublishPage} from '../publish/publish';
import {PopoverController} from 'ionic-angular';
import {PopoverPage} from '../popover/popover';
import {Storage} from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html',
})
export class ProjectsPage {

  projectName: string;
  projectCount: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,  public storage: Storage) {
    console.log('BEGIN ProjectsPage constructor');
    this.storage.get('projects').then(val=>{
      if(val !== null){
        this.projectCount = val.length;
        console.log('projectCount val = ' + val.length);
        console.log('projectCount this = ' + this.projectCount);
      } else {
        console.log('ERROR projects were not found in storage!');
      }
    });
    console.log('END ProjectsPage constructor');
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);

    popover.onDidDismiss(data => {
      console.log("presentPopover data is " + JSON.stringify(data));
      this.projectName = data.name;
      this.navCtrl.push(GeneralPage, data);

    });

    let ev = {
      target: {
        getBoundingClientRect: () => {
          return {
            top: 20
          };
        }
      }
    }
    popover.present({ev});
  }

  createProject(myEvent) {
    this.presentPopover(myEvent);
    console.log("projectName = " + JSON.stringify(this.projectName));
  }

  viewProjects() {
    this.navCtrl.push(ListPage);
  }

  publishProjects() {
    this.navCtrl.push(PublishPage);
  }

  searchProjects() {
    this.navCtrl.push('SearchPage');
  }


  listProjects() {
    console.log('listProjects() called');
  }

  ionViewDidLoad() {
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter ProjectsPage');
  }
}
