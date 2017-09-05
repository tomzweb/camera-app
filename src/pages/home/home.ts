import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Http, HttpModule} from '@angular/http';
import { ImagePicker } from '@ionic-native/image-picker';


@Component({
selector: 'page-home',
templateUrl: 'home.html'
})
export class HomePage {

    private APIKEY = 'AIzaSyAm_kKU9XNG-ZpIYXmQ59l372jB74quchQ';
    private image;
    public list = [];
    private dogs;

    constructor(public navCtrl: NavController, private camera: Camera, private http: Http, private imagePicker: ImagePicker) {
        this.getDogs();
    }

    /**
     * File Input / Browser
     * @param evt
     */
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

    /**
     * Directly from the camera
     */
    public loadCamera()
    {
        const options: CameraOptions = {
            quality: 70,
            targetWidth: 640,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        }

        this.camera.getPicture(options).then((imageData) => {
            this.image  = 'data:image/jpeg;base64,' + imageData;
            let result = this.getResults();
        }, (err) => {
            alert(err)
        });
    }

    public chooseExisting()
    {
        const options = {
            maximumImagesCount: 1,
            quality: 70,
            width: 640,
        }

        this.imagePicker.getPictures(options).then((results) => {
            for (var i = 0; i < results.length; i++) {
                this.image = results[i];
            }
        }, (err) => { });
    }

    public getResults() {
        let requestData = this.getRequestObject();
        this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + this.APIKEY, requestData, {})
            .subscribe(data => {
                console.log(data);
                if (data.ok) {
                    this.getList(data.json().responses[0].labelAnnotations);
                    //console.log(this.list);
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
        console.log(this.dogs);
        for (let item in data) {
            console.log(data[item].description.toUpperCase());
            // TODO: Figure out the upper case / lower case BS
            // console.log(this.dogs.indexOf(data[item].description.toUpperCase()));
            // console.log(this.dogs.indexOf(data[item].description.toUpperCase()));
            // if (this.dogs.indexOf(data[item].description.toLowerCase())) {
            //     this.list.push(item);
            // }
        }
        console.log(this.list);
    }

    private getDogs()
    {
        return this.http.get('./json/dogs.json').subscribe(data => {
           this.dogs = data.json();
        });
    }
}
