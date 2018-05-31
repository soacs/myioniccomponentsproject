import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ToastController, LoadingController, Platform} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Media, MediaObject} from '@ionic-native/media';
import {File} from '@ionic-native/file';
import {RecordingsPage} from '../recordings/recordings';
import {Storage} from '@ionic/storage';
import {ActionSheetController} from 'ionic-angular';

@Component({
  selector: 'page-general',
  templateUrl: 'general.html',
})
export class GeneralPage {

  projectName: string;
  projectsDirectory: any;
  projectDirectory: string;
  devicePlatform: any;

  // requirements
  budget: string;
  timeFrame: string;
  immediate: boolean = false;
  local: boolean = false;
  supplies: boolean = false;
  installation: boolean = false;
  picture: boolean = false;
  licensed: boolean = false;
  call: boolean = false;
  quote: boolean = false;
  photos: Array<string>;
  audios: Array<string>;
  videos: Array<string>;

  // needed members
  recording: boolean = false;
  myFilePath: string;
  fileName: string;
  audio: MediaObject;
  base64Image: string;
  lastImage: string;

  // form
  generalForm: FormGroup;

  constructor(private platform: Platform, public navCtrl: NavController, public navParams: NavParams, private media: Media, private file: File, private camera: Camera, private alertCtrl: AlertController, private formBuilder: FormBuilder, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private storage: Storage,  public actionSheetCtrl: ActionSheetController) {
    console.log('## BEGIN GeneralPage constructor');
    this.projectName = this.navParams.get('name');
    console.log('## projectName = ' + this.projectName);
    this.storage.get('projectsDirectory').then((val) => {
      this.projectsDirectory = val;
      this.projectDirectory = this.projectsDirectory + this.projectName + '/';
      console.log('## this.file.dataDirectory = ' + this.file.dataDirectory);
      console.log('## this.projectsDirectory = ' + this.projectsDirectory);
      console.log('## this.projectDirectory = ' + this.projectDirectory);
      console.log('## Store projectDirectory in storage');
      this.storage.set('projectDirectory', this.projectDirectory);
    });

    this.storage.get('devicePlatform').then((val) => {
      this.devicePlatform = val;
      console.log('## this.devicePlatform = ' + this.devicePlatform);
    });

    this.generalForm = this.formBuilder.group({
      budget: [''],
      timeFrame: [''],
      immediate: [''],
      local: [''],
      supplies: [''],
      installation: [''],
      picture: [''],
      licensed: [''],
      call: [''],
      quote: ['']
    });
    console.log('## END GeneralPage constructor');
  }

  ionViewDidEnter() {
    console.log('## BEGIN ionViewDidEnter');
    console.log('## this.projectDirectory = ' + this.projectDirectory);
    console.log('## Checking projectDirectory = ' + this.projectDirectory + ' on platform = ' + this.devicePlatform);
    this.file.checkDir(this.projectsDirectory, this.projectName).then(() => console.log(`Directory ' + this.projectName + ' already exists`)).catch(err => {
        console.log('## Directory ' + this.projectName + ' does not exist, so now calling createDir...');
        this.file.createDir(this.projectsDirectory, this.projectName, false).then(() => {
          console.log('## we just created the directory ' + this.projectName);
        }).catch((err) => {
          console.error('error trying to create directory ' + this.projectName, err);
        });
      }
    );
    this.listDirItems(this.file.dataDirectory, 'projects');
    console.log('## END ionViewDidEnter');
  }

  startRecording() {

    this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.3gp';
    this.myFilePath = this.projectDirectory + this.fileName;
    this.audio = this.media.create(this.myFilePath);
    this.audio.startRecord();
    this.recording = true;

    /*  if (this.platform.is('ios')) {
     this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.3gp';
     this.myFilePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
     this.audio = this.media.create(this.myFilePath);
     } else if (this.platform.is('android')) {
     this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.3gp';
     this.myFilePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
     this.audio = this.media.create(this.myFilePath);
     }
     this.audio.startRecord();
     this.recording = true; */
  }

  stopRecording() {
    this.audio.stopRecord();
    let data: any = {filename: this.fileName};
    this.audios.push(data);
    localStorage.setItem('audios', JSON.stringify(this.audios));
    this.recording = false;
    this.getAudios();
  }

  playRecording() {
    this.audio.play();
  }

  addRecording() {
    console.log('## addRecording()');
    this.navCtrl.push(RecordingsPage);
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('## ionViewDidLoad GeneralPage');
  }

