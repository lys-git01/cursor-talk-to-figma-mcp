import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import useToastStore from "@/store/toastStore";

const editableOptions = [
  { label: "수정불가", value: "수정불가" },
  { label: "수정가능", value: "수정가능" },
];
const useOptions = [
  { label: "사용", value: "0" },
  { label: "미사용", value: "1" },
];

const MgmtHistoryForm7405 = ({ state = "추가", data = {}, onCloseFn }) => {
  const showToast = useToastStore.getState().showToast;
  const [form, setForm] = useState({
    parentModule: data.parentModule || "",
    parentCode: data.parentCode || "",
    parentName: data.parentName || "",
    code: data.code || "",
    name: data.name || "",
    editable: data.editable || "수정불가",
    isUse: data.isUse || "0",
    spec: data.spec || "",
    bigo: data.bigo || "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onCloseFn(form);
    showToast({
      severity: "success",
      summary: "저장 완료",
      detail: "저장되었습니다.",
      life: 3000,
    });
  };

  return (
    <Dialog
      header={`관리항목 ${state === "수정" ? "수정" : "추가"}`}
      visible
      modal
      onHide={onCloseFn}
    >
      <div className="Dialog-container form-list" style={{ padding: 0 }}>
        <div className="form__input">
          <label>관리내역 모듈</label>
          <InputText value={form.parentModule} disabled style={{ width: "100%" }} />
        </div>
        <div className="form__input">
          <label>관리내역 코드</label>
          <InputText value={form.parentCode} disabled style={{ width: "100%" }} />
        </div>
        <div className="form__input">
          <label>관리내역 명</label>
          <InputText value={form.parentName} disabled style={{ width: "100%" }} />
        </div>
        <div className="form__input">
          <label>관리항목 코드*</label>
          <InputText
            value={form.code}
            onChange={(e) => handleChange("code", e.target.value.replace(/[^0-9]/g, ""))}
            disabled={state === "수정"}
            placeholder="숫자만 입력"
            maxLength={10}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form__input">
          <label>관리항목 명*</label>
          <InputText
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form__input">
          <label style={{ color: "#d32f2f" }}>수정가능여부</label>
          <Dropdown
            value={form.editable}
            options={editableOptions}
            onChange={(e) => handleChange("editable", e.value)}
            style={{ width: "100%" }}
            placeholder="선택"
          />
        </div>
        <div className="form__input">
          <label style={{ color: "#d32f2f" }}>사용유무</label>
          <Dropdown
            value={form.isUse}
            options={useOptions}
            onChange={(e) => handleChange("isUse", e.value)}
            style={{ width: "100%" }}
            placeholder="선택"
          />
        </div>
        <div className="form__input">
          <label>관리항목 규격</label>
          <InputText
            value={form.spec}
            onChange={(e) => handleChange("spec", e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form__input">
          <label>관리항목 비고</label>
          <InputText
            value={form.bigo}
            onChange={(e) => handleChange("bigo", e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div className="Dialog__btns" style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button label="취소" severity="secondary" onClick={onCloseFn} />
        <Button label="저장" onClick={handleSave} />
      </div>
    </Dialog>
  );
};

export default MgmtHistoryForm7405;
