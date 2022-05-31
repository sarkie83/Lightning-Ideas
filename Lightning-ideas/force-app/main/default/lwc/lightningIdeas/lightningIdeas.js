import { LightningElement,track,wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import IDEA_OBJECT from '@salesforce/schema/Idea';
import getFilterables from '@salesforce/apex/ideasController.getFilterables';
import getIdeas from '@salesforce/apex/ideasController.getIdeas';
import deleteIdea from '@salesforce/apex/ideasController.deleteIdea';
import voteOnIdea from '@salesforce/apex/ideasController.voteOnIdea';
import addUpdateComment from '@salesforce/apex/ideasController.addUpdateComment';
import deleteComment from '@salesforce/apex/ideasController.deleteComment';

export default class LightningIdeas extends LightningElement {

    showNewIdeaForm = false;
    error;
    zones;
    categories;
    statuses;

    toastTitle = 'New Idea Created!';
    toastMsg;
    toastVariant = 'success';

    ideas;
    _wiredIdeasResponse; //this is what needs to be refreshed by refreshApex NOT just the inner data
    
    //TODO, might want to do this on filerables as well

    connectedCallback() {
        console.log(location.search); //note params should begin c__
    }

    @wire(getObjectInfo, { objectApiName: IDEA_OBJECT})
    propertyOrFunction;

    @wire(getFilterables)
    filterables({ error, data }) {
        if (data) {
            console.log(data);
            console.log(JSON.stringify(data));
            this.zones = data['Zones'];
            this.statuses = data['Statuses'];
            this.categories = data['Categories'];
            this.error = undefined;
        } else if (error) {
            this.error = error;
            //this.contacts = undefined;
        }
    };

    createNewIdea(){
        this.showNewIdeaForm = true;
    }

    voteOnIdea(event){
        console.log(event.currentTarget.dataset.vote);
        voteOnIdea({ideaId: event.currentTarget.dataset.id, upvote: event.currentTarget.dataset.vote})
            .then((resut) => {
                //refreshApex(this._wiredIdeasResponse);    
            })
            .catch((error) => {

            })
    }

    deleteIdea(event){
        deleteIdea({ideaId: event.currentTarget.dataset.id})
            .then((result) => {
                refreshApex(this._wiredIdeasResponse);        
            })
            .catch((error) => {
                console.log(JSON.stringify(error));
                this.error = error;
            })
    }

    cancelNewIdea(event){
        if(event.detail==='close'){
            this.showNewIdeaForm = false;
        }
    }

    newIdeaCreated(event){
        console.log('in newIdeaCreated');
        if(event.detail==='created'){
            this.showNotification();
            this.showNewIdeaForm = false;
            refreshApex(this._wiredIdeasResponse);
        }
    }

    @wire(getIdeas)
    fetchideas(wireResult) {
        const { data, error } = wireResult;
        this._wiredIdeasResponse = wireResult;
        console.log(JSON.stringify(data));
        if (data) {
            this.ideas = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            //this.contacts = undefined;
        }
    };

    showNotification() {
        const evt = new ShowToastEvent({
            title: this.toastTitle,
            message: this.toastMsg,
            variant: this.toastVariant,
        });
        this.dispatchEvent(evt);
    }
}