import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import React, { useState } from "react";

const USE_STATUS_OPTIONS = [
  { label: "사용", value: true },
  { label: "미사용", value: false },
];

const DivisionForm7403 = ({ onCloseFn, state = "추가", data = {} }) => {
  const [form, setForm] = useState({
    code: data.code ?? "",
    name: data.name ?? "",
    useStatus: data.useStatus ?? true,
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    noEndDate: data.noEndDate ?? false,
    note: data.note ?? "",
  });

  // 저장
  const saveData = () => {
    // 저장 로직 필요시 추가
    onCloseFn();
  };

  // 사용종료 없음 체크박스
  const handleNoEndDate = (e) => {
    setForm((prev) => ({
      ...prev,
      noEndDate: e.checked,
      endDate: e.checked ? null : prev.endDate,
    }));
  };

  return (
    <Dialog header={`부문 ${state}`} visible onHide={onCloseFn}>
      <div className="Dialog-container form-list">
        {/* 부문코드 */}
        <div className="form__input">
          <label htmlFor="code">
            부문코드<span style={{ color: "red" }}>*</span>
          </label>
          <InputText
            id="code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            placeholder="부문코드"
            disabled={state !== "추가"}
          />
        </div>
        {/* 부문명 */}
        <div className="form__input">
          <label htmlFor="name">
            부문명<span style={{ color: "red" }}>*</span>
          </label>
          <InputText
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="부문명"
          />
        </div>
        {/* 사용유무 */}
        <div className="form__input">
          <label htmlFor="useStatus">사용유무</label>
          <Dropdown
            id="useStatus"
            value={form.useStatus}
            options={USE_STATUS_OPTIONS}
            onChange={(e) => setForm({ ...form, useStatus: e.value })}
          />
        </div>
        {/* 사용시작 */}
        <div className="form__input">
          <label htmlFor="startDate">사용시작</label>
          <Calendar
            id="startDate"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.value })}
            locale="ko"
            showIcon
            dateFormat="yy-mm-dd"
          />
        </div>
        {/* 사용종료 + 없음 체크박스 */}
        <div className="form__input">
          <label htmlFor="endDate">사용종료</label>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Calendar
              id="endDate"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.value })}
              locale="ko"
              showIcon
              dateFormat="yy-mm-dd"
              disabled={form.noEndDate}
            />
            <Checkbox inputId="noEndDate" checked={form.noEndDate} onChange={handleNoEndDate} />
            <label htmlFor="noEndDate" style={{ marginLeft: 4 }}>
              없음
            </label>
          </div>
        </div>
        {/* 비고 */}
        <div className="form__input">
          <label htmlFor="note">비고</label>
          <InputText
            id="note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="비고"
          />
        </div>
      </div>
      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={onCloseFn}></Button>
        <Button label="저장" onClick={saveData}></Button>
      </div>
    </Dialog>
  );
};

export default DivisionForm7403;
