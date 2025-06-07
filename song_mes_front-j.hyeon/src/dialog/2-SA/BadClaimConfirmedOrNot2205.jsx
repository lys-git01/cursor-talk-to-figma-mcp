/** 채권 확정 여부 확인 팝업 */

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { formatDates, formatNumberWithCommas } from "@/utils/common";
import useToastStore from "@/store/toastStore";

const BadClaimConfirmedOrNot2205 = ({ onCloseFn, data }) => {
  const showToast = useToastStore.getState().showToast;

  const handleConfirm = () => {
    if (data.confirmDate) {
      showToast({
        severity: "info",
        summary: "알림",
        detail: "확정 취소 백엔드 api 호출.",
      });
    } else {
      showToast({
        severity: "info",
        summary: "알림",
        detail: "확정하기 백엔드 api 호출.",
      });
    }
  };

  const handleCancel = () => {
    onCloseFn(false);
  };

  return (
    <Dialog
      header={data.confirmDate ? "확정취소" : "확정하기"}
      visible
      onHide={() => onCloseFn(null)}
      className="BadClaimConfirmedOrNot"
      style={{ width: "21vw" }}
    >
      {data.confirmDate ? (
        <div className="Dialog-container form-list">
          <div className="form__input">
            <p>전환번호</p>
            <span>{data.conversionNumber}</span>
          </div>
          <div className="form__input">
            <p>거래처</p>
            <span>{data.customerName}</span>
          </div>
          <div className="form__input">
            <p>채권금액</p>
            <span>{formatNumberWithCommas(data.totalPrice)}</span>
          </div>
          <p className="text-red-500 mt-6">확정을 취소하시겠습니까?</p>
        </div>
      ) : (
        <div className="Dialog-container form-list">
          <div className="form__input">
            <p>확정일자</p>
            <Calendar locale="ko" value={formatDates("today")} showIcon dateFormat="yy-mm-dd" />
          </div>
        </div>
      )}
      <div className="Dialog__btns mt-5">
        <Button
          label={data.confirmDate ? "닫기" : "취소"}
          severity="secondary"
          onClick={handleCancel}
        />
        <Button label={data.confirmDate ? "확정취소" : "저장"} onClick={handleConfirm} />
      </div>
    </Dialog>
  );
};

export default BadClaimConfirmedOrNot2205;
