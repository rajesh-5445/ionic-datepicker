import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular'
import { IonicDatepickerComponent } from '../ionic-datepicker/ionic-datepicker.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private modalCtrl: ModalController) { }

  async openDatePicker() {
    const modal = await this.modalCtrl.create({
      component: IonicDatepickerComponent
    });
    return await modal.present();
  }

}
