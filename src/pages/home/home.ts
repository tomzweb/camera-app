import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HTTP } from '@ionic-native/http';
import {Http, HttpModule} from '@angular/http';

@Component({
selector: 'page-home',
templateUrl: 'home.html'
})
export class HomePage {

    private APIKEY = '';
    private image;
    public list;

    constructor(public navCtrl: NavController, private camera: Camera, private http: HTTP, private http2: Http) {
    }

    public handleFileSelect(evt) {
        var files = evt.target.files;
        var file = files[0];

        if (files && file) {
            var reader = new FileReader();
            reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsBinaryString(file);
        }
    }

    private _handleReaderLoaded(readerEvt) {
        var binaryString = readerEvt.target.result;
        this.image = btoa(binaryString);
    }

    public getResults() {
        let requestData = this.getRequestObject();
        this.http2.post('https://vision.googleapis.com/v1/images:annotate?key=' + this.APIKEY, requestData, {})
            .subscribe(data => {
                console.log(data);
                if (data.ok) {
                    this.getList(data.json().responses[0].labelAnnotations);
                    console.log(this.list);
                }
            });
    }

    private getRequestObject() {
        return {
            "requests": [
                {
                    "image": {
                        "content": this.image
                    },
                    "features": [
                        {
                            "type": "LABEL_DETECTION",
                            "maxResults": 10
                        }
                    ]
                }
            ]
        }
    }

    private getList(data)
    {

        this.list = data;
    }


    // public submitImage()
    // {
    //     const options: CameraOptions = {
    //         quality: 100,
    //         destinationType: this.camera.DestinationType.DATA_URL,
    //         encodingType: this.camera.EncodingType.JPEG,
    //         mediaType: this.camera.MediaType.PICTURE,
    //         sourceType: 2
    //     }
    //
    //     this.camera.getPicture(options).then((imageData) => {
    //         this.image  = 'data:image/jpeg;base64,' + imageData;
    //         let result = this.getResults();
    //     }, (err) => {
    //         alert(err)
    //     });
    // }
    //
    // public loadCamera()
    // {
    //     // const options: CameraOptions = {
    //     //   quality: 100,
    //     //   destinationType: this.camera.DestinationType.DATA_URL,
    //     //   encodingType: this.camera.EncodingType.JPEG,
    //     //   mediaType: this.camera.MediaType.PICTURE
    //     // }
    //     //
    //     // this.camera.getPicture(options).then((imageData) => {
    //     //  this.image  = 'data:image/jpeg;base64,' + imageData;
    //     //  let result = this.getResults();
    //     // }, (err) => {
    //     //   alert(err)
    //     // });
    //
    //     // let imageData = this.encodeImageFileAsURL('../../../../resources/images/test.jpg')
    //
    //     // this.image  =  imageData;
    //     let result = this.getResults();
    // }
}
