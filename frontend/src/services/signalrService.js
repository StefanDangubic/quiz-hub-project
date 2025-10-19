import * as signalR from "@microsoft/signalr"

const SIGNALR_HUB_URL = `${import.meta.env.VITE_API_URL}/hubs/quizroom`
 
class SignalRService {
  constructor() {
    this.connection = null
    this.isConnected = false
    this.eventHandlers = new Map()
  }

 
  async connect(token) {
  // Ako već postoji konekcija, ali nije aktivna – restartuj je
  if (this.connection && this.connection.state !== signalR.HubConnectionState.Connected) {
    console.log("[SignalR] Restarting inactive connection...");
    try {
      await this.connection.start();
      this.isConnected = true;
      console.log("[SignalR] Connection restarted");
      return;
    } catch (err) {
      console.error("[SignalR] Restart failed, rebuilding connection", err);
      this.connection = null; // napravi novu ispod
    }
  }

  // Ako već postoji aktivna konekcija
  if (this.isConnected && this.connection?.state === signalR.HubConnectionState.Connected) {
    console.log("[SignalR] Already connected");
    return;
  }

  // Kreiranje nove konekcije
  this.connection = new signalR.HubConnectionBuilder()
    .withUrl(SIGNALR_HUB_URL, {
      accessTokenFactory: () => token,
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000])
    .configureLogging(signalR.LogLevel.Information)
    .build();

  this.connection.onreconnecting(() => {
    console.log("[SignalR] Reconnecting...");
    this.isConnected = false;
  });

  this.connection.onreconnected(() => {
    console.log("[SignalR] Reconnected");
    this.isConnected = true;

    // Ponovno dodaj sve handlere
    for (const [event, handlers] of this.eventHandlers.entries()) {
      handlers.forEach(cb => this.connection.on(event, cb));
    }
  });

  this.connection.onclose(() => {
    console.log("[SignalR] Connection closed");
    this.isConnected = false;
  });

  try {
    await this.connection.start();
    this.isConnected = true;
    console.log("[SignalR] Connected successfully");


    for (const [event, handlers] of this.eventHandlers.entries()) {
      handlers.forEach(cb => this.connection.on(event, cb));
    }
  } catch (error) {
    console.error("[SignalR] Connection failed:", error);
    throw error;
  }
}

 async disconnect() {
    if (this.connection) {
      try {
        await this.connection.stop()
        this.connection = null
        this.isConnected = false
        this.eventHandlers.clear()
        console.log("[SignalR] Disconnected")
      } catch (error) {
        console.error("[SignalR] Disconnect error:", error)
      }
    }
  }

  on(eventName, callback) {
  if (!this.eventHandlers.has(eventName)) {
    this.eventHandlers.set(eventName, []);
  }
  this.eventHandlers.get(eventName).push(callback);


  if (this.connection && this.isConnected) {
    this.connection.on(eventName, callback);
  }
}

  off(eventName, callback) {
    if (this.connection) {
      this.connection.off(eventName, callback)

      if (this.eventHandlers.has(eventName)) {
        const handlers = this.eventHandlers.get(eventName)
        const index = handlers.indexOf(callback)
        if (index > -1) {
          handlers.splice(index, 1)
        }
      }
    }
  }

  async invoke(methodName, ...args) {
    if (!this.connection || !this.isConnected) {
      throw new Error("SignalR connection not established")
    }

    try {
      return await this.connection.invoke(methodName, ...args)
    } catch (error) {
      console.error(`[SignalR] Invoke ${methodName} failed:`, error)
      throw error
    }
  }

  async joinRoom(roomCode) {
    return await this.invoke("JoinRoom", roomCode)
  }

  async leaveRoom(roomId) {
    return await this.invoke("LeaveRoom", roomId)
  }

   async submitAnswer(roomId, questionId, selectedAnswerId, selectedAnswerIds, textAnswer) {
    return await this.invoke("SubmitAnswer", roomId, questionId, selectedAnswerId, selectedAnswerIds, textAnswer)
  }


  async startQuiz(roomId) {
    return await this.invoke("StartQuiz", roomId)
  }
}

export default new SignalRService()
