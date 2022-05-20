import { LightningElement,wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import IDEA_OBJECT from '@salesforce/schema/Idea';
import TITLE_FIELD from '@salesforce/schema/Idea.Title';
import getIdeas from '@salesforce/apex/ideasController.getIdeas';

const columns = [
    { label: 'Id', fieldName: 'Id' },
    { label: 'Title', fieldName: 'Title' },
];

export default class LightningIdeas extends LightningElement {

    columns = columns;
    showNewIdeaForm;

    newIdea(){
        this.showNewIdeaForm = true;
    }

    createIdea() {
        const fields = {};
        fields[TITLE_FIELD.fieldApiName] = this.name;
        const recordInput = { apiName: IDEA_OBJECT.objectApiName, fields };
        createRecord(recordInput)
            .then(account => {
                this.accountId = account.id;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Idea created',
                        variant: 'success',
                    }),
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }

    @wire(getIdeas) ideas;
}