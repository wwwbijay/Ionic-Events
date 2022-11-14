import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit,OnDestroy {

  scanActive: boolean = true;
  private isCurrentView: boolean;
  lastBack:any;
  subscriptions:any;

  constructor(
      private _platform: Platform,
      private _routerOutlets: RouterOutlet,
      private _modalCtrl: ModalController
      ) { 
        this.subscriptions = new Subscription();
        this.backButtonEvent();
     }
  
  ngOnInit() {
    
  }

  async backButtonEvent() {
    const routerEl = document.querySelector('ion-router');

    this.subscriptions.add(
      this._platform.backButton.subscribeWithPriority(9999, (processNextHandler) => {
        if (this.isCurrentView) {
         
          if (Date.now() - this.lastBack < 500) {
            navigator['app'].exitApp();
          }
          this.lastBack = Date.now();
              
        } else {
          processNextHandler();
        }
      })
    );
   
  }
 
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  

}
