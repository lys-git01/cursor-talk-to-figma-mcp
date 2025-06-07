/*  7.4.8.마감일등록의 수정, 추가 : A0045, BM-7408 */

import React, { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

const ClosingDateForm7408 = ({ onCloseFn, data, state }) => {
  const toast = useRef(null);

  const initialForm = {
    module: data?.module ?? "ALL",
    siteName: data?.siteName ?? "",
    code: data?.code ?? "",
    closeName: data?.closeName ?? "",
    date: data?.date ?? null,
    status: data?.status ?? 0,
    memo: data?.memo ?? "",
  };
  const [form, setForm] = useState(initialForm);

  const moduleOptions = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
  ];

  const statusOptions = [
    { label: "사용", value: "1" },
    { label: "미사용", value: "0" },
  ];

  const saveData = () => {
    if (!validateForm()) return;

    const formData = {
      ...form,
      closeDate: form.closeDate ? form.closeDate.toISOString().split("T")[0] : null,
    };

    console.log(formData);
    onCloseFn(formData);
  };

  const onChange = (field) => (e) => {
    const value = e.target ? e.target.value : e.value;

    const isCodeField = field === "code";
    const isValidCode = /^\d{0,2}$/.test(value);

    if (!isCodeField || isValidCode) {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const onDateChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.value }));
  };

  // 공통 입력 필드 렌더링 함수
  const validateForm = () => {
    const errorType = !form.code ? "코드" : !form.closeName ? "마감명" : "";

    if (errorType) {
      toast.current.show({
        severity: "error",
        summary: "오류",
        detail: `${errorType}을 입력해주세요.`,
      });
      return false;
    }

    return true;
  };

  // 렌더링 문제로 캘린더에 값을 못가지고 오는 문제 수정
  useEffect(() => {
    if (data.closeDate && typeof data.closeDate === "string") {
      const validDate = new Date(`${data.closeDate}T00:00:00`);
      if (!isNaN(validDate.getTime())) {
        setForm((prev) => ({
          ...prev,
          closeDate: validDate,
        }));
      }
    }
  }, [data.closeDate]);

  return (
    <Dialog
      header={`마감일 ${state}`}
      visible
      onHide={() => onCloseFn(null)}
      className="ClosingDateForm7408"
    >
      <Toast ref={toast} />
      <div className="Dialog-container form-list">
        <div className="form__input">
          <p>모듈</p>
          <InputText value={"A"} disabled />
        </div>
        <div className="form__input">
          <p>현장명</p>
          <InputText value={"(주)송운사"} disabled />
        </div>
        <div className="form__input">
          <p>코드*</p>
          <InputText
            value={form.code}
            onChange={onChange("code")}
            placeholder="코드"
            maxLength={2}
          />
        </div>
        <div className="form__input">
          <p>마감명*</p>
          <InputText value={form.closeName} onChange={onChange("closeName")} placeholder="마감명" />
        </div>
        <div className="form__input">
          <p>마감일</p>
          <Calendar
            locale="ko"
            value={form.closeDate}
            onChange={onDateChange("closeDate")}
            showIcon
            dateFormat="yy-mm-dd"
          />
        </div>
        <div className="form__input">
          <p className="text-red-500">사용여부</p>
          <Dropdown
            value={form.status}
            onChange={onChange("stutus")}
            options={statusOptions}
            placeholder="사용여부"
          />
        </div>
        <div className="form__input">
          <p>비고</p>
          <InputTextarea
            value={form.memo}
            // onChange={handleChange}
            name="비고"
            rows={5}
            placeholder="비고를 입력해주세요"
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

export default ClosingDateForm7408;
