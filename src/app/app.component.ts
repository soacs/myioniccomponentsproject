import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  projectsDirectoryName: string = 'projects';
  projectsDirectory: string;
  devicePlatform: string;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private file: File,  private storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
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

      this.file.checkDir(this.file.dataDirectory, this.projectsDirectoryName).then(() => console.log(`Directory named ' + this.projectsDirectoryName + ' already exists`)).catch(err => {
          console.log('Directory ' + this.projectsDirectoryName + ' does not exist, so now calling createDir...');
          this.file.createDir(this.file.dataDirectory, this.projectsDirectoryName, false).then(() => {
            console.log('we just created the directory named ' + this.projectsDirectoryName);
          }).catch((err) => {
            console.error('error trying to create directory named ' + this.projectsDirectoryName, err);
          });
        }
      );

      this.projectsDirectory = this.file.dataDirectory + this.projectsDirectoryName + '/';

      console.log("this.file.dataDirectory = " + this.file.dataDirectory);
      console.log("this.projectsDirectory = " + this.projectsDirectory);
      console.log("this.devicePlatform = " + this.devicePlatform);

      console.log("Store dataDirectory, projectsDirectory and devicePlatform into storage");

      this.storage.set('projectsDirectory', this.projectsDirectory);
      this.storage.set('devicePlatform', this.devicePlatform);
    });

  }
}
