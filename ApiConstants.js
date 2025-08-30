export const AuthenticationApi = {
  Login: "/course/login", // POST
  Register: "/course/signup", // POST
};

export const CourseApi = {
  AddingSourse: "/course/upload-vtt", // POST
  AnswerQuestion: "/course/ask", // POST
  CreateCourse: "/course/courses", // POST
  GetCourses: "/course/courses", // GET
  UpdateCourse: "/course/courses/:courseId", // PUT
  DeleteCourse: "/course/courses/:courseId", // DELETE
  GrantCourseAccess: "/course/grant-access", // POST
  RevokeCourseAccess: "/course/revoke-access", // POST
  GetUserCourses: "/course/user-courses", // GET
  GetUserCoursesById: "/course/user-courses/:userId", // GET
  GetRagStats: "/course/rag-stats", // GET
  GetRagStatsById: "/course/rag-stats/:userId", // GET
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

export const AdminApi = {
  GetAllUsers: "/admin/users", // GET - with query params: page, limit, search, role
  GetUserDetails: "/admin/users/:userId", // GET
  ToggleUserAccess: "/admin/users/:userId/access", // PATCH - body: { isActive: boolean }
  ResetUserMessageCount: "/admin/users/:userId/reset-messages", // PATCH
  GetPlatformStats: "/admin/stats", // GET
};
