import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

const ACCOUNT_TYPE_OPTIONS = [
  { label: "없음", value: "" },
  { label: "재무상태표", value: "재무상태표" },
  { label: "손익계산서", value: "손익계산서" },
];
const INPUT_TYPE_OPTIONS = [
  { label: "1. 입력불가", value: "입력불가" },
  { label: "2. 입력가능", value: "입력가능" },
];
const PROOF_REQUIRED_OPTIONS = [
  { label: "1. 차/대변 필수", value: "차/대변 필수" },
  { label: "2. 차/대변 선택", value: "차/대변 선택" },
  { label: "3. 차변 필수", value: "차변 필수" },
];
const BUDGET_CONTROL_OPTIONS = [
  { label: "0. 통제안함", value: "통제안함" },
  { label: "1. 월별통제", value: "월별통제" },
  { label: "2. 분기별통제", value: "분기별통제" },
  { label: "3. 반기별통제", value: "반기별통제" },
  { label: "4. 년간통제", value: "년간통제" },
  { label: "5. 입력가능", value: "입력가능" },
  { label: "6. 누적통제", value: "누적통제" },
];

const AccountTitleForm7406 = ({ onCloseFn, data = {} }) => {
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);
  const [form, setForm] = useState({
    code: data.code ?? "",
    groupCode: data.groupCode ?? "",
    accountType: data.accountType ?? "",
    relatedAccount: data.relatedAccount ?? "",
    inputType: data.inputType ?? "입력불가",
    proofRequired: data.proofRequired ?? "필수",
    linkedItem: data.linkedItem ?? "",
    cashflowItem: data.cashflowItem ?? "",
    budgetControl: data.budgetControl ?? "통제",
    subName: data.subName ?? "",
    output: data.output ?? "",
    outputSub: data.outputSub ?? "",
    ifrs: data.ifrs ?? "",
    ifrsSub: data.ifrsSub ?? "",
    name: data.name ?? "",
    order: data.order ?? "",
  });

  // 연동항목 검색
  const handleLinkedItemSearch = () => {
    openDialog("DGCommonCode1", {
      onClose: (item) => {
        if (item) setForm((prev) => ({ ...prev, linkedItem: item.name }));
      },
      state: "sd",
    });
  };
  // 현금흐름표과목 검색
  const handleCashflowItemSearch = () => {
    openDialog("DGCommonCode1", {
      onClose: (item) => {
        if (item) setForm((prev) => ({ ...prev, cashflowItem: item.name }));
      },
      state: "cf",
    });
  };
  // 저장
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
    <Dialog header="계정과목 수정" visible onHide={onCloseFn}>
      <div className="Dialog-container form-list">
        <div className="form__input">
          <label>계정과목</label>
          <InputText value={form.code} disabled />
        </div>
        <div className="form__input">
          <label>그룹코드</label>
          <InputText value={form.groupCode} disabled />
        </div>
        <div className="form__input">
          <label>계정구분</label>
          <Dropdown
            value={form.accountType}
            options={ACCOUNT_TYPE_OPTIONS}
            onChange={(e) => setForm({ ...form, accountType: e.value })}
          />
        </div>
        <div className="form__input">
          <label>관련계정</label>
          <InputText value={form.relatedAccount} disabled />
        </div>
        <div className="form__input">
          <label>입력구분</label>
          <Dropdown
            value={form.inputType}
            options={INPUT_TYPE_OPTIONS}
            onChange={(e) => setForm({ ...form, inputType: e.value })}
          />
        </div>
        <div className="form__input">
          <label>증빙필수 입력여부</label>
          <Dropdown
            value={form.proofRequired}
            options={PROOF_REQUIRED_OPTIONS}
            onChange={(e) => setForm({ ...form, proofRequired: e.value })}
          />
        </div>
        <div className="form__input">
          <label>연동항목</label>
          <InputText value={form.linkedItem} readOnly />
          <Button label="연동항목 검색" onClick={handleLinkedItemSearch} />
        </div>
        <div className="form__input">
          <label>현금흐름표과목</label>
          <InputText value={form.cashflowItem} readOnly />
          <Button label="현금흐름표과목 검색" onClick={handleCashflowItemSearch} />
        </div>
        <div className="form__input">
          <label>예산통제</label>
          <Dropdown
            value={form.budgetControl}
            options={BUDGET_CONTROL_OPTIONS}
            onChange={(e) => setForm({ ...form, budgetControl: e.value })}
          />
        </div>
        <div className="form__input">
          <label>과목명(부)</label>
          <InputText
            value={form.subName}
            onChange={(e) => setForm({ ...form, subName: e.target.value })}
          />
        </div>
        <div className="form__input">
          <label>출력</label>
          <InputText
            value={form.output}
            onChange={(e) => setForm({ ...form, output: e.target.value })}
          />
        </div>
        <div className="form__input">
          <label>출력(부)</label>
          <InputText
            value={form.outputSub}
            onChange={(e) => setForm({ ...form, outputSub: e.target.value })}
          />
        </div>
        <div className="form__input">
          <label>IFRS</label>
          <InputText
            value={form.ifrs}
            onChange={(e) => setForm({ ...form, ifrs: e.target.value })}
          />
        </div>
        <div className="form__input">
          <label>IFRS(부)</label>
          <InputText
            value={form.ifrsSub}
            onChange={(e) => setForm({ ...form, ifrsSub: e.target.value })}
          />
        </div>
        <div className="form__input">
          <label>
            계정과목명<span style={{ color: "red" }}>*</span>
          </label>
          <InputText
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="form__input">
          <label>
            정렬순서<span style={{ color: "red" }}>*</span>
          </label>
          <InputText
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
            keyfilter="int"
            maxLength={5}
          />
        </div>
      </div>
      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={onCloseFn} />
        <Button label="저장" onClick={handleSave} />
      </div>
    </Dialog>
  );
};

export default AccountTitleForm7406;
