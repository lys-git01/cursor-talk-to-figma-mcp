import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { formatNumberWithCommas } from "@/utils/common";
import useToastStore from "@/store/toastStore";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";

const CollectHistoryForm2208 = ({ onCloseFn, data, mode = "add" }) => {
  const showToast = useToastStore.getState().showToast;
  const [formData, setFormData] = useState({
    관리코드: "",
    거래처명: "",
    부도금액: "",
    작성기준: "수금계획",
    계획일: new Date(),
    수금계획: "",
    회수일: new Date(),
    회수내역: "",
    회수금액: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        관리코드: data.manageCode || "",
        거래처명: data.customerName || "",
        부도금액: data.bouncedPrice || "",
        작성기준: "수금계획",
        계획일: data.planDate ? new Date(data.planDate) : new Date(),
        회수일: data.collectDate ? new Date(data.collectDate) : new Date(),
        수금계획: data.paymentPlan || "",
        회수금액: data.collectPrice || "",
        잔금: data.balance || "",
      });
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // 필수값 체크
    const requiredFields =
      formData.작성기준 === "수금계획"
        ? ["계획일", "수금계획"]
        : ["회수일", "회수내역", "회수금액"];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      showToast({
        severity: "error",
        summary: "입력 오류",
        detail: "필수 입력값을 확인해주세요.",
        life: 3000,
      });
      return;
    }

    onCloseFn(formData);
  };

  const valueEmptyCheck = (value) => {
    if (!value) return value;
    return formatNumberWithCommas(value);
  };

  const renderPaymentPlan = () => (
    <>
      <div className="form__input">
        <p>계획일</p>
        <Calendar
          value={formData.계획일}
          onChange={(e) => handleInputChange("계획일", e.value)}
          dateFormat="yy-mm-dd"
          disabled={mode === "edit" && formData.작성기준 === "수금계획"}
          showIcon
        />
      </div>
      <div className="form__input">
        <p>수금계획</p>
        <InputText
          value={formData.수금계획}
          onChange={(e) => handleInputChange("수금계획", e.target.value)}
          className="width-100"
        />
      </div>
    </>
  );

  const renderCollectionHistory = () => (
    <>
      <div className="form__input">
        <p>회수일</p>
        <Calendar
          value={formData.회수일}
          onChange={(e) => handleInputChange("회수일", e.value)}
          dateFormat="yy-mm-dd"
          disabled={mode === "edit" && formData.작성기준 === "회수내역"}
          showIcon
        />
      </div>
      <div className="form__input">
        <p>회수내역</p>
        <InputText
          value={formData.회수내역}
          onChange={(e) => handleInputChange("회수내역", e.target.value)}
          className="width-100"
        />
      </div>
      <div className="form__input">
        <p>회수금액</p>
        <InputNumber
          value={formData.회수금액}
          onChange={(e) => handleInputChange("회수금액", e.target.value)}
          className="width-100"
          disabled={mode === "edit" && formData.작성기준 === "회수내역"}
        />
      </div>
    </>
  );

  return (
    <Dialog
      header="회수내역"
      visible
      onHide={() => onCloseFn(null)}
      className="CollectHistoryForm2208"
      style={{ width: "30vw" }}
    >
      <div className="Dialog-container form-list">
        <div>
          <div className="form__input">
            <div className="flex items-center">
              <p>관리코드</p>
              <span>{formData.관리코드}</span>
            </div>
            <div className="flex items-center" style={{ marginLeft: "3.5rem" }}>
              <p>거래처명</p>
              <span>{formData.거래처명}</span>
            </div>
          </div>
          <div className="form__input justify-between">
            <div className="flex items-center mr-4">
              <p>부도금액</p>
              <span>{valueEmptyCheck(formData.부도금액)}</span>
            </div>
            <div className="flex items-center mr-4">
              <p>회수금액</p>
              <span>{valueEmptyCheck(formData.회수금액)}</span>
            </div>
            <div className="flex items-center">
              <p>잔금</p>
              <span>{valueEmptyCheck(formData.잔금)}</span>
            </div>
          </div>
        </div>
        <Divider />
        <div className="form__input">
          <p className="text-lg">작성기준</p>
        </div>
        <div className="form__input">
          <div className="flex gap-4 mt-3 mb-1">
            <div className="flex items-center">
              <RadioButton
                inputId="수금계획"
                name="작성기준"
                value="수금계획"
                onChange={(e) => handleInputChange("작성기준", e.value)}
                checked={formData.작성기준 === "수금계획"}
              />
              <label htmlFor="수금계획" className="ml-2">
                수금계획
              </label>
            </div>
            <div className="flex items-center">
              <RadioButton
                inputId="회수내역"
                name="작성기준"
                value="회수내역"
                onChange={(e) => handleInputChange("작성기준", e.value)}
                checked={formData.작성기준 === "회수내역"}
              />
              <label htmlFor="회수내역" className="ml-2">
                회수내역
              </label>
            </div>
          </div>
        </div>
        {formData.작성기준 === "수금계획" ? renderPaymentPlan() : renderCollectionHistory()}
      </div>
      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={() => onCloseFn(null)} />
        <Button label="저장" onClick={handleSave} />
      </div>
    </Dialog>
  );
};

export default CollectHistoryForm2208;
