import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

const CostEntryPageForm7103 = ({ onCloseFn, type = "hapji", state = "추가", data = {} }) => {
  // state: '추가' | '수정'
  const [form, setForm] = useState({
    code: data?.code ?? "",
    name: data?.name ?? "",
    // hapji
    weight: data?.weight ?? "",
    originPrice: data?.originPrice ?? "",
    normalPrice: data?.normalPrice ?? "",
    // gagongbi
    garo: data?.garo ?? "",
    sero: data?.sero ?? "",
    inPrint: data?.inPrint ?? "",
    etc: data?.etc ?? "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target ? e.target.value : e.value }));
  };

  const handleSubmit = () => {
    // 유효성 검사 등 추가 가능
    onCloseFn(form);
  };

  return (
    <Dialog
      header={`${type === "hapji" ? "합지 단가표" : "가공비 단가표"} ${state}`}
      visible
      modal
      onHide={() => onCloseFn()}
      className="CostEntryPageForm7103"
    >
      <div className="Dialog-container form-list">
        {/* 코드, 거래처명: 읽기전용 */}
        <div className="form__input">
          <label>코드</label>
          <span>{form.code}</span>
        </div>
        <div className="form__input">
          <label>거래처명</label>
          <span>{form.name}</span>
        </div>
        {type === "hapji" ? (
          <>
            <div className="form__input">
              <label htmlFor="weight">평량(g)*</label>
              <InputNumber
                id="weight"
                value={form.weight}
                onValueChange={handleChange("weight")}
                placeholder="평량(g)"
              />
            </div>
            <div className="form__input">
              <label htmlFor="originPrice">원방합지단가*</label>
              <InputNumber
                id="originPrice"
                value={form.originPrice}
                onValueChange={handleChange("originPrice")}
                placeholder="원방합지단가"
              />
            </div>
            <div className="form__input">
              <label htmlFor="normalPrice">일반합지단가*</label>
              <InputNumber
                id="normalPrice"
                value={form.normalPrice}
                onValueChange={handleChange("normalPrice")}
                placeholder="일반합지단가"
              />
            </div>
          </>
        ) : (
          <>
            <div className="form__input">
              <label htmlFor="garo">가로*</label>
              <InputNumber
                id="garo"
                value={form.garo}
                onValueChange={handleChange("garo")}
                placeholder="가로"
              />
            </div>
            <div className="form__input">
              <label htmlFor="sero">세로*</label>
              <InputNumber
                id="sero"
                value={form.sero}
                onValueChange={handleChange("sero")}
                placeholder="세로"
              />
            </div>
            <div className="form__input">
              <label htmlFor="inPrint">인쇄지단가*</label>
              <InputNumber
                id="inPrint"
                value={form.inPrint}
                onValueChange={handleChange("inPrint")}
                placeholder="인쇄지단가"
              />
            </div>
            <div className="form__input">
              <label htmlFor="etc">기타단가*</label>
              <InputNumber
                id="etc"
                value={form.etc}
                onValueChange={handleChange("etc")}
                placeholder="기타단가"
              />
            </div>
          </>
        )}
        <div className="Dialog__btns">
          <Button label="취소" severity="secondary" onClick={() => onCloseFn()} />
          <Button label="저장" onClick={handleSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default CostEntryPageForm7103;
