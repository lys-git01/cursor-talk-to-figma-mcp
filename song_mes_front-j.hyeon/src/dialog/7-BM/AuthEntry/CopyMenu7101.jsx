import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import React, { useState } from "react";
import useDialogStore from "@/store/dialogStore";
import { InputText } from "primereact/inputtext";
import useToastStore from "@/store/toastStore";
import { confirmDialog } from "primereact/confirmdialog";

const CopyMenu7101 = ({ onCloseFn, user }) => {
  const openDialog = useDialogStore.getState().openDialog;
  const [copyUser, setCopyUser] = useState([
    { name: user.name, id: user.id },
    { name: "", id: "" },
  ]);
  const showToast = useToastStore.getState().showToast;
  const findList = (index) => {
    openDialog("DGManager", {
      onClose: (data) => {
        setCopyUser(
          copyUser.map((item, i) => {
            if (i === index) {
              return { name: data.name, id: data.id };
            }
            return item;
          }),
        );
      },
    });
  };

  const copyMenu = () => {
    // TODO 백엔드 호출
    // 복사할 사용자 이름, 붙여넣기 할 사용자 이름 같으면 에러 메시지 출력
    if (copyUser[0].name === copyUser[1].name) {
      showToast({
        severity: "error",
        summary: "오류",
        detail: "복사할 사용자 이름과 붙여넣기 할 사용자 이름이 같습니다.",
      });
      return;
    }

    // TODO 이미 적용된 권한이 있으면 메시지 출력
    const isExist = true;
    if (isExist) {
      confirmDialog({
        message: "이미 적용된 권한이 있습니다. 기존 권한을 삭제 후 복사한 권한을 적용할까요?",
        header: "메뉴권한 복사",
        icon: "pi pi-info-circle",
        defaultFocus: "reject",
        accept: () => {
          console.log("accept");
          onCloseFn();
        },
        acceptLabel: "변경",
        rejectLabel: "취소",
      });
      return;
    }
    // TODO 백엔드 호출
    console.log(copyUser);
  };

  return (
    <Dialog header="메뉴권한 복사" visible onHide={onCloseFn} style={{ maxWidth: "1000px" }}>
      <div className="Dialog-container form-list">
        <div className="form__input">
          <div className="common-search__input">
            <label htmlFor="copyUser">복사할 사용자 이름</label>
            <div className="p-inputgroup">
              <InputText
                placeholder="복사할 사용자 이름"
                name="copyUser"
                id="copyUser"
                value={copyUser[0].name}
                readOnly
                disabled={true}
              />
              <Button icon="pi pi-search" onClick={() => findList(0)} />
            </div>
          </div>
        </div>
        <div className="form__input">
          <div className="common-search__input">
            <label htmlFor="pasteUser">붙여넣기 할 사용자 이름</label>
            <div className="p-inputgroup">
              <InputText
                placeholder="붙여넣기 할 사용자 이름"
                name="pasteUser"
                id="pasteUser"
                value={copyUser[1].name}
                readOnly
                disabled={true}
              />
              <Button icon="pi pi-search" onClick={() => findList(1)} />
            </div>
          </div>
        </div>
      </div>
      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={onCloseFn}></Button>
        <Button label="변경" onClick={copyMenu}></Button>
      </div>
    </Dialog>
  );
};

export default CopyMenu7101;
