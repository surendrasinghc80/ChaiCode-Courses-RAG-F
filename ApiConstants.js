export const AuthenticationApi = {
  Login: "/login", // POST
  Register: "/signup", // POST
};

export const CourseApi = {
  AddingSourse: "/api/course/upload-vtt", // POST
  AnswerQuestion: "/api/course/ask", // POST
};

export const ChatApi = {
  CreateChat: "/api/chat", // POST
  GetChatHistory: "/api/chat/conversation", // GET /:conversationId
  GetUserConversations: "/api/chat/user", // GET /:userId/conversations
  SearchChats: "/api/chat/search", // GET
  DeleteConversation: "/api/chat/conversation", // DELETE /:conversationId
  GetChatStats: "/api/chat/stats", // GET /:userId?
};
