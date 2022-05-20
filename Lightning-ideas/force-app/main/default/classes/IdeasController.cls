public with sharing class IdeasController {

    @AuraEnabled(cacheable=true)
    public static List<Idea> getIdeas(){
        return [SELECT Id,Body,Categories,NumComments,RecordType.DeveloperName,Title,VoteScore,VoteTotal,Status FROM Idea];
    }

    @AuraEnabled(cacheable=true)
    public static String createIdea(){
        Idea newIdea = new Idea();
        Database.insert(newIdea,false);
        /*for(Database.SaveResult sr : ){
            if(sr.isSuccess()){
                return 'Idea created';
            }
            else{
                return 'Failed to create idea'+sr.getErrors();
            }
        }*/
        return '';
    }

    @AuraEnabled(cacheable=true)
    public static Boolean voteOnIdea(){
        return true;
    }

    @AuraEnabled(cacheable=true)
    public static Boolean addUpdateComment(){
        return true;
    }

    @AuraEnabled(cacheable=true)
    public static Boolean deleteComment(){
        return true;
    }

}
