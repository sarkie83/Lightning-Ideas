public with sharing class IdeasController {

    @AuraEnabled(cacheable=true)
    public static Map<String,List<String>> getFilterables(){
        List<String> Statuses = new List<String>();
        List<String> Categories = new List<String>();
        List<String> Zones = new List<String>();
        for(Idea idea: [SELECT Status,Categories,Community.Name FROM Idea]){
            if(!Statuses.contains(idea.Status)){
                Statuses.add(idea.Status);
            }
            if(!Categories.contains(idea.Categories)){
                Categories.add(idea.Categories); //TODO - string.split?
            }
            if(!Zones.contains(idea.Community.Name)){
                Zones.add(idea.Community.Name);
            }
        }
        return new Map<String,List<String>>{'Statuses' => Statuses,'Categories' => Categories,'Zones' => Zones};
    }

    @AuraEnabled(cacheable=true)
    public static List<Idea> getIdeas(){
        return [SELECT Id,Body,Categories,NumComments,RecordType.DeveloperName,Title,VoteScore,VoteTotal,Status FROM Idea ORDER BY VoteScore DESC];
    }

    @AuraEnabled(cacheable=false)
    public static String createIdea(String newIdeaJSON){
        system.debug(newIdeaJSON);
        Map<String, Object> m = (Map<String, Object>)JSON.deserializeUntyped(newIdeaJSON);

        Community internalZone = [SELECT Id FROM Community WHERE name = 'Internal Zone']; //defaul internal zone

        Idea newIdea        = new Idea();
        newIdea.Title       = (String)m.get('title');
        newIdea.Body        = (String)m.get('body');
        newIdea.Categories  = (String)m.get('categories');
        newIdea.CommunityId = (String)m.get('zone') != null ? (String)m.get('zone') : internalZone.id;
        newIdea.Status      = 'New';
        system.debug(newIdea);
        insert newIdea;
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

    @AuraEnabled(cacheable=false)
    public static String deleteIdea(Id ideaId){
        Idea ideaToDelete = new Idea(Id=ideaId);
        delete ideaToDelete;
        return '';
    }

    @AuraEnabled()
    public static Boolean voteOnIdea(Id ideaId,String type){
        Vote newVote = new Vote();
        newVote.parentId = ideaId;
        newVote.Type = type;
        insert newVote;
        return true;
    }

    @AuraEnabled(cacheable=true)
    public static Boolean addUpdateComment(Id ideaId, Id commentId, String comment){
        IdeaComment newComment = new IdeaComment();
        newComment.IdeaId = ideaId;
        newComment.Id = commentId;
        newComment.CommentBody = comment;
        upsert newComment;
        return true;
    }

    @AuraEnabled(cacheable=true)
    public static Boolean deleteComment(Id commentId){
        delete new IdeaComment(Id=commentId);
        return true;
    }

}