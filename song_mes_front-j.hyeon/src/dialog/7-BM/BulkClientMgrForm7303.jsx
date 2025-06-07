import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const sampleClients = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  code: "12345",
  grade: "정상",
  name: "(주)홍길동",
}));

const BulkClientMgrForm7303 = ({ onCloseFn, data = {} }) => {
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);
  const [form, setForm] = useState({
    currentManager: data?.currentManager ?? "",
    changeManager: { ID: "", name: "" },
    reason: "",
    selectedClients: [],
  });

  // 저장
  const saveData = () => {
    onCloseFn();
    showToast({
      severity: "success",
      summary: "저장 완료",
      detail: "저장되었습니다.",
      life: 3000,
    });
  };

  const handleChangeManagerSearch = () => {
    openDialog("DGManager", {
      onClose: (value) => {
        if (value) setForm({ ...form, changeManager: value });
      },
    });
  };
  return (
    <Dialog
      header="거래담당 일괄 변경"
      visible={true}
      style={{ width: "600px" }}
      onHide={onCloseFn}
      closable
      modal
      className="BulkClientMgrForm7303"
    >
      <div className="form-list">
        <div className="form__input">
          <label>현재 담당자</label>
          <InputText value={form.currentManager} disabled />
        </div>
        <div className="form__input">
          <label>변경 담당자*</label>
          <div className="p-inputgroup">
            <InputText
              placeholder="검색"
              name="search"
              id="search"
              value={form.changeManager.name}
              disabled
            />
            <Button icon="pi pi-search" onClick={handleChangeManagerSearch} />
          </div>
        </div>
        <div className="form__input">
          <label>담당변경 사유</label>
          <InputText
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="담당변경 사유"
            style={{ width: 300 }}
          />
        </div>
      </div>
      <DataTable
        emptyMessage="데이터가 없습니다."
        value={data?.clientList ?? []}
        selection={form.selectedClients}
        onSelectionChange={(e) => setForm({ ...form, selectedClients: e.value })}
        selectionMode="checkbox"
        dataKey="id"
        scrollable
        resizableColumns
        scrollHeight="flex"
        showGridlines
        size="small"
        maxHeight="200px"
      >
        <Column selectionMode="multiple" />
        <Column
          header="순번"
          body={(_, options) => options.rowIndex + 1}
          style={{ width: "60px" }}
        />
        <Column field="code" header="거래코드" />
        <Column field="grade" header="등급" />
        <Column field="name" header="거래처명" />
      </DataTable>
      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={onCloseFn}></Button>
        <Button label="저장" onClick={saveData}></Button>
      </div>
    </Dialog>
  );
};

export default BulkClientMgrForm7303;
