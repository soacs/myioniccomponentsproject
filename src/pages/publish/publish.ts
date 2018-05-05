import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ItemSliding} from 'ionic-angular';

@Component({
  selector: 'page-publish',
  templateUrl: 'publish.html',
})
export class PublishPage {

  item: ItemSliding;
  projectState: string = "open";
  isOpen: boolean = true;
  searchQuery: string = '';

  projectItems: Array<any> = ["Project one", "Project two", "Project three", "Project four", "Project five"];
  completedProjectItems: Array<any> = ["Project six completed", "Project seven completed", "Project eight completed"];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log('ListPage constructor');
    this.initializeProjectItems();
  }

  deleteProject(projectItem: string) {
    // Find and remove item from an array
    var i =  this.projectItems.indexOf(projectItem);
    if(i != -1) {
      this.projectItems.splice(i, 1);
    }
  }

  deleteCompletedProject(projectItem: string) {
    // Find and remove item from an array
    var i =  this.completedProjectItems.indexOf(projectItem);
    if(i != -1) {
      this.completedProjectItems.splice(i, 1);
    }
  }

  closeProject(slidingItem: ItemSliding) {
    slidingItem.close();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  removeProject(){
    console.log('remove project');
  }

  ngOnInit() {
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeProjectItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.projectItems = this.projectItems.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  initializeProjectItems() {
    this.projectItems = ["Project one", "Project two", "Project three", "Project four", "Project five"];
  }



}
