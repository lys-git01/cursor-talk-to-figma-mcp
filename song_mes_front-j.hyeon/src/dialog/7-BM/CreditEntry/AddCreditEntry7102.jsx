import useToastStore from "@/store/toastStore";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Tooltip } from "primereact/tooltip";
import React, { useState } from "react";

const AddCreditEntry7102 = ({ onCloseFn, company, state, data }) => {
  const showToast = useToastStore.getState().showToast;
  const today = new Date();

  // TODO 임시 데이터 처리라서 데이터가 어떻게 들어오냐에 따라 수정 필요!!
  const getValue = (label) => {
    const flat = data?.flat() || [];
    return flat.find((item) => item.label === label)?.value;
  };

  const parseDate = (val) => {
    try {
      return val ? new Date(val) : null;
    } catch {
      return null;
    }
  };
  const parseGrace = (val) => {
    if (!val) return 0;
    const num = parseInt(val.toString().replace(/[^0-9]/g, ""), 10);
    return isNaN(num) ? 0 : num;
  };
  const hasDate = (label) => {
    const val = getValue(label);
    return !!val;
  };
  // dropdown options
  const changeOptions = [
    { label: "등급조정", value: "1" },
    { label: "기한상실", value: "2" },
    { label: "일자조정", value: "3" },
    { label: "유형변경", value: "Y" },
    { label: "관리안함", value: "Z" },
  ];

  const gradeOptions = [
    { label: "정상", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
  ];
  const initialForm = {
    changeDate: parseDate(getValue("변경일")) || today,
    changeType: changeOptions.find((o) => o.label === getValue("변경유형"))?.value || null,
    changeReason: getValue("변경사유") || "",
    clientGrade: gradeOptions.find((o) => o.label === getValue("거래처등급"))?.value || null,
    paymentDate: parseDate(getValue("결제일")) || null,
    paymentGracePeriod: parseGrace(getValue("결제유예일")),
    creditCalcStartDate: parseDate(getValue("여신계산시작일")) || null,
    collectionAgingStartDate: parseDate(getValue("수금 에이징 시작일")) || null,
    noCreditCalcStart: !hasDate("여신계산시작일"),
    noCollectionAgingStart: !hasDate("수금 에이징 시작일"),
  };

  const [form, setForm] = useState(initialForm);
  // TODO 임시 데이터 처리라서 데이터가 어떻게 들어오냐에 따라 수정 필요!!

  const saveData = () => {
    console.log("저장할 데이터:", form);
    showToast({
      severity: "info",
      summary: "저장",
      detail: "저장이 완료되었습니다.",
    });
    onCloseFn(form);
  };

  const onDateChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.value }));
  };

  const onChange = (field) => (e) => {
    const value = e.target ? e.target.value : e.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onNumberChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.value }));
  };

  const onCheckboxToggle = (field) => (e) => {
    const checked = e.checked;
    setForm((prev) => ({ ...prev, [field]: checked }));
    if (checked) {
      const dateField =
        field === "noCreditCalcStart" ? "creditCalcStartDate" : "collectionAgingStartDate";
      setForm((prev) => ({ ...prev, [dateField]: null }));
    }
  };

  return (
    <Dialog
      header={`여신내역 ${state}`}
      visible
      onHide={() => onCloseFn(null)}
      className="AddCreditEntry7102"
    >
      <div className="Dialog-container form-list">
        <div className="form__input">
          <p>변경일*</p>
          <Calendar
            locale="ko"
            value={form.changeDate}
            onChange={onDateChange("changeDate")}
            showIcon
            dateFormat="yy-mm-dd"
          />
        </div>
        <div className="form__input">
          <p>
            변경유형*
            <Tooltip target=".tooltip-icon-01" />
            <i
              className="pi pi-info-circle tooltip-icon-01 ml-1"
              data-pr-tooltip="변경유형이 '일자조정'일 경우만 결제일, 결제유예일, 여신계산시작일, 수금에이징시작일을 수정할 수 있습니다. '등급조정'은 특수권한이 필요합니다."
              data-pr-position="right"
              data-pr-at="right+5 top"
              data-pr-my="left center-2"
            ></i>
          </p>
          <Dropdown
            value={form.changeType}
            onChange={onChange("changeType")}
            options={changeOptions}
            placeholder="변경유형 선택"
          />
        </div>
        <div className="form__input">
          <p>변경사유</p>
          <InputText value={form.changeReason} onChange={onChange("changeReason")} />
        </div>
        <div className="form__input">
          <p>거래처등급*</p>
          <Dropdown
            value={form.clientGrade}
            onChange={onChange("clientGrade")}
            options={gradeOptions}
            placeholder="등급 선택"
          />
        </div>
        <div className="column2">
          <div className="form__input">
            <p>
              결제일
              <Tooltip target=".tooltip-icon-02" />
              <i
                className="pi pi-info-circle tooltip-icon-02 ml-1"
                data-pr-tooltip="계산서 발행일"
              ></i>
            </p>
            <Calendar
              locale="ko"
              value={form.paymentDate}
              onChange={onDateChange("paymentDate")}
              showIcon
              dateFormat="yy-mm-dd"
            />
          </div>
          <div className="form__input">
            <p>여신 계산 시작일</p>
            <Calendar
              locale="ko"
              value={form.creditCalcStartDate}
              onChange={onDateChange("creditCalcStartDate")}
              showIcon
              dateFormat="yy-mm-dd"
              disabled={form.noCreditCalcStart}
            />
            <Divider layout="vertical" className="mr-1 ml-1" />
            <div className="flex items-center">
              <Checkbox
                inputId="noCreditCalc"
                checked={form.noCreditCalcStart}
                onChange={onCheckboxToggle("noCreditCalcStart")}
              />
              <label htmlFor="noCreditCalc" className="ml-2">
                없음
              </label>
            </div>
          </div>
        </div>
        <div className="column2">
          <div className="form__input">
            <p>결제유예일</p>
            <InputNumber
              value={form.paymentGracePeriod}
              onValueChange={onNumberChange("paymentGracePeriod")}
              mode="decimal"
            />
            일
          </div>
          <div className="form__input">
            <p>수금 에이징 시작일</p>
            <Calendar
              locale="ko"
              value={form.collectionAgingStartDate}
              onChange={onDateChange("collectionAgingStartDate")}
              showIcon
              dateFormat="yy-mm-dd"
              disabled={form.noCollectionAgingStart}
            />
            <Divider layout="vertical" className="mr-1 ml-1" />
            <div className="flex items-center">
              <Checkbox
                inputId="noAgingCalc"
                checked={form.noCollectionAgingStart}
                onChange={onCheckboxToggle("noCollectionAgingStart")}
              />
              <label htmlFor="noAgingCalc" className="ml-2">
                없음
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="Dialog__btns mt-4 flex justify-end space-x-2">
        <Button label="취소" severity="secondary" onClick={() => onCloseFn(null)} />
        <Button label="저장" onClick={saveData} />
      </div>
    </Dialog>
  );
};

export default AddCreditEntry7102;
