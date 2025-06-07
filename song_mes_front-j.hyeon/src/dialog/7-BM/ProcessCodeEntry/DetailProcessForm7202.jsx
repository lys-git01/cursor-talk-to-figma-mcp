import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

const DetailProcessForm7202 = ({ onCloseFn, state = "추가", data, processCode }) => {
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);
  const [processForm, setProcessForm] = useState({
    code: data?.code || "",
    name: data?.name || "",
    billingName: data?.billingName?.name || { name: "", code: "" },
    basicDescription: data?.basicDescription?.name || [{ name: "", code: "" }],
    displayOrder: data?.displayOrder || "1000",
    useStatus: data?.useStatus === "0" ? 1 : data?.useStatus,
    productionCost: data?.productionCost || "0",
    salesCost: data?.salesCost || "0",
    mainMachine: data?.mainMachine || { name: "", code: "" },
    machineList: data?.machineList || [{ code: "1", name: "기계1" }], // 기계 목록
  });
  // TODO
  const saveData = () => {
    onCloseFn();
    showToast({
      severity: "success",
      summary: "저장 완료",
      detail: "저장되었습니다.",
      life: 3000,
    });
  };
  const findList = (type) => {
    let key = "";
    switch (type) {
      case "DGBillingCode":
        key = "billingName";
        break;
      case "DGWorkSummaryCode":
        key = "basicDescription";
        break;
      case "DGMachineList":
        key = "mainMachine";
        break;
      default:
        break;
    }
    if (type !== "DGMachineList") {
      openDialog(type, {
        onClose: (value) => {
          setProcessForm((prev) => ({
            ...prev,
            [key]: value,
          }));
        },
      });
    } else {
      openDialog(type, {
        onClose: (value) => {
          if (value.mainMachine) {
            setProcessForm((prev) => ({
              ...prev,
              mainMachine: value.mainMachine,
              machineList: value.selectedList,
            }));
          }
        },
      });
    }
  };

  return (
    <Dialog
      header={`상세 공정코드 ${state}`}
      visible
      // tyle={{ width: "50vw" }}
      onHide={onCloseFn}
      style={{ maxWidth: "1000px" }}
    >
      <div className="Dialog-container form-list">
        <div className="form__input">
          <p>공정코드</p>
          <p>{processCode}</p>
        </div>
        <div className="form__input">
          <label htmlFor="name">상세 공정명*</label>
          <InputText
            id="name"
            value={processForm.name}
            onChange={(e) => setProcessForm({ ...processForm, name: e.target.value })}
            placeholder="상세공정명"
            disabled={state.mode === "edit"}
          />
        </div>
        <div className="form__input">
          <label htmlFor="billingName">상세 청구명</label>
          <div className="p-inputgroup">
            <InputText
              placeholder="상세 청구명"
              name="billingName"
              id="billingName"
              value={processForm.billingName.name + " " + processForm.billingName.code}
              readOnly
            />
            <Button icon="pi pi-search" onClick={() => findList("DGBillingCode")} />
          </div>
        </div>

        <div className="form__input">
          <label htmlFor="displayOrder">표시순번</label>
          <InputText
            id="displayOrder"
            value={processForm.displayOrder}
            onChange={(e) => setProcessForm({ ...processForm, displayOrder: e.target.value })}
            placeholder="표시순번"
            disabled={state.mode === "edit"}
            keyfilter="int"
            maxLength={4}
          />
        </div>
        <div className="form__input">
          <label htmlFor="useStatus">사용여부</label>
          <Dropdown
            id="useStatus"
            value={processForm.useStatus}
            onChange={(e) => setProcessForm({ ...processForm, useStatus: e.target.value })}
            options={[
              { label: "미사용", value: 0 },
              { label: "사용", value: 1 },
            ]}
          />
        </div>
        <div className="form__input">
          <label htmlFor="productionCost">생산단가</label>
          <InputNumber
            id="productionCost"
            value={processForm.productionCost}
            onChange={(e) => setProcessForm({ ...processForm, productionCost: e.target.value })}
            placeholder="생산단가"
          />
        </div>
        <div className="form__input">
          <label htmlFor="salesCost">영업단가</label>
          <InputNumber
            id="salesCost"
            value={processForm.salesCost}
            onChange={(e) => setProcessForm({ ...processForm, salesCost: e.target.value })}
            placeholder="영업단가"
          />
        </div>
        <div className="form__input">
          <p>메인기계</p>
          <div className="p-inputgroup">
            <InputText
              placeholder="메인기계"
              name="mainMachine"
              id="mainMachine"
              value={processForm.mainMachine.name}
              readOnly
            />
            <Button icon="pi pi-search" onClick={() => findList("DGMachineList")} />
          </div>
        </div>
        <DataTable
          emptyMessage="데이터가 없습니다."
          value={processForm.machineList}
          dataKey="code"
          showGridlines
          size="small"
          scrollable
          scrollHeight="200px"
        >
          <Column field="code" header="기계코드" style={{ width: "100px" }}></Column>
          <Column field="name" header="기계명"></Column>
        </DataTable>
        {/* 테이블 */}
      </div>
      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={onCloseFn}></Button>
        <Button label="저장" onClick={saveData}></Button>
      </div>
    </Dialog>
  );
};

export default DetailProcessForm7202;
