import useToastStore from "@/store/toastStore";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

// TODO 백엔드 데이터 확인 후 추가
const USE_STATUS_OPTIONS = [
  { label: "사용", value: true },
  { label: "미사용", value: false },
];

const CommonCodeForm7204 = ({ onCloseFn, state = "추가", data }) => {
  console.log(data);
  const showToast = useToastStore.getState().showToast;
  const [form, setForm] = useState({
    commonCode: data?.commonCode ?? "",
    code: data?.code ?? "",
    display1: data?.display1 ?? "",
    display2: data?.display2 ?? "",
    remark: data?.remark ?? "",
    order: data?.order ?? "",
    useYn: data?.useYn ? (data.useYn == "사용" ? true : false) : true,
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

  return (
    <Dialog header={`공통코드 ${state}`} visible onHide={onCloseFn}>
      <div className="Dialog-container form-list">
        {/* 공통코드: 수정일 때만 텍스트로, 추가일 때만 입력란 */}
        {state === "수정" && (
          <>
            <div className="form__input">
              <p>구분코드</p>
              <span>{form.commonCode}</span>
            </div>
            <div className="form__input">
              <p>코드</p>
              <span>{form.code}</span>
            </div>
          </>
        )}
        {/* 표시명1 */}
        <div className="form__input">
          <label htmlFor="display1">표시명1</label>
          <InputText
            id="display1"
            value={form.display1}
            onChange={(e) => setForm({ ...form, display1: e.target.value })}
            placeholder="표시명1"
          />
        </div>
        {/* 표시명2 */}
        <div className="form__input">
          <label htmlFor="display2">표시명2</label>
          <InputText
            id="display2"
            value={form.display2}
            onChange={(e) => setForm({ ...form, display2: e.target.value })}
            placeholder="표시명2"
          />
        </div>
        {/* 비고 */}
        <div className="form__input">
          <label htmlFor="remark">비고</label>
          <InputText
            id="remark"
            value={form.remark}
            onChange={(e) => setForm({ ...form, remark: e.target.value })}
            placeholder="비고"
          />
        </div>
        {/* 표시순번 */}
        <div className="form__input">
          <label htmlFor="order">표시순번</label>
          <InputText
            id="order"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
            placeholder="0"
            keyfilter="int"
            maxLength={4}
          />
        </div>
        {/* 사용여부 */}
        <div className="form__input">
          <label htmlFor="useYn">사용여부</label>
          <Dropdown
            id="useYn"
            value={form.useYn}
            options={USE_STATUS_OPTIONS}
            onChange={(e) => setForm({ ...form, useYn: e.value })}
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

export default CommonCodeForm7204;
