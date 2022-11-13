import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '/events/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/events/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/events/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/events/Archived', icon: 'archive' },
    { title: 'Trash', url: '/events/Trash', icon: 'trash' },
    { title: 'Spam', url: '/events/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {
    // Show the splash for two seconds and then automatically hide it:
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  }
}
