import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ResultsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {

  private results;

  constructor(public navCtrl: NavController, params:NavParams) {
//    console.log(params.data);
    if (Object.keys(params.data).length === 0 && params.data.constructor === Object) {
        this.navCtrl.push("HomePage");
    }
    this.results = params.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultsPage');
    console.log(this.results)
  }

}
