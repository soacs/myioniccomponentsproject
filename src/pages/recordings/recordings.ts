import {Component} from '@angular/core';
import {Media, MediaObject} from '@ionic-native/media';
import {File} from '@ionic-native/file';
import {NavController, AlertController, Platform} from 'ionic-angular';
import {AsyncSubject} from 'rxjs';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-recordings',
  templateUrl: 'recordings.html'
})
export class RecordingsPage {

  recording: boolean = false;
  playing: boolean = false;
  duration: number = 0;
  position: number = 0;
  items: any;
  audio: MediaObject;
  fileName: string;
  filePath: string;
  audios: Array<any>;
  presentAudio: any;

  constructor(public navCtrl: NavController, private media: Media, public platform: Platform, public file: File, private alertCtrl: AlertController, public events: Events) {
  }

  ngOnInit() {
    this.audios = [];
  }

  listDir = (path, dirName) => {
    console.log("listDir() output:");
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

  play(id) {
    this.position = 0;
    this.duration = 0;
    console.log("Play audio id = " + id);
    this.audios[id].audio.play(id);

    this.duration = this.audios[id].audio.getDuration();
    let timerDur = setInterval(() => {
      this.duration = this.audios[id].audio.getDuration();
      console.log('-------------------------------------duration = ' + this.duration);
      clearInterval(timerDur);
    }, 100);
    let timerPosition = setInterval(() => {
      this.audios[id].audio.getCurrentPosition().then((position) => {
        this.position = position;
      });
      console.log('position = ' + this.position);
    }, 100);
    this.audios[id].playing = true;
    let subject = new AsyncSubject();
    let handle = setInterval(() => {
      subject.next(this.position)
      let diff = this.duration - this.position;
      if (diff < .3) {
        console.log('calling complete');
        subject.complete();
        clearInterval(handle);
      }
    }, 100);

    let subscription = subject.subscribe(
      (x) => {
        console.log('Next: ' + x.toString());
      },
      (err) => {
        console.log('Error: ' + err);
      },
      () => {
        this.audios[id].playing = false;
        console.log('Completed');
        clearInterval(timerPosition);
        console.log('this.audios[id].playing: ' + this.audios[id].playing);
      });

  }

  pause(id) {
    console.log("Pause audio id= " + id);
    this.audios[id].audio.pause();
  }

  getCurrentPosition(id): number {
    let position;
    console.log("Get audio position for id = " + id);
    this.audios[id].audio.getCurrentPosition().then((pos) => {
      position = pos;
      console.log("Audio Position = " + position);
      console.log(position);
    });
    return position;
  }

  getDuration(id): number {
    let duration;
    console.log("Get audio duration for id = " + id);
    duration = this.audios[id].audio.getDuration();
    console.log("Audio Duration = " + duration);
    return duration;
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
      this.audio.onSuccess.subscribe(() => console.log('Action is successful'));
      this.audio.onError.subscribe(error => console.log('Error!', error));
      this.audio.startRecord();
      this.recording = true;
      console.log("this.file.externalDataDirectory = " + this.file.externalDataDirectory);
    }
  }

  stopRecording() {
    console.log("Stop recording to file path named: " + this.filePath);
    this.audio.stopRecord();
    this.audio.release();
    this.recording = false;
    this.presentAudio = {
      audio: this.audio,
      fileName: this.fileName,
      filePath: this.filePath,
      duration: this.audio.getDuration(),
      playing: false
    };
    console.log('pushing presentAudio = ' + JSON.stringify(this.presentAudio));
    this.audios.push(this.presentAudio);
    console.log('presentAudio pushed to array - hurray!');
    this.audios.reverse();
    //this.listDir(this.file.externalDataDirectory, "");
  }

  finishedAddingRecordings() {
    this.navCtrl.getPrevious().data.additionalAudios = this.audios;
    this.navCtrl.pop();
  }

  logAudios() {
    console.log('MY_AUDIOS: ' + JSON.stringify(this.audios));
  }

  private createAudioFileName() {
    console.log('BEGIN createAudioFileName()');
    let d = new Date();
    let newFileName = 'record_' + d.getMonth() + '_' + d.getDay() + '_' + d.getFullYear() + '_' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds() + '.3gp';
    console.log('newFileName = ' + newFileName);
    console.log('END createAudioFileName()');
    return newFileName;
  }

  deleteAudio(index) {
    console.log('Delete Audio');
    let confirm = this.alertCtrl.create({
      title: 'Sure you want to delete this audio? There is NO undo!',
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
            this.audios.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }

  mediaError(e) {
    console.log('Media Error');
    console.log(JSON.stringify(e));
  }
}
