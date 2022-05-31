import { LightningElement } from 'lwc';
import createIdea from '@salesforce/apex/ideasController.createIdea';

export default class NewLightningIdea extends LightningElement {

    newIdea = {};

    handleChange(event){
        this.newIdea[event.target.name] = event.target.value;
    }

    insertNewIdea() {
        //note can't use lightning-record-form/lightning/uiRecordApi as the object is not enabled for lightning!

        if(this.newIdea.title && this.newIdea.description && this.newIdea.categories){
            createIdea({ newIdeaJSON: JSON.stringify(this.newIdea) })
            .then((result) => {
                this.error = undefined;

                const createEvent = new CustomEvent('newideacreated',{
                    detail: 'created'
                });
        
                this.dispatchEvent(createEvent);
            })
            .catch((error) => {
                console.log(JSON.stringify(error));
                this.error = error;
            });
        }
        else{
            console.error('Missing fields');
            //throw new Error('Missing fields'); 
        }

    }

    closeCancel(){
        const closeEvent = new CustomEvent('closenewmodal',{
            detail: 'close'
        });

        this.dispatchEvent(closeEvent);
    }

}