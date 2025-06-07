import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

const TYPES = [
  { label: "자재청구", value: "자재청구" },
  { label: "공정청구(기본)", value: "공정청구(기본)" },
  { label: "공정청구(확장)", value: "공정청구(확장)" },
];

// TODO 백엔드 데이터 확인 후 추가
const ORDER_UNITS = [
  { label: "개", value: "개" },
  { label: "롤", value: "롤" },
  { label: "장", value: "장" },
  // 필요시 추가
];
const DETAIL_UNIT_OPTIONS = [
  { label: "사용", value: true },
  { label: "미사용", value: false },
];
const USE_STATUS_OPTIONS = [
  { label: "사용", value: true },
  { label: "미사용", value: false },
];

const BillingCodeForm7203 = ({ onCloseFn, state = "추가", data = {} }) => {
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);
  const [form, setForm] = useState({
    code: data.code ?? "",
    type: data.type ?? "자재청구",
    name: data.name ?? "",
    displayOrder: data.displayOrder ?? "",
    useStatus: data.useStatus ?? true,
    processCode: data.processCode ?? { code: "", name: "" },
    orderUnit: data.orderUnit ?? "개",
    isDetailUnit: data.isDetailUnit ?? false,
  });

  // 저장
  const saveData = () => {
    onCloseFn();
    showToast({
      severity: "success",
      summary: "저장 완료",
      detail: "저장되었습니다.",
      life: 3000,
    });
  };

  // 공정코드 검색
  const handleProcessCodeSearch = () => {
    openDialog("DGProcessCode", {
      onClose: (value) => {
        if (value)
          setForm((prev) => ({
            ...prev,
            processCode: { code: value.process.code, name: value.process.name },
          }));
      },
    });
  };

  return (
    <Dialog header={`청구코드 ${state}`} visible onHide={onCloseFn}>
      <div className="Dialog-container form-list">
        {/* 청구코드: 수정일 때만 텍스트로, 추가일 때만 입력란 */}
        {state === "수정" && (
          <div className="form__input">
            <p>청구코드</p>
            <span>{form.code}</span>
          </div>
        )}
        {/* 구분 */}
        <div className="form__input">
          <label htmlFor="type">구분</label>
          <Dropdown
            id="type"
            value={form.type}
            options={TYPES}
            onChange={(e) => setForm({ ...form, type: e.value })}
            placeholder="구분 선택"
          />
        </div>
        {/* 청구명 */}
        <div className="form__input">
          <label htmlFor="name">청구명</label>
          <InputText
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="청구명"
          />
        </div>
        {/* 표시순번 */}
        <div className="form__input">
          <label htmlFor="displayOrder">표시순번</label>
          <InputText
            id="displayOrder"
            value={form.displayOrder}
            onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
            placeholder="0"
            keyfilter="int"
            maxLength={4}
          />
        </div>
        {/* 사용여부 */}
        <div className="form__input">
          <label htmlFor="useStatus">사용여부</label>
          <Dropdown
            id="useStatus"
            value={form.useStatus}
            options={USE_STATUS_OPTIONS}
            onChange={(e) => setForm({ ...form, useStatus: e.value })}
          />
        </div>
        <Divider align="left">
          <b>자동 수주서 등록으로 전송할 경우를 대비</b>
        </Divider>
        {/* 공정코드 + 검색 */}
        <div className="form__input">
          <label htmlFor="processCode">공정코드</label>
          <div className="p-inputgroup">
            <InputText
              id="processCode"
              value={form.processCode.name + " " + form.processCode.code}
              readOnly
              placeholder="공정코드"
            />
            <Button label="공정코드 검색" onClick={handleProcessCodeSearch} />
          </div>
        </div>
        {/* 수주서 작성시 단위 */}
        <div className="form__input">
          <label htmlFor="orderUnit">수주서 작성시 단위</label>
          <Dropdown
            id="orderUnit"
            value={form.orderUnit}
            options={ORDER_UNITS}
            onChange={(e) => setForm({ ...form, orderUnit: e.value })}
          />
        </div>
        {/* 수주서 작성시 세부 단위 유무 */}
        <div className="form__input">
          <label htmlFor="isDetailUnit">수주서 작성시 세부 단위 유무</label>
          <Dropdown
            id="isDetailUnit"
            value={form.isDetailUnit}
            options={DETAIL_UNIT_OPTIONS}
            onChange={(e) => setForm({ ...form, isDetailUnit: e.value })}
          />
        </div>
        <div className="note">* 예) 인쇄청구시 &quot;수량&quot;, &quot;도일&quot; 경우 체크</div>
      </div>
      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={onCloseFn}></Button>
        <Button label="저장" onClick={saveData}></Button>
      </div>
    </Dialog>
  );
};

export default BillingCodeForm7203;
