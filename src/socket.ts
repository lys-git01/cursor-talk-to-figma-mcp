import { Server, ServerWebSocket } from "bun";

// 채널별 클라이언트 관리
const channels = new Map<string, Set<ServerWebSocket<any>>>();

function handleConnection(ws: ServerWebSocket<any>) {
  console.log("New client connected");

  // 연결된 클라이언트에게 환영 메시지 전송
  ws.send(JSON.stringify({
    type: "system",
    message: "Please join a channel to start chatting",
  }));

  ws.close = () => {
    console.log("Client disconnected");
    // 채널에서 클라이언트 제거
    channels.forEach((clients, channelName) => {
      if (clients.has(ws)) {
        clients.delete(ws);
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: "system",
              message: "A user has left the channel",
              channel: channelName
            }));
          }
        });
      }
    });
  };
}

const server = Bun.serve({
  port: 3055,
  hostname: "0.0.0.0", // Windows 외부 접근 허용
  fetch(req: Request, server: Server) {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    const success = server.upgrade(req, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (success) return;
    return new Response("WebSocket server running", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
  websocket: {
    open: handleConnection,

    message(ws: ServerWebSocket<any>, message: string | Buffer) {
      try {
        console.log("Received message from client:", message);
        const data = JSON.parse(message as string);

        // 클라이언트 채널 참여 처리
        if (data.type === "join") {
          const channelName = data.channel;
          if (!channelName || typeof channelName !== "string") {
            ws.send(JSON.stringify({ type: "error", message: "Channel name is required" }));
            return;
          }

          if (!channels.has(channelName)) {
            channels.set(channelName, new Set());
          }

          const channelClients = channels.get(channelName)!;
          channelClients.add(ws);

          ws.send(JSON.stringify({
            type: "system",
            message: `Joined channel: ${channelName}`,
            channel: channelName
          }));

          console.log("Client joined channel:", channelName);

          channelClients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: "system",
                message: "A new user has joined the channel",
                channel: channelName
              }));
            }
          });
          return;
        }

        // 일반 메시지 브로드캐스트
        if (data.type === "message") {
          const channelName = data.channel;
          const channelClients = channels.get(channelName);

          if (!channelClients || !channelClients.has(ws)) {
            ws.send(JSON.stringify({
              type: "error",
              message: "You must join the channel first"
            }));
            return;
          }

          channelClients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: "broadcast",
                message: data.message,
                sender: client === ws ? "You" : "User",
                channel: channelName
              }));
            }
          });
          return;
        }

        // 🎯 Cursor → MCP 명령 → Figma 전달
        if (data.type === "command_from_cursor") {
          const channelName = data.channel || "default";
          const channelClients = channels.get(channelName);

          if (!channelClients || channelClients.size === 0) {
            ws.send(JSON.stringify({
              type: "error",
              message: `No clients in channel '${channelName}' to receive command.`
            }));
            return;
          }

          const commandToSend = {
            type: "execute-command",
            id: data.id || "cursor-auto",
            command: data.command,
            params: data.params
          };

          channelClients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(commandToSend));
            }
          });

          console.log(`[MCP] Sent command to Figma in '${channelName}':`, commandToSend);
          return;
        }

      } catch (err) {
        console.error("Error handling message:", err);
      }
    },

    close(ws: ServerWebSocket<any>) {
      channels.forEach((clients) => {
        clients.delete(ws);
      });
    }
  }
});

console.log(`✅ WebSocket server running on port ${server.port}`);
