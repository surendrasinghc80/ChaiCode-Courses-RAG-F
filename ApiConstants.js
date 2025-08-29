export const AuthenticationApi = {
  Login: "/api/course/login", // POST
  Register: "/api/course/signup", // POST
};

export const CourseApi = {
  AddingSourse: "/api/course/upload-vtt", // POST
  AnswerQuestion: "/api/course/ask", // POST
};

export const ConversationApi = {
  CreateConversation: "/api/conversations", // POST
  GetAllConversations: "/api/conversations", // GET
  GetConversationStats: "/api/conversations/stats", // GET
  GetConversation: "/api/conversations/:conversationId", // GET
  UpdateConversation: "/api/conversations/:conversationId", // POST
  DeleteConversation: "/api/conversations/:conversationId", // DELETE
};

export const ArchiveApi = {
  ArchiveConversation: "/api/conversations/:conversationId/archive", // POST
  GetAllArchives: "/api/conversations/archives", // GET
  GetArchiveStats: "/api/conversations/archives/stats", // GET
  GetArchivedConversation: "/api/conversations/archives/:archiveId", // GET
  UpdateArchivedConversation: "/api/conversations/archives/:archiveId", // PUT
  DeleteArchivedConversation: "/api/conversations/archives/:archiveId", // DELETE
  UnarchiveConversation: "/api/conversations/archives/:archiveId/unarchive", // POST
};

export const AdminApi = {
  GetAllUsers: "/api/admin/users", // GET - with query params: page, limit, search, role
  GetUserDetails: "/api/admin/users/:userId", // GET
  ToggleUserAccess: "/api/admin/users/:userId/access", // PATCH - body: { isActive: boolean }
  ResetUserMessageCount: "/api/admin/users/:userId/reset-messages", // PATCH
  GetPlatformStats: "/api/admin/stats", // GET
};
