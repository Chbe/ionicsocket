import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Chat } from './chat';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    Chat,
  ],
  imports: [
    IonicPageModule.forChild(Chat),
    PipesModule
  ],
  exports: [
    Chat
  ]
})
export class ChatModule { }