  save() {
    console.log('## save() called');
    let project = {
      'projectName': this.projectName,
      'budget': this.budget,
      'timeFrame': this.timeFrame,
      'immediate': this.immediate,
      'local': this.local,
      'supplies': this.supplies,
      'installation': this.installation,
      'licensed': this.licensed,
      'quote': this.quote,
      'call': this.call,
      'photos': this.photos,
      'videos': this.videos,
      'audios': this.audios,
      'status': 'Open'
    };

    this.storage.get('projects').then(val => {
      console.log('projects taken out of storage');
      console.log('projects.length = ' + val.length);
      if (val !== null) {
        console.log('push saved project into projects');
        val.push(project);
        console.log('set projects in storage again.');
        console.log('projects = ' + JSON.stringify(val));
        this.storage.set('projects', val);
      }
    });
    this.storage.set('project', project);

    let toast = this.toastCtrl.create({
      message: ' Project was saved successfully',
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  cancel() {
    console.log('## cancel() called');
    this.generalForm.reset();
    this.navCtrl.pop();
  }

  ngOnInit() {
    this.photos = ['assets/imgs/window_project.jpg', 'assets/imgs/handrail_project.jpg'];
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait while submitting project...',
      duration: 3000
    });
    loader.present();

    loader.onDidDismiss(() => {
      console.log('## Dismissed loading');
      this.navCtrl.pop();
    });
  }

  onSubmit(f: FormGroup) {
    this.presentLoading();
    console.log('## f.value = ' + JSON.stringify(f.value));
    if (this.generalForm.valid) {
      console.log('## generalForm submitted!');
      this.generalForm.reset();
    }
  }

  takePhoto() {
    console.log('## takePhoto() called');
    const options: CameraOptions = {
      quality: 50, // picture quality
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    console.log('## Lets call this.camera.getPicture(options)');

    this.camera.getPicture(options).then((imageData) => {

      console.log('## INSIDE PROMISE of camera.getPicture(options)...................................................');
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.photos.push(this.base64Image);
      this.photos.reverse();
      let imagePath = imageData;
      console.log("## picture imagePath = " + imagePath);
      let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      console.log("## picture currentName = " + currentName);
      let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      console.log("## picture correctPath = " + correctPath);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }, (err) => {
      console.log(err);
    });
  }

  public takePicture() {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      console.log("## picture imagePath = " + imagePath);
      let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      console.log("## picture currentName = " + currentName);
      let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      console.log("## picture correctPath = " + correctPath);
      console.log('## lets call copyFIleToLocalPath');
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      this.listDirItems(this.file.dataDirectory, 'projects');
    }, (err) => {
      console.log('Error while selecting image.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    console.log('## BEGIN createFileName()');
    let d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    console.log('## newFileName = ' + newFileName);
    console.log('## END createFileName()');
    return newFileName;
  }

// Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    console.log('## BEGIN copyFileToLocalDir()');
    this.file.copyFile(namePath, currentName, this.projectDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      console.log('## lastImage = ' + this.lastImage);
      console.log('## list final directory contents');
      this.listDirItems(this.file.dataDirectory, 'projects');
    }, error => {
      console.log('Error while storing file. error = ' + error);
    });
    console.log('## END copyFileToLocalDir()');
  }


  deletePhoto(index) {
    console.log('## Delete Photo');
    let confirm = this.alertCtrl.create({
      title: 'Sure you want to delete this photo? There is NO undo!',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('## Disagree clicked');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('## Agree clicked');
            this.photos.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }

  ionViewWillEnter() {
    this.getAudios();
  }

  getAudios() {
    if (localStorage.getItem('audiolist')) {
      this.audios = JSON.parse(localStorage.getItem('audiolist'));
      console.log(this.audios);
    }
  }

  playAudio(file, idx) {
    if (this.platform.is('ios')) {
      this.myFilePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.myFilePath);
    } else if (this.platform.is('android')) {
      this.myFilePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.myFilePath);
    }
    this.audio.play();
    this.audio.setVolume(0.8);
  }

  listDirItems(path, dirName) {
    this.file.listDir(path, dirName).then((entries) => {
      console.log('## listDir - inside path = ' + path);
      console.log('## listDir - dirName = ' + dirName);
      console.log('## listDir - directory Items = ' + JSON.stringify(entries));
    }).catch((error) => {
      console.log('## error reading,', error);
    });
  }

  async getProjectsDirectoryAsync() {
    return await this.storage.get('projectsDirectory');
  }

  async getDevicePlatformAsync() {
    return await this.storage.get('devicePlatform');
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
        }, {
          text: 'Kitchen',
          handler: () => {
            console.log('Kitchen clicked');
          }
        }
        , {
          text: 'Bedroom',
          handler: () => {
            console.log('Bedroom clicked');
          }
        }
        , {
          text: 'Living Room',
          handler: () => {
            console.log('Living Room clicked');
          }
        }
        , {
          text: 'Dining Room',
          handler: () => {
            console.log('Dining Room clicked');
          }
        }, {
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

}
