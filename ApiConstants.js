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
