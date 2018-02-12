import { Component, OnInit } from "@angular/core";
import { MessageService } from "./message.service";
import { Message } from "./message.model";
import { NgForm } from "@angular/forms";


@Component({
    selector: "app-message-input",
    templateUrl: "message-input.component.html",
})
export class MessageInputComponent implements OnInit{
    message: Message;
    
    constructor(private messageService: MessageService) {}

    ngOnInit(){
        this.messageService.messageIsEdit.subscribe(
            (message: Message) => this.message = message
        );
    }

    onClear(form: NgForm){
        this.message = null;    // makes sure no local version of message is stored after a clear of an edited message
        form.resetForm();
    }

    onSubmit(form: NgForm){
        if(this.message){
            // Editing
            this.message.content = form.value.content;
            // subscribe so patch is actually sent
            this.messageService.updateMessage(this.message)
                .subscribe(
                    result => console.log(result)
                );
            this.message = null; // ensure no local version of message is stored after submit of an edited message
        } else {
            // Creating
            const message = new Message(form.value.content, 'Forest');
            // must subscribe now to faciliate the post request
            this.messageService.addMessage(message)
                .subscribe(
                    data => console.log(data),
                    error => console.error(error)
                );
         
        }

        form.resetForm();
    }
}