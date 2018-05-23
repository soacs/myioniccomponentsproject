import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ToastController, LoadingController, Platform} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {FormBuilder, FormGroup} from '@angular/forms';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { RecordingsPage } from '../recordings/recordings';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-general',
  templateUrl: 'general.html',
})
export class GeneralPage {

  projectName: string;
  projectDirectory: string;
  devicePlatform: string;
  mediaDirectory: string;

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
  filePath: string;
  fileName: string;
  audio: MediaObject;
  base64Image: string;
  devicePlatform: string;

  // form
  generalForm: FormGroup;

  constructor(private platform: Platform, public navCtrl: NavController, public navParams: NavParams, private media: Media, private file: File, private camera: Camera, private alertCtrl : AlertController, private formBuilder: FormBuilder, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private storage: Storage) {

    this.projectName = this.navParams.get('name');
    console.log('projectName = ' + this.projectName);

    this.mediaDirectory = this.storage.get('mediaDirectory');
    this.devicePlatform = this.storage.get('devicePlatform');
    this.projectDirectory = this.mediaDirectory + '/' + this.projectName;
    console.log("this.mediaDirectory = " + this.mediaDirectory);
    console.log("this.devicePlatform = " + this.devicePlatform);
    console.log("this.projectDirectory = " + this.projectDirectory);
    this.storage.set('projectDirectory', this.projectDirectory);

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

    console.log("Checking project directory on platform = " + this.devicePlatform);
    this.file.checkDir(this.file.dataDirectory, this.projectName).then(() => console.log(`Directory ' + this.projectName + ' already exists`)).catch(err => {
        console.log('Directory ' + this.projectName + ' does not exist, so now calling createDir...');
        this.file.createDir(this.file.dataDirectory, this.projectName, false).then(() => {
          console.log('we just created the directory ' + this.projectName);
        }).catch((err) => {
          console.error('error trying to create directory ' + this.projectName, err);
        });
      }
    );

    this.mediaDirectory = this.file.dataDirectory + this.projectName;
    this.filePath = this.mediaDirectory + this.fileName;

    console.log("this.file.dataDirectory = " + this.file.dataDirectory);
    console.log("this.mediaDirectory = " + this.mediaDirectory);
    console.log("this.filePath = " + this.filePath);
  }

  startRecording(){

    if (this.platform.is('ios')) {
      this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.3gp';
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.3gp';
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    }
    this.audio.startRecord();
    this.recording = true;

  }

  stopRecording(){
      this.audio.stopRecord();
      let data: any = { filename: this.fileName };
      this.audios.push(data);
      localStorage.setItem("audios", JSON.stringify(this.audios));
      this.recording = false;
      this.getAudios();
  }

  playRecording(){
    this.audio.play();
  }

  addRecording(){
    console.log("addRecording()");
    this.navCtrl.push(RecordingsPage);
  }

  showAlert(message){
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GeneralPage');
  }

  save() {
    console.log('save() called');
    let project =  {
      "projectName": this.projectName,
      "budget": this.budget,
      "timeFrame": this.timeFrame,
      "immediate": this.immediate,
      "local": this.local,
      "supplies": this.supplies,
      "installation": this.installation,
      "licensed": this.licensed,
      "quote": this.quote,
      "call": this.call,
      "photos": this.photos,
      "videos": this.videos,
      "audios": this.audios,
      "status": "Open"
    };

    this.storage.set('project', project);

    let toast = this.toastCtrl.create({
      message: ' Project was saved successfully',
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  cancel() {
    console.log('cancel() called');
    this.generalForm.reset();
    this.navCtrl.pop();
  }

  ngOnInit() {
    this.photos = ["assets/imgs/window_project.jpg","assets/imgs/handrail_project.jpg"];
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait while submitting project...",
      duration: 3000
    });
    loader.present();

    loader.onDidDismiss(() => {
      console.log('Dismissed loading');
      this.navCtrl.pop();
    });
  }

  onSubmit(f: FormGroup) {
    this.presentLoading();
    console.log("f.value = " + JSON.stringify(f.value));
    if (this.generalForm.valid) {
      console.log("generalForm submitted!");
      this.generalForm.reset();
    }
  }

  takePhoto() {
    console.log("takePhoto() called");
    const options: CameraOptions = {
      quality: 50, // picture quality
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    console.log("Lets call this.camera.getPicture(options)");

    this.camera.getPicture(options).then((imageData) => {

      console.log("INSIDE PROMISE of camera.getPicture(options)...................................................");
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.photos.push(this.base64Image);
      this.photos.reverse();
    }, (err) => {
      console.log(err);
    });
  }

  deletePhoto(index) {
    console.log("Delete Photo");
    let confirm = this.alertCtrl.create({
      title: 'Sure you want to delete this photo? There is NO undo!',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
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
    if(localStorage.getItem("audiolist")) {
      this.audios = JSON.parse(localStorage.getItem("audiolist"));
      console.log(this.audios);
    }
  }

  playAudio(file,idx) {
    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    }
    this.audio.play();
    this.audio.setVolume(0.8);
  }

  listDirItems(path, dirName) {
    this.file.listDir(path, dirName).then((entries) => {
      console.log("listDir - inside path = " + path);
      console.log("listDir - dirName = " + dirName);
      console.log("listDir - directory Items = " + JSON.stringify(entries));
    }).catch((error) => {
      console.log('error reading,', error);
    });
  }
}
