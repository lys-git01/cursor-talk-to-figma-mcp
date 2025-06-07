import useToastStore from "@/store/toastStore";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import useDialogStore from "@/store/dialogStore";
import { InputNumber } from "primereact/inputnumber";

const PaperPriceEntry7209 = ({ onCloseFn, data, state }) => {
  const openDialog = useDialogStore((s) => s.openDialog);
  const showToast = useToastStore.getState().showToast;
  const initialForm = {
    type: data?.type ?? "ALL",
    clientName: data?.clientName ?? "",
    shortName: data?.shortName ?? "",
    englishName: data?.englishName ?? "",
    width: data?.width ?? 0,
    weight: data?.weight ?? 0,
    height: data?.height ?? 0,
    publicPrice: data?.publicPrice ?? 0,
    quantity: data?.quantity ?? 0,
  };
  const [form, setForm] = useState(initialForm);

  const typeOptions = [
    { label: "전체", value: "ALL" },
    { label: "합지", value: "A" },
    { label: "인쇄지", value: "B" },
  ];

  const saveData = () => {
    console.log("저장할 데이터:", form);
    showToast({
      severity: "info",
      summary: "저장",
      detail: "저장이 완료되었습니다.",
    });
    onCloseFn(form);
  };

  const clientSearchBtn = () => {
    openDialog("DGClientSelect1", {
      title: "거래처검색",
      onClose: (selectedClient) => {
        if (!selectedClient) return;
        setForm((prev) => ({
          ...prev,
          clientName: selectedClient.clientName,
        }));
      },
    });
  };

  const onChange = (field) => (e) => {
    const value = e.target ? e.target.value : e.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog
      header={`제지류공시가 ${state}`}
      visible
      onHide={() => onCloseFn(null)}
      className="PaperPriceEntry7209"
    >
      <div className="Dialog-container form-list">
        <div className="form__input">
          <p>종이구분*</p>
          <Dropdown
            value={form.type}
            onChange={onChange("type")}
            options={typeOptions}
            placeholder="구분 선택"
          />
        </div>
        <div className="form__input">
          <p>매출처*</p>
          <InputText
            value={form.clientName}
            onChange={onChange("clientName")}
            placeholder="매출처"
            disabled
          />
          <Button label="거래처검색" onClick={clientSearchBtn} />
        </div>
        <div className="form__input">
          <p>간략명*</p>
          <InputText value={form.shortName} onChange={onChange("shortName")} placeholder="간략명" />
        </div>
        <div className="form__input">
          <p>영문*</p>
          <InputText
            value={form.englishName}
            onChange={onChange("englishName")}
            placeholder="영문"
          />
        </div>
        <div className="form__input">
          <p>평량*</p>
          <InputNumber value={form.weight} onChange={onChange("weight")} placeholder="평량" />
        </div>
        <div className="form__input">
          <p>가로사이즈*</p>
          <InputNumber value={form.width} onChange={onChange("width")} placeholder="가로사이즈" />
        </div>
        <div className="form__input">
          <p>세로사이즈*</p>
          <InputNumber value={form.height} onChange={onChange("height")} placeholder="세로사이즈" />
        </div>
        <div className="form__input">
          <p>공시가격*</p>
          <InputNumber
            value={form.publicPrice}
            onChange={onChange("publicPrice")}
            placeholder="공시가격"
          />
        </div>
        <div className="form__input">
          <p>공시수량*</p>
          <InputNumber
            value={form.quantity}
            onChange={onChange("quantity")}
            placeholder="공시수량"
          />
        </div>
      </div>
      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={() => onCloseFn(null)} />
        <Button label="저장" onClick={saveData} />
      </div>
    </Dialog>
  );
};

export default PaperPriceEntry7209;
