/*  7.4.8.마감일등록의 수정, 추가 : A0045, BM-7408 */

import React, { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

const USE_STATUS_OPTIONS = [
  { label: "사용", value: "사용" },
  { label: "미사용", value: "미사용" },
];

const MaterialGroupForm7304 = ({ onCloseFn, data, state = "추가" }) => {
  const toast = useRef(null);
  const [form, setForm] = useState({
    code: data?.code ?? "",
    그룹명: data?.그룹명 ?? "",
    그룹용도: data?.그룹용도 ?? "",
    사용여부: data?.사용여부 ?? "사용",
    비고: data?.비고 ?? "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        code: data.code ?? "",
        그룹명: data.그룹명 ?? "",
        그룹용도: data.그룹용도 ?? "",
        사용여부: data.사용여부 ?? "사용",
        비고: data.비고 ?? "",
      });
    }
  }, [data]);

  const onChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target ? e.target.value : e.value }));
  };

  const validateForm = () => {
    if (!form.그룹명) {
      toast.current.show({
        severity: "error",
        summary: "오류",
        detail: "그룹명을 입력해주세요.",
      });
      return false;
    }
    return true;
  };

  const saveData = () => {
    if (!validateForm()) return;
    onCloseFn(form);
  };

  return (
    <Dialog
      header={`자재그룹 ${state}`}
      visible
      onHide={() => onCloseFn(null)}
      className="MaterialGroupForm7304"
    >
      <Toast ref={toast} />
      <div className="Dialog-container form-list">
        {/* 그룹코드: 수정일 때만 표시, 읽기전용 */}
        {state === "수정" && (
          <div className="form__input">
            <label htmlFor="code">그룹코드</label>
            <InputText id="code" value={form.code} readOnly disabled />
          </div>
        )}
        {/* 그룹명 */}
        <div className="form__input">
          <label htmlFor="groupName">그룹명</label>
          <InputText
            id="groupName"
            value={form.그룹명}
            onChange={onChange("그룹명")}
            placeholder="그룹명"
          />
        </div>
        {/* 그룹용도 */}
        <div className="form__input">
          <label htmlFor="groupPurpose">그룹용도</label>
          <InputText
            id="groupPurpose"
            value={form.그룹용도}
            onChange={onChange("그룹용도")}
            placeholder="그룹용도"
          />
        </div>
        {/* 사용여부 */}
        <div className="form__input">
          <label htmlFor="useYn">사용여부*</label>
          <Dropdown
            id="useYn"
            value={form.사용여부}
            options={USE_STATUS_OPTIONS}
            onChange={onChange("사용여부")}
            placeholder="사용여부 선택"
          />
        </div>
        {/* 비고 */}
        <div className="form__input">
          <label htmlFor="remark">비고</label>
          <InputText id="remark" value={form.비고} onChange={onChange("비고")} placeholder="비고" />
        </div>
      </div>
      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={() => onCloseFn(null)} />
        <Button label="저장" onClick={saveData} />
      </div>
    </Dialog>
  );
};

export default MaterialGroupForm7304;
