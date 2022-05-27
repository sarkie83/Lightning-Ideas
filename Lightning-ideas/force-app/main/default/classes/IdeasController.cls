public with sharing class IdeasController {

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

    @AuraEnabled(cacheable=true)
    public static Boolean voteOnIdea(Id ideaId,Boolean upvote){
        IdeaComment newComment = new IdeaComment();
        newComment.IdeaId = ideaId;
        //newComment.UpVotes = upvote ? 10 : -10;
        insert newComment;
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