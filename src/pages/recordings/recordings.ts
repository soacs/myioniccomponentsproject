import {Component} from '@angular/core';
import {Media, MediaObject} from '@ionic-native/media';
import {File} from '@ionic-native/file';
import {NavController, NavParams, AlertController, ToastController, LoadingController, Platform} from 'ionic-angular';

@Component({
  selector: 'page-recordings',
  templateUrl: 'recordings.html'
})
export class RecordingsPage {

  recording: boolean = false;
  duration: number;
  items: any;
  audio: MediaObject;
  mediaDirectory: string;
  fileName: string;
  filePath: string;
  position: string;
  audios: Array<any>;
  presentAudio: any;

  constructor(public navCtrl: NavController, private media: Media, public platform: Platform, public file: File, private alertCtrl: AlertController) {

    this.file.checkDir(this.file.dataDirectory, 'mydir').then(() => console.log('Directory mydir already exists')).catch(err => {
        console.log('Directory mydir does not exist, calling createDir...');
        this.file.createDir(this.file.dataDirectory, "mydir", false).then(() => {
          console.log("we just created the directory mydir");
        }).catch((err) => {
          console.error("error trying to create directory mydir", err);
        });
      }
    );

    this.mediaDirectory = this.file.dataDirectory + "mydir/";
    console.log("this.file.dataDirectory = " + this.file.dataDirectory);
    console.log("this.mediaDirectory = " + this.mediaDirectory);
  }
  ngOnInit() {
    this.audios = [];
  }

  listDirItems() {
    this.listDir(this.file.dataDirectory, "mydir");
  }

  listDir = (path, dirName) => {
    this.file.listDir(path, dirName).then((entries) => {
      this.items = entries;
      console.log("listDir - inside path = " + path);
      console.log("listDir - dirName = " + dirName);
      console.log("listDir - directory Items = " + JSON.stringify(this.items));
    }).catch(this.handleError);
  }

  handleError = (error) => {
    console.log('error reading,', error)
  };

  play() {
    console.log("Play audio");
    this.audio.play();
  }

  pause() {
    console.log("Pause audio");
    this.audio.pause();
  }

  getCurrentPosition() {
    this.audio.getCurrentPosition().then((position) => {
      console.log(position);
    });
  }

  getDuration() {
    console.log("Get audio duration");
    this.duration = this.audio.getDuration();
    console.log("Audio Duration: " + this.duration);
  }

  skipTenSeconds() {
    this.audio.seekTo(10000);
  }

  release() {
    // release the native audio resource
    // Platform Quirks:
    // iOS simply create a new instance and the old one will be overwritten
    // Android you must call release() to destroy instances of media when you are done
    this.audio.release();
  }

  startAnotherRecording() {
    console.log("startAnotherRecording....");
    if (this.platform.is('android')) {
      this.fileName = this.createAudioFileName();
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
      console.log("startAnotherRecording - this.fileName = " + this.fileName);
      console.log("startAnotherRecording - this.filePath = " + this.filePath);
      this.audio = this.media.create(this.filePath);
      this.audio.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes
      this.audio.onSuccess.subscribe(() => console.log('Action is successful'));
      this.audio.onError.subscribe(error => console.log('Error!', error));
      this.audio.startRecord();
      this.recording = true;
      console.log("this.file.externalDataDirectory = " + this.file.externalDataDirectory);
      console.log("listDir() output:");
      this.listDir(this.file.externalDataDirectory.replace(/file:\/\//g, ''), "");
    }
  }

  stopRecording() {
    console.log("Stop recording to file path named: " + this.filePath);
    this.audio.stopRecord();
    this.audio.release();
    this.recording = false;
    this.presentAudio = { fileName: this.fileName, filePath: this.filePath };
    console.log('presentAudio = ' + JSON.stringify(this.presentAudio));
    this.audios.push(this.presentAudio);
    console.log('presentAudio pushed to array - hurry!');
    this.audios.reverse();
  }


  mediaError(e) {
    console.log('Media Error');
    console.log(JSON.stringify(e));
  }

  finishedAddingRecordings() {
    this.navCtrl.pop();
  }

  private createAudioFileName() {
    console.log('## BEGIN createAudioFileName()');
    let newFileName = 'record_' + new Date().getMonth() + '_' + new Date().getDate() + '_' + new Date().getFullYear() + '_' + new Date().getHours() + '_' + new Date().getMinutes()+ '_' + new Date().getSeconds() + '.3gp';
    console.log('## newFileName = ' + newFileName);
    console.log('## END createAudioFileName()');
    return newFileName;
  }

  deleteAudio(index) {
    console.log('## Delete Audio');
    let confirm = this.alertCtrl.create({
      title: 'Sure you want to delete this audio? There is NO undo!',
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
            this.audios.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }
}
