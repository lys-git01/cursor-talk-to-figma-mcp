/** 수금 사유 수정 팝업 */

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { useState, useEffect, useRef } from "react";
import useToastStore from "@/store/toastStore";

const PaymentResonForm = ({ onCloseFn, data }) => {
  const showToast = useToastStore.getState().showToast;
  const [formData, setFormData] = useState({
    customerCode: "00001",
    customerName: "거래처명",
    promiseDate: null,
    reason: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        ...formData,
        promiseDate: data.promiseDate ? new Date(data.promiseDate) : null,
        reason: data.memo || "",
      });
    }
  }, [data]);

  const saveData = () => {
    if (!formData.reason) {
      showToast({
        severity: "error",
        summary: "오류",
        detail: "사유를 입력해주세요",
      });
      return;
    }

    onCloseFn({
      ...formData,
      promiseDate: formData.promiseDate ? formData.promiseDate.toISOString().split("T")[0] : null,
    });
  };

  return (
    <Dialog
      header="수금 사유 수정"
      visible
      onHide={() => onCloseFn(null)}
      className="PaymentResonForm"
    >
      <div className="Dialog-container form-list">
        <div className="form__input">
          <p>거래처</p>
          <span>{formData.customerCode}</span>
          <span>{formData.customerName}</span>
        </div>
        <div className="form__input">
          <p>약속일자</p>
          <Calendar
            locale="ko"
            value={formData.promiseDate}
            showIcon
            dateFormat="yy-mm-dd"
            disabled
          />
        </div>
        <div className="form__input">
          <p>사유</p>
          <InputTextarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            rows={5}
            placeholder="사유를 입력해주세요"
            autoFocus
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

export default PaymentResonForm;
