import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { GeneralPage } from '../general/general';
import { ListPage } from '../list/list';
import { SearchPage } from '../search/search';
import { PublishPage } from '../publish/publish';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController) {
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

  createProject() {
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
