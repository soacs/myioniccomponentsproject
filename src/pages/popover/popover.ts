import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html'
})
export class PopoverPage {
  popoverForm: FormGroup;
  name: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private formBuilder: FormBuilder) {

    this.popoverForm = this.formBuilder.group({
      name: ['']
    });

  }

  onSubmit(f: any) {
    console.log("Submitting popover form with value= " + JSON.stringify(f));
    this.viewCtrl.dismiss(f);
  }
}
