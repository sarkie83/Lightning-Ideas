import { LightningElement,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getIdeas from '@salesforce/apex/ideasController.getIdeas';
import createIdea from '@salesforce/apex/ideasController.createIdea';
import voteOnIdea from '@salesforce/apex/ideasController.voteOnIdea';
import addUpdateComment from '@salesforce/apex/ideasController.addUpdateComment';
import deleteComment from '@salesforce/apex/ideasController.deleteComment';

export default class LightningIdeas extends LightningElement {

    showNewIdeaForm = true;
    newIdea = {};

    handleChange(event){
        this.newIdea[event.target.name] = event.target.value;
    }

    newIdea(){
        this.showNewIdeaForm = true;
    }

    createNewIdea() {
        //note can't use lightning-record-form/lightning/uiRecordApi as the object is not enabled for lightning!

        createIdea({ newIdeaJSON: this.newIdea })
            .then((result) => {
                this.contacts = result;
                this.error = undefined;
                this.showNewIdeaForm = false;
            })
            .catch((error) => {
                this.error = error;
                this.contacts = undefined;
            });
    }

    @wire(getIdeas)ideas;
}