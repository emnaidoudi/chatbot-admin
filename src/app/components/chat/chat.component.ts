import { Component, OnInit, Input,AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';
/**
 * Global
 *
 * @author Emna Aidoudi
 */

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [

    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('500ms', [
          animate('.3s ease-in-out', keyframes([
            style({opacity: 0, offset: 0}),
            style({opacity: .5, offset: 0.5}),
            style({opacity: 1,  offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])

  ]
})
export class ChatComponent implements OnInit {


  chatInitial;
  chatCurrent;

  messages: Message[] = [];
  responses: string[] = [];
  returned_response: string;


  chatForm: FormGroup;
  chatFormFields: any;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(
    public fb: FormBuilder,
    public chatService: ChatService ,) {

  }


  ngOnInit() {
    this.chatInitial = {
      'currentNode': '',
      'complete': null, 'context': {},
      'parameters': [],
      'extractedParameters': {},
      'speechResponse': '',
      'intent': {},
      'input': 'init_conversation',
      'missingParameters': []
    };

    this.chatFormFields = {
      input: [''],
    };
    this.chatForm = this.fb.group(this.chatFormFields);


  }


  add_to_messages(message,resp,author){

    let new_message = new Message(message,resp,author)
    new_message.response=resp;
    this.messages.push(new_message);
    this.chatForm.get('input').reset();
  }


  send() {
    let form = this.chatForm.value;
    const sendMessage = {
      ... this.chatCurrent,
      input: form.input,
      response: this.returned_response,
      owner: 'user'
    };
    //this.response(form.input);

    if(form.input!=null){
      this.chatService.getResponse(form.input).subscribe(
        resp=>{
          this.returned_response=resp["response"];
          this.add_to_messages(form.input,this.returned_response,"user")
          console.log("response :"+this.returned_response);



        }
      )


    }
  }



}

class Message {
  content: string;
  author: string;
  response: string;

  constructor(content: string,response :string, author: string){
    this.content = content;
    this.author = author;
    this.response=response;
  }
}
