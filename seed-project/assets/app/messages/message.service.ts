import { Message } from "./message.model";
import { Injectable, EventEmitter } from "@angular/core";
import { Response, Headers, Http } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { ErrorService } from "../errors/error.service";

@Injectable()
export class MessageService{
    private messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private http: Http, private errorService: ErrorService){}

    addMessage(message: Message){
        const body = JSON.stringify(message);
        // need headers so server does not read data in as plain text, thus not knowing what to do with the data
        const headers = new Headers({'Content-Type': 'application/json'});
        // constructs the query param string to attach the token to the url for http requests
        const token = localStorage.getItem('token') 
            ? '?token=' + localStorage.getItem('token') 
            : '';
        // this line sets up an observable IT DOES NOT ACTUALLY POST THE REQUEST, you have to be listening to the observable for the request to be sent
        // DEV change below link to https://localhost:3000/ ~~~ whatever for dev work
        return this.http.post('https://node-angular-messenger.herokuapp.com/message' + token, body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                // remeber the result of path, post, and get requests were set to a filed called obj in routes/messages.js
                const message = new Message(
                    result.obj.content,
                    result.obj.user.firstName, 
                    result.obj._id, 
                    result.obj.user._id);
                // update frontend array AFTER the server has responded
                this.messages.push(message);
                return message;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    getMessages() {
    // DEV change below link to https://localhost:3000/ ~~~ whatever for dev work
        return this.http.get('https://node-angular-messenger.herokuapp.com/message')
            .map((response: Response) => {
                // obj references the status 200 response obj of the get route from /routes/messages.js
              const messages = response.json().obj;  
              let transformedMessages: Message[] = [];
              for( let message of messages){    
                  transformedMessages.push(new Message(
                      message.content, 
                      message.user.firstName, // first name now availabe because of .populate() on the get request from routes/messages
                      message._id, 
                      message.user._id
                    ));
              }
              this.messages = transformedMessages;
              return transformedMessages;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    editMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message){
        const body = JSON.stringify(message);
        // need headers so server does not read data in as plain text, thus not knowing what to do with the data
        const headers = new Headers({'Content-Type': 'application/json'});
        // constructs the query param string to attach the token to the url for http requests
        const token = localStorage.getItem('token') 
            ? '?token=' + localStorage.getItem('token') 
            : '';
        // this line sets up an observable IT DOES NOT ACTUALLY POST THE REQUEST, you have to be listening to the observable for the request to be sent
        // DEV change below link to https://localhost:3000/ ~~~ whatever for dev work
        return this.http.patch('https://node-angular-messenger.herokuapp.com/message/' + message.messageId + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    deleteMessage(message: Message){
        // remove this message from the front end array
        this.messages.splice(this.messages.indexOf(message),1);
        // constructs the query param string to attach the token to the url for http requests
        const token = localStorage.getItem('token') 
            ? '?token=' + localStorage.getItem('token') 
            : '';
        console.log("made past splice");
        // DEV change below link to https://localhost:3000/ ~~~ whatever for dev work
        return this.http.delete('https://node-angular-messenger.herokuapp.com/message/' + message.messageId + token)
            .map((response: Response) =>  response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }
}