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
  projectsDirectory: string = 'projects';
  mediaDirectory: string;
  devicePlatform: string;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private file: File,  private storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      if (this.platform.is('ios')) {
        this.devicePlatform = 'ios';
      } else if (this.platform.is('android')) {
        this.devicePlatform = 'android';
      }

      this.file.checkDir(this.file.dataDirectory, this.projectsDirectory).then(() => console.log(`Directory ' + this.projectsDirectory + ' already exists`)).catch(err => {
          console.log('Directory ' + this.projectsDirectory + ' does not exist, so now calling createDir...');
          this.file.createDir(this.file.dataDirectory, this.projectsDirectory, false).then(() => {
            console.log('we just created the directory ' + this.projectsDirectory);
          }).catch((err) => {
            console.error('error trying to create directory ' + this.projectsDirectory, err);
          });
        }
      );
    });

    this.mediaDirectory = this.file.dataDirectory + this.projectsDirectory;

    console.log("this.file.dataDirectory = " + this.file.dataDirectory);
    console.log("this.mediaDirectory = " + this.mediaDirectory);
    console.log("this.devicePlatform = " + this.devicePlatform);
    console.log("Store dataDirectory, mediaDirectory and devicePlatform into storage");
    this.storage.set('projectsDirectory', this.projectsDirectory);
    this.storage.set('mediaDirectory', this.mediaDirectory);
    this.storage.set('devicePlatform', this.devicePlatform);


  }
}
