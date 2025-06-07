import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import useToastStore from "@/store/toastStore";

const typeOptions = [
  { label: "변경 가능", value: "변경가능" },
  { label: "변경 불가능", value: "변경불가능" },
];
const useOptions = [
  { label: "사용", value: "사용" },
  { label: "미사용", value: "미사용" },
];

const MgmtHistoryUpdate7405 = ({ onCloseFn, data = {} }) => {
  const showToast = useToastStore.getState().showToast;

  const [form, setForm] = useState({
    module: data.module || "모듈",
    code: data.code || "코드",
    name: data.name || "",
    type: data.type || "변경가능",
    isUse: data.isUse || "사용",
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
    <Dialog header="관리내역 수정" visible modal onHide={onCloseFn}>
      <div className="Dialog-container form-list" style={{ padding: 0 }}>
        <div className="form__input">
          <label>모듈</label>
          <InputText value={form.module} disabled style={{ width: "100%" }} />
        </div>
        <div className="form__input">
          <label>코드</label>
          <InputText value={form.code} disabled style={{ width: "100%" }} />
        </div>
        <div className="form__input">
          <label htmlFor="name">항목*</label>
          <InputText
            id="name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form__input">
          <label htmlFor="type">구분</label>
          <Dropdown
            id="type"
            value={form.type}
            options={typeOptions}
            onChange={(e) => handleChange("type", e.value)}
            style={{ width: "100%" }}
            placeholder="선택"
          />
        </div>
        <div className="form__input">
          <label htmlFor="isUse">사용유무</label>
          <Dropdown
            id="isUse"
            value={form.isUse}
            options={useOptions}
            onChange={(e) => handleChange("isUse", e.value)}
            style={{ width: "100%" }}
            placeholder="선택"
          />
        </div>
        <div className="form__input">
          <label htmlFor="bigo">비고</label>
          <InputText
            id="bigo"
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

export default MgmtHistoryUpdate7405;
