import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import useDialogStore from "@/store/dialogStore";

const USE_STATUS_OPTIONS = [
  { label: "사용", value: true },
  { label: "미사용", value: false },
];

const DeptForm7403 = ({ onCloseFn, state = "추가", data = {} }) => {
  const openDialog = useDialogStore((s) => s.openDialog);
  const [form, setForm] = useState({
    company: data.company ?? { code: "", name: "" },
    division: data.division ?? { code: "", name: "" },
    code: data.code ?? "",
    useStatus: data.useStatus ?? true,
    name: data.name ?? "",
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    noEndDate: data.noEndDate ?? false,
    note: data.note ?? "",
  });

  // 사업장코드  검색
  const handleCompanySearch = () => {
    openDialog("DGCommonCode1", {
      onClose: (item) => {
        if (item) setForm((prev) => ({ ...prev, company: { code: item.code, name: item.name } }));
      },
      state: "div",
    });
  };
  // 부문 검색
  const handleDivisionSearch = () => {
    openDialog("DGCommonCode1", {
      onClose: (item) => {
        if (item) setForm((prev) => ({ ...prev, division: { code: item.code, name: item.name } }));
      },
      state: "sect",
    });
  };
  // 사용종료 없음 체크박스
  const handleNoEndDate = (e) => {
    setForm((prev) => ({
      ...prev,
      noEndDate: e.checked,
      endDate: e.checked ? null : prev.endDate,
    }));
  };
  // 저장
  const handleSave = () => {
    // 저장 로직 필요시 추가
    onCloseFn(form);
  };

  return (
    <Dialog header={`부서 ${state}`} visible onHide={() => onCloseFn(null)}>
      <div className="Dialog-container form-list">
        {/* 사업장 */}
        <div className="form__input">
          <label>사업장</label>
          <InputText
            value={form.company.code ? `${form.company.code} ${form.company.name}` : ""}
            readOnly
            style={{ flex: 1 }}
            placeholder="사업장코드 사업장명"
          />
          <Button label="사업장 검색" onClick={handleCompanySearch} />
        </div>
        {/* 부문 */}
        <div className="form__input">
          <label>부문</label>
          <InputText
            value={form.division.code ? `${form.division.code} ${form.division.name}` : ""}
            readOnly
            style={{ flex: 1 }}
            placeholder="부문코드 부문명"
          />
          <Button label="부문 검색" onClick={handleDivisionSearch} />
        </div>
        {/* 부서코드 */}
        <div className="form__input">
          <label htmlFor="code">
            부서코드<span style={{ color: "red" }}>*</span>
          </label>
          <InputText
            id="code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            placeholder="부서코드"
            disabled={state !== "추가"}
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
        {/* 부서명 */}
        <div className="form__input">
          <label htmlFor="name">
            부서명<span style={{ color: "red" }}>*</span>
          </label>
          <InputText
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="부서명"
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
        <Button label="취소" severity="secondary" onClick={() => onCloseFn(null)} />
        <Button label="저장" onClick={handleSave} />
      </div>
    </Dialog>
  );
};

export default DeptForm7403;
