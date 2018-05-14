import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { GeneralPage } from '../general/general';
import { ListPage } from '../list/list';
import { SearchPage } from '../search/search';
import { PublishPage } from '../publish/publish';
import { PopoverController } from 'ionic-angular';
import { PopoverPage } from '../popover/popover';

/**
 * Generated class for the ProjectsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html',
})
export class ProjectsPage {

  projectName: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public popoverCtrl: PopoverController) {
  }

  presentPopover() {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.onDidDismiss(data => {
      console.log("presentPopover data is " + JSON.stringify(data));
      this.projectName = data.name;
      this.navCtrl.push(GeneralPage, data);
    });

    popover.present();

  }

  createProject() {
    this.presentPopover();
    console.log("popoverData = " + JSON.stringify(this.popoverData));
  }

  viewProjects() {
    this.navCtrl.push(ListPage);
  }

  publishProjects() {
    this.navCtrl.push(PublishPage);
  }

  searchProjects() {
    this.navCtrl.push(SearchPage);
  }

  createActionSheetProject() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Create Home Project',
      buttons: [
        {
          text: 'General',
          handler: () => {
            this.navCtrl.push(GeneralPage);
            console.log('General clicked');
          }
        },{
          text: 'Kitchen',
          handler: () => {
            console.log('Kitchen clicked');
          }
        }
        ,{
          text: 'Bedroom',
          handler: () => {
            console.log('Bedroom clicked');
          }
        }
        ,{
          text: 'Living Room',
          handler: () => {
            console.log('Living Room clicked');
          }
        }
        ,{
          text: 'Dining Room',
          handler: () => {
            console.log('Dining Room clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  listProjects(){
    console.log('listProjects() called');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectsPage');
  }

}
