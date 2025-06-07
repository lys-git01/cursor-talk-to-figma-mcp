import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

const LaminateBillingForm7211 = ({ onCloseFn, state = "추가", vendor, billing }) => {
  const [form, setForm] = useState({
    code: vendor?.code ?? "",
    name: vendor?.name ?? "",
    weight: billing?.weight ?? "",
    basicBilling: billing?.basicBilling ?? "",
    extraBilling: billing?.extraBilling ?? "",
  });

  const handleSubmit = () => {
    // 필수값 체크 등 유효성 검사 추가 가능
    onCloseFn(form);
  };

  return (
    <Dialog header={`합지청구가 ${state}`} onHide={() => onCloseFn()} modal visible>
      <div className="Dialog-container form-list">
        <div className="form__input">
          <p>거래처 코드</p>
          <span>{form.code}</span>
        </div>
        <div className="form__input">
          <p>거래처명</p>
          <span>{form.name}</span>
        </div>
        <div className="form__input">
          <label htmlFor="weight">합지중량*</label>
          <InputNumber
            id="weight"
            value={form.weight}
            disabled={state === "수정"}
            onChange={(e) => setForm((prev) => ({ ...prev, weight: e.value }))}
          />
        </div>
        <div className="form__input">
          <label htmlFor="basicBilling">기본청구가</label>
          <InputNumber
            id="basicBilling"
            value={form.basicBilling}
            onChange={(e) => setForm((prev) => ({ ...prev, basicBilling: e.value }))}
          />
        </div>
        <div className="form__input">
          <label htmlFor="extraBilling">기타청구가</label>
          <InputNumber
            id="extraBilling"
            value={form.extraBilling}
            onChange={(e) => setForm((prev) => ({ ...prev, extraBilling: e.value }))}
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

export default LaminateBillingForm7211;
