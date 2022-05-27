import { LightningElement,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getIdeas from '@salesforce/apex/ideasController.getIdeas';
import createIdea from '@salesforce/apex/ideasController.createIdea';
import deleteIdea from '@salesforce/apex/ideasController.deleteIdea';
import voteOnIdea from '@salesforce/apex/ideasController.voteOnIdea';
import addUpdateComment from '@salesforce/apex/ideasController.addUpdateComment';
import deleteComment from '@salesforce/apex/ideasController.deleteComment';

export default class LightningIdeas extends LightningElement {

    showNewIdeaForm = false;
    error;
    newIdea = {};

    handleChange(event){
        this.newIdea[event.target.name] = event.target.value;
    }

    createNewIdea(){
        console.log('in newIdea');
        this.showNewIdeaForm = true;
    }

    insertNewIdea() {
        //note can't use lightning-record-form/lightning/uiRecordApi as the object is not enabled for lightning!
        createIdea({ newIdeaJSON: JSON.stringify(this.newIdea) })
            .then((result) => {
                this.error = undefined;
                this.showNewIdeaForm = false;
            })
            .catch((error) => {
                console.log(JSON.stringify(error));
                this.error = error;
            });
    }

    deleteIdea(event){
        deleteIdea({ideaId: event.currentTarget.dataset.id})
            .then((result) => {
                //remove from
                this.ideas.remove(event.currentTarget.dataset.id);
            })
            .catch((error) => {
                console.log(JSON.stringify(error));
                this.error = error;
            })
    }

    cancelNewIdea(){
        this.showNewIdeaForm = false;
    }

    @wire(getIdeas)ideas;
}