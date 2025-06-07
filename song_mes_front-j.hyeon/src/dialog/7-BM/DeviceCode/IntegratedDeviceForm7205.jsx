import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const screenOptions = [
  { label: "표시", value: "표시" },
  { label: "미표시", value: "미표시" },
];

const useYnOptions = [
  { label: "사용", value: "사용" },
  { label: "미사용", value: "미사용" },
];

const IntegratedDeviceForm7205 = ({ onCloseFn, state = "추가", data }) => {
  const [form, setForm] = useState({
    code: data?.code ?? "",
    name: data?.name ?? "",
    screen: data?.screen ?? "표시",
    useYn: data?.useYn ?? "사용",
  });

  const handleSubmit = () => {
    // 필수값 체크 등 유효성 검사 추가 가능
    onCloseFn(form);
  };

  return (
    <Dialog header={`공통 기기코드 ${state}`} onHide={() => onCloseFn()} modal visible>
      <div className="Dialog-container form-list">
        {state === "수정" && (
          <div className="form__input">
            <p>통합코드</p>
            <span>{form.code}</span>
          </div>
        )}
        <div className="form__input">
          <label htmlFor="name">통합 기기명*</label>
          <InputText
            id="name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div className="form__input">
          <label htmlFor="screen">화면표시</label>
          <Dropdown
            id="screen"
            value={form.screen}
            options={screenOptions}
            onChange={(e) => setForm((prev) => ({ ...prev, screen: e.value }))}
          />
        </div>
        <div className="form__input">
          <label htmlFor="useYn">사용유무</label>
          <Dropdown
            id="useYn"
            value={form.useYn}
            options={useYnOptions}
            onChange={(e) => setForm((prev) => ({ ...prev, useYn: e.value }))}
          />
        </div>
        <div className="Dialog__btns">
          <Button label="취소" severity="secondary" onClick={() => onCloseFn()} />
          <Button label="저장" onClick={handleSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default IntegratedDeviceForm7205;
