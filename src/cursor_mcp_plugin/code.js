figma.showUI(__html__, { width: 350, height: 450 });

// 플러그인 실행 시 MCP 연결 요청
figma.on("run", ({ command }) => {
  figma.ui.postMessage({ type: "auto-connect" });
});

// 선택된 오브젝트 정보 MCP로 전송
figma.on("selectionchange", () => {
  const selection = figma.currentPage.selection;

  if (selection.length > 0) {
    const node = selection[0];
    const payload = {
      type: "selection",
      id: node.id,
      name: node.name,
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      typeName: node.type,
    };

    figma.ui.postMessage(payload);
  }
});

// MCP에서 받은 명령 실행
figma.ui.onmessage = async (msg) => {
  if (msg.type === "execute-command") {
    try {
      const result = await handleCommand(msg.command, msg.params);
      figma.ui.postMessage({ type: "command-result", id: msg.id, result });
    } catch (error) {
      figma.ui.postMessage({ type: "command-error", id: msg.id, error: error.message });
    }
  }
};

// 명령 라우터
async function handleCommand(command, params) {
  switch (command) {
    case "set_fill_color":
      return await setFillColor(params);
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

// 색상 변경 처리
async function setFillColor(params) {
  const {
    nodeId,
    color: { r, g, b, a },
  } = params || {};

  if (!nodeId) throw new Error("Missing nodeId");
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) throw new Error("Node not found");
  if (!("fills" in node)) throw new Error("Node does not support fills");

  node.fills = [
    {
      type: "SOLID",
      color: { r: parseFloat(r), g: parseFloat(g), b: parseFloat(b) },
      opacity: parseFloat(a),
    },
  ];

  return { success: true, nodeId, color: { r, g, b, a } };
}
figma.showUI(__html__, { width: 350, height: 450 });

// 플러그인 실행 시 MCP 연결 요청
figma.on("run", ({ command }) => {
  figma.ui.postMessage({ type: "auto-connect" });
});

// 선택된 오브젝트 정보 MCP로 전송
figma.on("selectionchange", () => {
  const selection = figma.currentPage.selection;

  if (selection.length > 0) {
    const node = selection[0];
    const payload = {
      type: "selection",
      id: node.id,
      name: node.name,
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      typeName: node.type,
    };

    figma.ui.postMessage(payload);
  }
});

// MCP에서 받은 명령 실행
figma.ui.onmessage = async (msg) => {
  if (msg.type === "execute-command") {
    try {
      const result = await handleCommand(msg.command, msg.params);
      figma.ui.postMessage({ type: "command-result", id: msg.id, result });
    } catch (error) {
      figma.ui.postMessage({ type: "command-error", id: msg.id, error: error.message });
    }
  }
};

// 명령 라우터
async function handleCommand(command, params) {
  switch (command) {
    case "set_fill_color":
      return await setFillColor(params);
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

// 색상 변경 처리
async function setFillColor(params) {
  const {
    nodeId,
    color: { r, g, b, a },
  } = params || {};

  if (!nodeId) throw new Error("Missing nodeId");
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) throw new Error("Node not found");
  if (!("fills" in node)) throw new Error("Node does not support fills");

  node.fills = [
    {
      type: "SOLID",
      color: { r: parseFloat(r), g: parseFloat(g), b: parseFloat(b) },
      opacity: parseFloat(a),
    },
  ];

  return { success: true, nodeId, color: { r, g, b, a } };
}
