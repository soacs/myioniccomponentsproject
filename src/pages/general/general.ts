import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ToastController, LoadingController, Platform} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {FormBuilder, FormGroup} from '@angular/forms';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-general',
  templateUrl: 'general.html',
})
export class GeneralPage {

  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;
  audioList: any[] = [];

  generalForm: FormGroup;

  bugetRange: string;
  timeFrame: string;
  photos: any;
  base64Image: string;

  // requirements
  immediate: boolean = false;
  local: boolean = false;
  supplies: boolean = false;
  installation: boolean = false;
  picture: boolean = false;
  licensed: boolean = false;

  constructor(private platform: Platform, public navCtrl: NavController, public navParams: NavParams, private media: Media, private file: File, private camera: Camera, private alertCtrl : AlertController, private formBuilder: FormBuilder, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {

    this.generalForm = this.formBuilder.group({
      bugetRange: [''],
      timeFrame: [''],
      immediate: [''],
      local: [''],
      supplies: [''],
      installation: [''],
      picture: [''],
      licensed: ['']
    });

    this.file.checkDir(this.file.dataDirectory, 'mydir').then(() => console.log('Directory exists')).catch(err => console.log('Directory does not exist'));

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
      let data = { filename: this.fileName };
      this.audioList.push(data);
      localStorage.setItem("audiolist", JSON.stringify(this.audioList));
      this.recording = false;
      this.getAudioList();
  }

  playRecording(){
    this.audio.play();
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
    this.getAudioList();
  }
  getAudioList() {
    if(localStorage.getItem("audiolist")) {
      this.audioList = JSON.parse(localStorage.getItem("audiolist"));
      console.log(this.audioList);
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
}