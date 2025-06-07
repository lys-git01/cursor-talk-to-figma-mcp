import { Dialog } from "primereact/dialog";

export const ADialog = ({ onClose }) => (
  <Dialog header="Header" visible dialog={false} tyle={{ width: "50vw" }} onHide={() => {}}>
    <p className="m-0">
      <h2>버튼 A용 모달</h2>
      <p>여기는 A 모달 콘텐츠</p>
      <button onClick={onClose}>닫기</button>
    </p>
  </Dialog>
);

// src/components/dialogs/BDialog.jsx
export const BDialog = ({ message, onClose }) => (
  <Dialog header="Header" visible tyle={{ width: "50vw" }} onHide={() => {}}>
    <h2>버튼 B용 모달</h2>
    <p>{message}</p>
    <button onClick={onClose}>닫기</button>
  </Dialog>
);

// src/components/dialogs/CDialog.jsx
export const CDialog = ({ count, onClose }) => (
  <Dialog header="Header" visible tyle={{ width: "50vw" }} onHide={() => {}}>
    <h2>버튼 C용 모달</h2>
    <p>카운트: {count}</p>
    <button onClick={onClose}>닫기</button>
  </Dialog>
);
