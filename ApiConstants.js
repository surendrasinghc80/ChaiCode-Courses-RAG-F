export const AuthenticationApi = {
  Login: "/course/login", // POST
  Register: "/course/signup", // POST
};

export const CourseApi = {
  AddingSourse: "/course/upload-vtt", // POST
  AnswerQuestion: "/course/ask", // POST
};

export const ConversationApi = {
  CreateConversation: "/conversations", // POST
  GetAllConversations: "/conversations", // GET
  GetConversationStats: "/conversations/stats", // GET
  GetConversation: "/conversations/:conversationId", // GET
  UpdateConversation: "/conversations/:conversationId", // POST
  DeleteConversation: "/conversations/:conversationId", // DELETE
};

export const ArchiveApi = {
  ArchiveConversation: "/conversations/:conversationId/archive", // POST
  GetAllArchives: "/conversations/archives", // GET
  GetArchiveStats: "/conversations/archives/stats", // GET
  GetArchivedConversation: "/conversations/archives/:archiveId", // GET
  UpdateArchivedConversation: "/conversations/archives/:archiveId", // PUT
  DeleteArchivedConversation: "/conversations/archives/:archiveId", // DELETE
  UnarchiveConversation: "/conversations/archives/:archiveId/unarchive", // POST
};
