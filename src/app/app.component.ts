import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {File} from '@ionic-native/file';
import {Storage} from '@ionic/storage';
import {TabsPage} from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html',
  providers: []
})
export class MyApp {
  rootPage: any = TabsPage;
  projectsDirectoryName: string = 'projects';
  devicePlatform: string;
  projects: Array<any> = undefined;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private file: File, private storage: Storage) {

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      if (platform.is('ios')) {
        console.log("PLATFORM IS IOS");
        this.devicePlatform = 'ios';
      } else if (platform.is('android')) {
        console.log("PLATFORM IS ANDRIOD");
        this.devicePlatform = 'android';
      } else {
        console.log("PLATFORM IS ELSE");
        this.devicePlatform = 'android';
      }

      console.log("this.file.dataDirectory = " + this.file.dataDirectory);
      console.log("this.devicePlatform = " + this.devicePlatform);

      this.storage.set('devicePlatform', this.devicePlatform);
      this.storage.get('projects').then(val => {
        if (val === null) {
          console.log("projects pulled out of storage is NULL! creating a new empty projects array");
          this.projects = [];
          console.log("place empty projects array in storage: " + JSON.stringify(this.projects));
          this.storage.set('projects', this.projects);
        } else {
          console.log('projects array pulled out of storage is: ' + JSON.stringify(val));
        }
      })
    });

  }
}
