import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ItemSliding} from 'ionic-angular';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  item: ItemSliding;
  projectState: string = "open";
  isOpen: boolean = true;
  searchQuery: string = '';

  projectCount: number = 0;
  projects: Array<any>;
  originalProjects: Array<any>;
  filteredProjects: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    console.log('BEGIN SearchPage constructor');
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
    console.log('END SearchPage constructor');
  }

  ngOnInit() {
  }

  completeProject(projectItem: string, slidingItem: ItemSliding) {
    console.log('BEGIN completeProject');
    let i =  this.projects.indexOf(projectItem);
    if(i != -1) {
      console.log('this.projects[i].status = ' + this.projects[i].status);
      this.projects[i].status = 'complete';
      console.log('after set this.projects[i].status = ' + this.projects[i].status);
    }
    slidingItem.close();
    //this.projects.reverse();
    console.log('END completeProject');
  }

  deleteProject(projectItem: string) {
    // Find and remove item from an array
    let i =  this.projects.indexOf(projectItem);
    if(i != -1) {
      this.projects.splice(i, 1);
    }
  }

  closeProject(slidingItem: ItemSliding) {
    slidingItem.close();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  resetProjects() {
    this.projects = this.originalProjects.slice();
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.resetProjects();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.projects = this.projects.filter((item) => {
        return (item.projectName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }


}
