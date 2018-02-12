import { Message } from "./message.model";
import { Injectable, EventEmitter } from "@angular/core";
import { Response, Headers, Http } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from "rxjs";

@Injectable()
export class MessageService{
    private messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private http: Http){}

    addMessage(message: Message){
        const body = JSON.stringify(message);
        // need headers so server does not read data in as plain text, thus not knowing what to do with the data
        const headers = new Headers({'Content-Type': 'application/json'});
        // this line sets up an observable IT DOES NOT ACTUALLY POST THE REQUEST, you have to be listening to the observable for the request to be sent
        return this.http.post('http://localhost:3000/message', body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                // remeber the result of path, post, and get requests were set to a filed called obj in routes/messages.js
                const message = new Message(result.obj.content, 'Dummy', result.obj._id, null);
                // update frontend array AFTER the server has responded
                this.messages.push(message);
                return message;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getMessages() {
        return this.http.get('http://localhost:3000/message')
            .map((response: Response) => {
                // obj references the status 200 response obj of the get route from /routes/messages.js
              const messages = response.json().obj;  
              let transformedMessages: Message[] = [];
              for( let message of messages){
                  transformedMessages.push(new Message(message.content, 'Dummy', message._id, null));
              }
              this.messages = transformedMessages;
              return transformedMessages;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    editMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message){
        const body = JSON.stringify(message);
        // need headers so server does not read data in as plain text, thus not knowing what to do with the data
        const headers = new Headers({'Content-Type': 'application/json'});
        // this line sets up an observable IT DOES NOT ACTUALLY POST THE REQUEST, you have to be listening to the observable for the request to be sent
        return this.http.patch('http://localhost:3000/message/' + message.messageId, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    deleteMessage(message: Message){
        // remove this message from the front end array
        this.messages.splice(this.messages.indexOf(message),1);
        console.log("made past splice");
        return this.http.delete('http://localhost:3000/message/' + message.messageId)
            .map((response: Response) =>  response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
}