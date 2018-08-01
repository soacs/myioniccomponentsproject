import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ItemSliding} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {DetailsPage} from '../details/details';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  item: ItemSliding;
  projectState: string = "open";
  isOpen: boolean = true;
  projectCount: number = 0;
  projects: Array<any>;
  originalProjects: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    console.log('BEGIN ListPage constructor');
    this.storage.get('projects').then(val=>{
      if(val !== null){
        this.projects = val;
        console.log('projects = ' + JSON.stringify( this.projects));
        this.originalProjects = this.projects.slice();
        this.projectCount = val.length;
        console.log('projectCount val = ' + val.length);
        console.log('projectCount this = ' + this.projectCount);
        console.log('val = ' + JSON.stringify( val));
        console.log('projects = ' + JSON.stringify( this.projects));
      } else {
        console.log('ERROR projects were not found in storage!');
      }
    });
    console.log('END ListPage constructor');
  }

  deleteProject(i: number) {
  this.projects.splice(i, 1);
  this.projectCount = this.projects.length;
}

  viewProject(i: number) {
    let data = { "projectIndex": i};
    console.log("viewProject i = " + i);
    this.navCtrl.push(DetailsPage, i);
   }

  closeProject(slidingItem: ItemSliding) {
    slidingItem.close();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  ionViewWillDisappear() {
    console.log('ionViewWillDisappear ListPage');
  }

  removeProject(){
    console.log('remove project');
  }

  save(){
    console.log('BEGIN save');
    this.storage.set('projects', this.projects).then(data => {
      console.log('projects has been saved');
      console.log('Saved data =' + JSON.stringify(data));
    });

    this.navCtrl.pop();
    console.log('END save');
  }

  cancel(){
    console.log('BEGIN cancel');
    this.projects = this.originalProjects.slice();
    console.log('END cancel');
  }

  ngOnInit() {
  }

}
