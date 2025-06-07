import React from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import useToastStore from "@/store/toastStore";

const UpdateMemo7102 = ({ onCloseFn, company }) => {
  const showToast = useToastStore.getState().showToast;
  const [value, setValue] = useState(
    `대표자주소:\n법인번호:\n주민번호:\n전화번호:\n결재담당:\n작업담당:\n결재일:\n최초거래일:\n거래동기및상담자:\n사업개시일:\n신용상태:\n기타참조사항:`,
  );
  console.log("회사명", company);

  // TODO
  const updateMeno = () => {
    showToast({
      severity: "info",
      summary: "메모 수정",
      detail: "메모 수정",
    });
    onCloseFn();
  };

  return (
    <Dialog
      header="거래처 메모 수정"
      visible
      tyle={{ width: "50vw" }}
      onHide={onCloseFn}
      style={{ maxWidth: "1000px" }}
    >
      <div className="Dialog-container">
        <InputTextarea
          autoResize
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={5}
          cols={30}
          style={{ minWidth: "600px" }}
        />
      </div>
      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={onCloseFn}></Button>
        <Button label="수정" onClick={updateMeno}></Button>
      </div>
    </Dialog>
  );
};

export default UpdateMemo7102;
