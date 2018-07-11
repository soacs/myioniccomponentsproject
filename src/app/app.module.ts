import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler, DeepLinkConfig } from 'ionic-angular';
import {ProjectsPageModule} from '../pages/projects/projects.module';
import {MyApp} from './app.component';
import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {IonicStorageModule} from '@ionic/storage';
import {Media} from '@ionic-native/media';
import {File} from '@ionic-native/file';
import {FilePath} from '@ionic-native/file-path';
import {Camera} from '@ionic-native/camera';
import {LoggingService} from "ionic-logging-service";

const DEEP_LINK_CONFIG: DeepLinkConfig = {
  links: [
    { component: ContactPage, name: "contact", segment: "contact"},
  ]
};

const IONIC_CONFIG: any = { locationStrategy: 'path' };

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    ProjectsPageModule,
    IonicModule.forRoot(MyApp, IONIC_CONFIG, DEEP_LINK_CONFIG),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Media,
    File,
    FilePath,
    Camera,
    LoggingService
  ]
})
export class AppModule {
}
