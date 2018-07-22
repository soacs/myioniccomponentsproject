import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

  project: any;
  projects: Array<any> = [
    {
      "projectName": "TestMe",
      "budget": 579,
      "timeFrame": "Immediate",
      "local": false,
      "supplies": true,
      "installation": false,
      "licensed": true,
      "quote": true,
      "call": false
    }
  ];

  projectIndex: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    console.log('BEGIN DetailsPage constructor');
    this.projectIndex = navParams.data;
    console.log('projectIndex based on data = ' + this.projectIndex);
    console.log('END DetailsPage constructor');
  }

  ngOnInit() {
    console.log('BEGIN ngOnInit');
    this.storage.get('projects').then(val => {
      console.log('INSIDE storage.get projects');
      if (val !== null) {
        console.log('VAL is not null');
        this.projects = val;
        console.log('projects = ' + JSON.stringify(this.projects));
        this.project = this.projects[this.projectIndex];
        console.log('project = ' + JSON.stringify(this.project));
      } else {
        console.log('ERROR projects were not found in storage!');
      }
    });
    this.project = this.projects[this.projectIndex];
    console.log('project = ' + JSON.stringify(this.project));
    console.log('END ngOnInit');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter DetailsPage');
  }
}



