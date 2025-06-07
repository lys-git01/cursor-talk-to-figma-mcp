// 채권관리리스트등록 및 제외 L3072 DG-claimListManage DG-60

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { useState, useEffect, useRef } from "react";
import useToastStore from "@/store/toastStore";

const DGClaimListManage = ({ data, onCloseFn }) => {
  const showToast = useToastStore.getState().showToast;
  const [formData, setFormData] = useState({
    customerCode: data.customerCode,
    customerName: data.customerName,
    manageMemo: data.manageMemo,
  });

  console.log(data);

  useEffect(() => {
    if (data) {
      setFormData({
        ...formData,
        promiseDate: data.promiseDate ? new Date(data.promiseDate) : null,
        manageMemo: data.manageMemo || "",
      });
    }
  }, [data]);

  const saveData = () => {
    if (!formData.manageMemo) {
      showToast({
        severity: "error",
        summary: "오류",
        detail: "비고를 입력해주세요",
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
      header="채권관리 리스트 등록 및 제외"
      visible
      onHide={() => onCloseFn(null)}
      className="PaymentResonForm"
      style={{ width: "20vw" }}
    >
      <div className="Dialog-container form-list">
        <div className="form__input">
          <p>거래처코드</p>
          <span>{formData.customerCode}</span>
          {"|"}
          <span>{formData.customerName}</span>
        </div>
        <div className="form__input mt-5 items-baseline">
          <p>관리비고</p>
          <div className="flex flex-col gap-2 width-100">
            <InputTextarea
              value={formData.manageMemo}
              onChange={(e) => setFormData({ ...formData, manageMemo: e.target.value })}
              rows={5}
              placeholder="관리 비고"
              autoFocus
            />
            {data.isManaged && (
              <div className="flex justify-end">
                <Button label="비고 저장" onClick={saveData} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="Dialog__btns mt-3">
        <Button label="닫기" severity="secondary" onClick={() => onCloseFn(null)} />
        <Button
          label={`관리리스트에 ${data.isManaged ? "제외" : "등록"}`}
          severity={data.isManaged ? "danger" : "primary"}
          onClick={saveData}
        />
      </div>
    </Dialog>
  );
};

export default DGClaimListManage;
