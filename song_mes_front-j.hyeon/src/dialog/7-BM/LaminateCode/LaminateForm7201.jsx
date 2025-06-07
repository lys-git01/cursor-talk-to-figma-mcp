import React from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import useToastStore from "@/store/toastStore";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
const LaminateForm7201 = ({ onCloseFn, state, data }) => {
  const showToast = useToastStore.getState().showToast;
  const [weightForm, setWeightForm] = useState({
    code: data?.code ?? "",
    weight: data?.weight ?? "",
    name: data?.name ?? "",
    isUse: data?.isUse ?? true,
  });
  const [sizeForm, setSizeForm] = useState({
    width: data?.width ?? "",
    height: data?.height ?? "",
    isUse: data?.isUse ?? true,
  });

  const caseTitle = state.case === "weight" ? "중량코드" : "사이즈코드";
  const mode = state.mode === "edit" ? "수정" : "추가";
  // TODO
  const saveData = () => {
    if (state.case === "weight") {
      console.log(weightForm);
    } else if (state.case === "size") {
      console.log(sizeForm);
    }
    // 추가시 데이터가 없으면 에러표시
    if (state.case === "weight") {
      if (weightForm.code === "" || weightForm.weight === "" || weightForm.name === "") {
        showToast({
          severity: "error",
          summary: "오류",
          detail: "모든 필드를 입력해주세요.",
        });
        return;
      }
    } else if (state.case === "size") {
      if (sizeForm.width === "" || sizeForm.height === "") {
        showToast({
          severity: "error",
          summary: "오류",
          detail: "모든 필드를 입력해주세요.",
        });
        return;
      }
    }
    showToast({
      severity: "info",
      summary: `${caseTitle} ${mode}`,
      detail: `${caseTitle} ${mode} 완료했습니다.`,
    });
    onCloseFn();
  };

  return (
    <Dialog
      header={`${caseTitle} ${mode}`}
      visible
      tyle={{ width: "50vw" }}
      onHide={onCloseFn}
      style={{ maxWidth: "1000px" }}
    >
      {state.case === "weight" && (
        <div className="Dialog-container form-list">
          <div className="form__input">
            <label htmlFor="code">코드</label>
            <InputText
              id="code"
              value={weightForm.code}
              onChange={(e) => setWeightForm({ ...weightForm, code: e.target.value })}
              placeholder="숫자+영문 5자이하"
              disabled={state.mode === "edit"}
            />
          </div>
          <div className="form__input">
            <label htmlFor="weight">실제 중량</label>
            <InputText
              id="weight"
              value={weightForm.weight}
              onChange={(e) => setWeightForm({ ...weightForm, weight: e.target.value })}
              placeholder="숫자"
              disabled={state.mode === "edit"}
            />
          </div>
          <div className="form__input">
            <label htmlFor="name">명칭</label>
            <InputText
              id="name"
              value={weightForm.name}
              onChange={(e) => setWeightForm({ ...weightForm, name: e.target.value })}
              placeholder="명칭"
              disabled={state.mode === "edit"}
            />
          </div>
          <div className="form__input">
            <label htmlFor="isUse">사용여부</label>
            <Dropdown
              id="isUse"
              value={weightForm.isUse}
              onChange={(e) => setWeightForm({ ...weightForm, isUse: e.target.value })}
              options={[
                { label: "사용", value: true },
                { label: "미사용", value: false },
              ]}
            />
          </div>
        </div>
      )}
      {state.case === "size" && (
        <div className="Dialog-container form-list">
          <div className="form__input">
            <label htmlFor="width">가로</label>
            <InputText
              id="width"
              value={sizeForm.width}
              onChange={(e) => setSizeForm({ ...sizeForm, width: e.target.value })}
              disabled={state.mode === "edit"}
              placeholder="가로"
            />
          </div>
          <div className="form__input">
            <label htmlFor="height">세로</label>
            <InputText
              id="height"
              value={sizeForm.height}
              onChange={(e) => setSizeForm({ ...sizeForm, height: e.target.value })}
              disabled={state.mode === "edit"}
              placeholder="세로"
            />
          </div>
          <div className="form__input">
            <label htmlFor="isUse">사용여부</label>
            <Dropdown
              id="isUse"
              value={sizeForm.isUse}
              onChange={(e) => setSizeForm({ ...sizeForm, isUse: e.target.value })}
              options={[
                { label: "사용", value: true },
                { label: "미사용", value: false },
              ]}
            />
          </div>
        </div>
      )}
      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={onCloseFn}></Button>
        <Button label="저장" onClick={saveData}></Button>
      </div>
    </Dialog>
  );
};

export default LaminateForm7201;
