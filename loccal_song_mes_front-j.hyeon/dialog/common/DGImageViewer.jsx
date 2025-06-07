// 이미지 뷰어	신규	DG-79

import useToastStore from "@/store/toastStore";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect } from "react";

const DGImageViewer = ({ onCloseFn, company, title, print }) => {
  const showToast = useToastStore.getState().showToast;

  // TODO
  const printBtn = () => {
    showToast({
      severity: "info",
      summary: "출력",
      detail: "출력",
    });
  };

  useEffect(() => {
    // TODO 백엔드 데이터 호출
    console.log("회사명", company);
  }, []);

  return (
    <Dialog
      header={title}
      visible
      modal={false}
      tyle={{ width: "50vw" }}
      onHide={onCloseFn}
      className="imageViewer"
    >
      <div className="Dialog-container">
        <img src="https://placehold.co/400x500" alt="사업자 등록증 이미지" />
      </div>
      <div className="Dialog__btns">
        <Button label="닫기" severity="secondary" onClick={onCloseFn}></Button>
        {print && <Button label="출력" onClick={printBtn}></Button>}
      </div>
    </Dialog>
  );
};

export default DGImageViewer;
