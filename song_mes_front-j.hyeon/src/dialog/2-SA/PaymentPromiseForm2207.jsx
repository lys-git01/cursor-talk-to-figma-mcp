/** 수금 약속일 추가 및 수정 팝업 */

import { useState, useEffect } from "react";
import useToastStore from "@/store/toastStore";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { formatDates } from "@/utils/common";

const PaymentPromiseForm2207 = ({ onCloseFn, data }) => {
  const showToast = useToastStore.getState().showToast;
  const [formData, setFormData] = useState({
    appointDate: data?.appointDate ? new Date(data.appointDate) : new Date(),
    planMemo: data?.planMemo || "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        ...formData,
        appointDate: data.appointDate ? new Date(data.appointDate) : new Date(),
        planMemo: data.planMemo || "",
      });
    }
  }, [data]);

  const saveData = () => {
    if (!formData.planMemo) {
      showToast({
        severity: "error",
        summary: "오류",
        detail: "수금계획을 입력해주세요",
      });
      return;
    }

    onCloseFn({
      ...formData,
      appointDate: formData.appointDate ? formData.appointDate.toISOString().split("T")[0] : null,
    });
  };

  return (
    <Dialog
      header="수금 계획일"
      visible
      onHide={() => onCloseFn(null)}
      className="PaymentResonForm"
    >
      <div className="Dialog-container form-list">
        <div className="form__input">
          <p>수금일</p>
          <Calendar
            locale="ko"
            value={formData.appointDate}
            onChange={(e) => setFormData({ ...formData, appointDate: e.value })}
            showIcon
            dateFormat="yy-mm-dd"
          />
        </div>
        <div className="form__input">
          <p>비고</p>
          <InputText
            value={formData.planMemo}
            onChange={(e) => setFormData({ ...formData, planMemo: e.target.value })}
            rows={5}
            placeholder="비고"
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

export default PaymentPromiseForm2207;
