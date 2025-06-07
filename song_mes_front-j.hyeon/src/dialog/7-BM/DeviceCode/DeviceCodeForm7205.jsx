import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import useDialogStore from "@/store/dialogStore";

const screenOptions = [
  { label: "표시", value: "표시" },
  { label: "미표시", value: "미표시" },
];
const statusOptions = [
  { label: "정상", value: "정상" },
  { label: "고장", value: "고장" },
];
const processCheckOptions = [
  { label: "체크", value: "체크" },
  { label: "미체크", value: "미체크" },
];
const useYnOptions = [
  { label: "사용", value: "사용" },
  { label: "미사용", value: "미사용" },
];
const manualCalcOptions = [
  { label: "사용", value: "사용" },
  { label: "미사용", value: "미사용" },
];

const DeviceCodeForm7205 = ({ onCloseFn, state = "추가", data }) => {
  const openDialog = useDialogStore((s) => s.openDialog);
  const [form, setForm] = useState({
    code: data?.code ?? "",
    name: data?.name ?? "",
    processCode: data?.processCode ?? { code: "", name: "" },
    order: data?.order ?? 1000,
    screen: data?.screen ?? "표시",
    status: data?.status ?? "정상",
    processCheck: data?.processCheck ?? "체크",
    useYn: data?.useYn ?? "사용",
    manualCalc: data?.manualCalc ?? "사용",
    workScore: data?.workScore ?? "",
    speed: data?.speed ?? "",
    lossTime: data?.lossTime ?? "",
  });

  const handleSubmit = () => {
    // 필수값 체크 등 유효성 검사 추가 가능
    onCloseFn(form);
  };
  const handleProcessCodeSearch = () => {
    openDialog("DGItemCodeList", {
      type: "공정코드",
      onClose: (value) => {
        setForm((prev) => ({ ...prev, processCode: value }));
      },
    });
  };

  return (
    <Dialog header={`기기코드 ${state}`} onHide={() => onCloseFn()} modal visible>
      <div className="Dialog-container form-list">
        {state === "수정" && (
          <div className="form__input">
            <p>코드</p>
            <span>{form.code}</span>
          </div>
        )}
        <div className="form__input">
          <label htmlFor="name">기기명*</label>
          <InputText
            id="name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div className="form__input">
          <label htmlFor="processCode">공정코드*</label>
          <div className="p-inputgroup">
            <InputText id="processCode" value={form.processCode.name} disabled />
            <Button label="통합기기 검색" onClick={handleProcessCodeSearch} />
          </div>
        </div>
        <div className="form__input">
          <label htmlFor="order">표시순번*</label>
          <InputText
            id="order"
            value={form.order}
            onChange={(e) => setForm((prev) => ({ ...prev, order: e.target.value }))}
            maxLength={5}
            placeholder="숫자 최대 5자리"
            keyfilter="int"
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
          <label htmlFor="status">기계상태</label>
          <Dropdown
            id="status"
            value={form.status}
            options={statusOptions}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.value }))}
          />
        </div>
        <div className="form__input">
          <label htmlFor="processCheck">공정체크</label>
          <Dropdown
            id="processCheck"
            value={form.processCheck}
            options={processCheckOptions}
            onChange={(e) => setForm((prev) => ({ ...prev, processCheck: e.value }))}
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
        <div className="form__input">
          <label htmlFor="manualCalc">
            수작업 계산
            <Tooltip target=".tooltip-icon-01" />
            <i
              className="pi pi-info-circle tooltip-icon-01 ml-1"
              data-pr-tooltip="단가를 수작업으로 계산 여부"
              data-pr-position="right"
              data-pr-at="right+5 top+5"
              data-pr-my="left center-2"
            ></i>
          </label>
          <Dropdown
            id="manualCalc"
            value={form.manualCalc}
            options={manualCalcOptions}
            onChange={(e) => setForm((prev) => ({ ...prev, manualCalc: e.value }))}
          />
        </div>
        <div className="form__input">
          <label htmlFor="workScore">작업점수</label>
          <InputText
            id="workScore"
            value={form.workScore}
            onChange={(e) => setForm((prev) => ({ ...prev, workScore: e.target.value }))}
            keyfilter="int"
          />
        </div>
        <div className="form__input">
          <label htmlFor="speed">스피드</label>
          <InputText
            id="speed"
            value={form.speed}
            onChange={(e) => setForm((prev) => ({ ...prev, speed: e.target.value }))}
            keyfilter="int"
          />
        </div>
        <div className="form__input">
          <label htmlFor="lossTime">로스타임</label>
          <InputText
            id="lossTime"
            value={form.lossTime}
            onChange={(e) => setForm((prev) => ({ ...prev, lossTime: e.target.value }))}
            keyfilter="int"
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

export default DeviceCodeForm7205;
