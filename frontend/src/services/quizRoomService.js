import api from "./api"

class QuizRoomService {
  async createRoom(createRoomDto) {
    const response = await api.post("/quizrooms", createRoomDto)
    return response.data
  }

  async getActiveRooms() {
    const response = await api.get("/quizrooms/active")
    return response.data
  }

  async getUpcomingRooms() {
    const response = await api.get("/quizrooms/upcoming")
    return response.data
  }

   async getRoomByCode(roomCode) {
    const response = await api.get(`/quizrooms/code/${roomCode}`)
    return response.data
  }

   async joinRoom(roomCode) {
    const response = await api.post("/quizrooms/join", { roomCode })
    return response.data
  }

   async leaveRoom(roomId) {
    const response = await api.post(`/quizrooms/${roomId}/leave`)
    return response.data
  }
  async deleteRoom(roomId) {
    const response = await api.delete(`/quizrooms/${roomId}`)
    return response.data
  }

} 

export default new QuizRoomService()
