// sendCommand.cjs (파일명 주의: .cjs 확장자 유지)
const WebSocket = require('ws');

// WebSocket 서버 주소
const ws = new WebSocket('ws://localhost:3055');

// 서버 연결 후 명령 전송
ws.on('open', function open() {
  console.log('✅ 연결 성공: PrimeReact Button 교체 명령 전송 중...');

  const command = {
    type: 'command_from_cursor',
    channel: 'default',
    id: 'build-button',
    command: 'replace_with_component',
    params: {
      nodeId: '15:3', // 👈 실제 Figma 선택 노드 ID로 교체 필요
      componentType: 'Button',
      props: {
        label: '저장',
        type: 'submit'
      }
    }
  };

  ws.send(JSON.stringify(command));
  console.log('✅ 명령 전송 완료:', command);
  ws.close();
});

// 에러 처리
ws.on('error', function error(err) {
  console.error('❌ WebSocket 연결 오류:', err.message);
});
