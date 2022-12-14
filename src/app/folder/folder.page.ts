import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  // public title: string;
  scanActive: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private _router: Router,
   
    ) { }

  ngOnInit() {
    // this.title = this.activatedRoute.snapshot.paramMap.get('id'); 
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScanner() {
    const allowed = await this.checkPermission();

    if (allowed) {
      this.scanActive = true;
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.QR_CODE] });

      if (result.hasContent) {
        this.scanActive = false;
        alert(result.content); //The QR content will come out here
        console.log(result.content);
        //Handle the data as your heart desires here
      } else {
        alert('NO DATA FOUND!');
      }
    } else {
      // redirect user to app settings if they want to grant it anyway
      const c = confirm('If you want to grant permission for using your camera, enable it in the app settings.');
      if (c) {
        BarcodeScanner.openAppSettings();
      }
    }
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  ionViewWillLeave() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

}
