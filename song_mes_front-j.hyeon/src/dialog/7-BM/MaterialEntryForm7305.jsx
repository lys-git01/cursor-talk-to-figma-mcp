import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { Combo_Comm_Setting } from "@/utils/comboSetting";
import useDialogStore from "@/store/dialogStore";

const MaterialEntryForm7305 = ({ onCloseFn, state = "추가", data = {} }) => {
  const toast = useRef(null);
  const { openDialog } = useDialogStore();
  const [form, setForm] = useState({
    materialNo: data?.materialNo ?? "",
    useStatus: "1",
    stockManage: data?.stockManage ?? "1",
    account: data?.account ?? "원재료",
    procurement: data?.procurement ?? "0",
    materialGroup: data?.materialGroup ?? "",
    materialGroupName: data?.materialGroupName ?? "",
    specification: data?.specification ?? "",
    unit: data?.unit ?? "매",
    remark: data?.remark ?? "",
    usedMaterial: data?.usedMaterial ?? "",
    shapeCode: data?.shapeCode ?? "",
    price: data?.price ?? "",
    materialName: data?.materialName ?? "",
    currentStock: data?.currentStock ?? "",
  });

  const accountOptions = [
    { label: "원재료", value: "원재료" },
    { label: "부재료", value: "부재료" },
    { label: "소모품", value: "소모품" },
  ];
  const unitOptions = [
    { label: "매", value: "매" },
    { label: "kg", value: "kg" },
    { label: "롤", value: "롤" },
    { label: "박스", value: "박스" },
    { label: "장", value: "장" },
  ];

  // 자재그룹 검색 버튼 클릭
  const handleMaterialGroupSearch = () => {
    openDialog("DGCommonCode1", {
      onClose: (item) => {
        console.log(item);
        setForm((prev) => ({ ...prev, materialGroup: item.code, materialGroupName: item.name }));
      },
      state: "itemgrp",
    });
  };

  const onChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target ? e.target.value : e.value }));
  };

  const validateForm = () => {
    if (!form.materialNo) {
      toast.current.show({
        severity: "error",
        summary: "오류",
        detail: "자재번호를 입력해주세요.",
      });
      return false;
    }
    // 추가 필수값 체크 가능
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onCloseFn(form);
  };

  return (
    <Dialog
      header={`자재 ${state}`}
      visible
      onHide={() => onCloseFn(null)}
      className="MaterialEntryForm7305"
    >
      <Toast ref={toast} />
      <div className="Dialog-container form-list">
        {/* 자재번호 */}
        <div className="form__input">
          <label htmlFor="materialNo">자재번호*</label>
          <InputText
            id="materialNo"
            value={form.materialNo}
            onChange={onChange("materialNo")}
            maxLength={16}
            placeholder="16자리 숫자"
          />
        </div>
        {/* 사용여부 */}
        <div className="form__input">
          <label htmlFor="useStatus">사용여부</label>
          <Dropdown
            id="useStatus"
            value={form.useStatus}
            options={Combo_Comm_Setting(0, 1)}
            onChange={onChange("useStatus")}
            optionLabel="label"
            optionValue="value"
          />
        </div>
        {/* 재고관리 */}
        <div className="form__input">
          <label htmlFor="stockManage">재고 관리</label>
          <Dropdown
            id="stockManage"
            value={form.stockManage}
            options={Combo_Comm_Setting(7)}
            onChange={onChange("stockManage")}
          />
        </div>
        {/* 계정구분 */}
        <div className="form__input">
          <label htmlFor="account">계정 구분</label>
          <Dropdown
            id="account"
            value={form.account}
            options={accountOptions}
            onChange={onChange("account")}
          />
        </div>
        {/* 조달구분 */}
        <div className="form__input">
          <label htmlFor="procurement">조달 구분</label>
          <Dropdown
            id="procurement"
            value={form.procurement}
            options={Combo_Comm_Setting(8)}
            onChange={onChange("procurement")}
          />
        </div>
        {/* 자재그룹 */}
        <div className="form__input">
          <label htmlFor="materialGroup">자재 그룹</label>
          <div style={{ display: "flex", gap: 8 }}>
            <InputText
              id="materialGroup"
              value={`${form.materialGroup} - ${form.materialGroupName}`}
              onChange={onChange("materialGroup")}
              style={{ flex: 1 }}
              placeholder="코드 자재명"
            />
            <Button label="자재그룹 검색" onClick={handleMaterialGroupSearch} />
          </div>
        </div>
        {/* 자재명 */}
        <div className="form__input">
          <label htmlFor="materialName">자재명</label>
          <InputText
            id="materialName"
            value={form.materialName}
            onChange={onChange("materialName")}
            placeholder="자재명"
          />
        </div>
        {/* 규격 */}
        <div className="form__input">
          <label htmlFor="specification">규격</label>
          <InputText
            id="specification"
            value={form.specification}
            onChange={onChange("specification")}
            placeholder="규격"
          />
        </div>
        {/* 단위 */}
        <div className="form__input">
          <label htmlFor="unit">단위</label>
          <Dropdown id="unit" value={form.unit} options={unitOptions} onChange={onChange("unit")} />
        </div>
        {/* 비고 */}
        <div className="form__input">
          <label htmlFor="remark">비고</label>
          <InputText
            id="remark"
            value={form.remark}
            onChange={onChange("remark")}
            placeholder="비고"
          />
        </div>
        {/* 사용중자재 */}
        <div className="form__input">
          <label htmlFor="usedMaterial">사용중자재</label>
          <InputText
            id="usedMaterial"
            value={form.usedMaterial}
            onChange={onChange("usedMaterial")}
            placeholder="사용중자재"
          />
        </div>
        {/* 현재고 */}
        <div className="form__input">
          <label htmlFor="currentStock">현재고</label>
          <InputText
            id="currentStock"
            value={form.currentStock}
            onChange={onChange("currentStock")}
            placeholder="현재고"
          />
        </div>
        {/* 단가 */}
        <div className="form__input">
          <label htmlFor="price">단가</label>
          <InputNumber
            id="price"
            value={form.price}
            onChange={onChange("price")}
            placeholder="단가"
          />
        </div>
      </div>
      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={() => onCloseFn(null)} />
        <Button label="저장" onClick={handleSubmit} />
      </div>
    </Dialog>
  );
};

export default MaterialEntryForm7305;
