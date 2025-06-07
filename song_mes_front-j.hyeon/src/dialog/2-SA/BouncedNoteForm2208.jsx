/** 부도어음 등록 및 수정 팝업 */

import useDialogStore from "@/store/dialogStore";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useRef, useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { formatNumberWithCommas } from "@/utils/common";
import useToastStore from "@/store/toastStore";

const BouncedNoteForm2208 = ({ onCloseFn, data }) => {
  const toast = useRef(null);
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);

  const [formData, setFormData] = useState({
    거래처코드: "",
    거래처명: "",
    부도일자: new Date(),
    만기일자: new Date(),
    현재상황: "진행중",
    어음종류: "약속어음",
    부도금액: "0",
    담당자: {
      code: "",
      name: "",
    },
    원본위치: "당사보관",
    어음번호: "",
    발행처: "",
    비고: "",
    이미지: "",
    이미지명: "",
  });

  const valueEmptyCheck = (value) => {
    if (!value) return value;
    return formatNumberWithCommas(value);
  };

  // 초기 데이터 설정
  useEffect(() => {
    if (data) {
      setFormData({
        거래처코드: data.id || "",
        거래처명: data.customerName || "",
        부도일자: data.bankruptcyDate ? new Date(data.bankruptcyDate) : new Date(),
        만기일자: data.expiredDate ? new Date(data.expiredDate) : new Date(),
        현재상황: data.billSt === 1 ? "진행중" : data.billSt === 2 ? "대손처리" : "회수완료",
        어음종류: data.type || "약속어음",
        부도금액: valueEmptyCheck(data.bankruptcyPrice) || "0",
        담당자: data.managerName || { code: "", name: "" },
        원본위치: data.originLocation || "당사보관",
        어음번호: data.noteNum || "",
        발행처: data.publisher || "",
        비고: data.memo || "",
        이미지: data.image || "",
        이미지명: data.imageName || "",
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
    // 필수 입력값 검증
    if (!formData.거래처명 || !formData.부도금액 || !formData.어음번호) {
      showToast({
        severity: "error",
        summary: "입력 오류",
        detail: "필수 입력값을 확인해주세요.",
        life: 3000,
      });
      return;
    }

    // 콜백으로 데이터 반환
    onCloseFn(formData);

    showToast({
      severity: "success",
      summary: "저장 완료",
      detail: "부도어음 정보가 저장되었습니다.",
    });
  };

  const handleSearchClient = () => {
    openDialog("DGClientSelect1", {
      callback: (result) => {
        if (result) {
          setFormData((prev) => ({
            ...prev,
            거래처코드: result.code,
            거래처명: result.name,
          }));
        }
      },
    });
  };

  const handleSearchManager = () => {
    openDialog("DGManager", {
      callback: (result) => {
        if (result) {
          setFormData((prev) => ({
            ...prev,
            담당자: {
              code: result.code,
              name: result.name,
            },
          }));
        }
      },
    });
  };

  const handleAttachImage = () => {
    openDialog("DGImageAttach", {
      callback: (result) => {
        if (result) {
          setFormData((prev) => ({
            ...prev,
            이미지: result.path,
            이미지명: result.name,
          }));
        }
      },
    });
  };

  // 검색 버튼이 있는 입력 필드 컴포넌트
  const SearchInput = ({ label, value = "", onSearch, type }) => (
    <div className="form__input common-search__input">
      <p>{label}</p>
      <span className="callList">{value}</span>
      <Button label="찾기" size="small" onClick={() => onSearch(type, label)} />
    </div>
  );

  // 일반 입력 필드 컴포넌트
  const FormInput = ({ label, value, onChange, type = "text", options = [], className = "" }) => (
    <div className="form__input">
      <p>{label}</p>
      {type === "dropdown" ? (
        <Dropdown
          value={value}
          options={options}
          onChange={(e) => onChange(e.value)}
          className="width-100"
        />
      ) : type === "calendar" ? (
        <Calendar
          value={value}
          onChange={(e) => onChange(e.value)}
          dateFormat="yy-mm-dd"
          showIcon
        />
      ) : (
        <InputText
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`width-100 ${className}`}
        />
      )}
    </div>
  );

  const formFields = [
    {
      type: "search",
      label: "거래처명",
      value: formData.거래처명 || "",
      searchType: "DGClientSelect1",
    },
    {
      type: "calendar",
      label: "부도일자",
      value: formData.부도일자,
      field: "부도일자",
    },
    {
      type: "calendar",
      label: "만기일자",
      value: formData.만기일자,
      field: "만기일자",
    },
    {
      type: "dropdown",
      label: "현재상황",
      value: formData.현재상황,
      field: "현재상황",
      options: ["진행중", "대손처리", "회수완료"],
    },
    {
      type: "dropdown",
      label: "어음종류",
      value: formData.어음종류,
      field: "어음종류",
      options: ["약속어음", "당좌수표", "문방어음", "전자어음"],
    },
    {
      type: "text",
      label: "부도금액",
      value: formData.부도금액,
      field: "부도금액",
      className: "text-right",
    },
    {
      type: "search",
      label: "담당자",
      value: formData.담당자?.name || "",
      searchType: "DGManager",
    },
    {
      type: "dropdown",
      label: "원본위치",
      value: formData.원본위치,
      field: "원본위치",
      options: ["당사보관", "거래처발송"],
    },
    {
      type: "text",
      label: "어음번호",
      value: formData.어음번호,
      field: "어음번호",
    },
    {
      type: "text",
      label: "발행처",
      value: formData.발행처,
      field: "발행처",
    },
    {
      type: "text",
      label: "비고",
      value: formData.비고,
      field: "비고",
    },
  ];

  return (
    <Dialog
      header="부도어음"
      visible
      onHide={() => onCloseFn(null)}
      className="BouncedNoteForm"
      style={{ width: "25vw" }}
    >
      <Toast ref={toast} />
      <div className="Dialog-container form-list">
        {formFields.map((field, index) =>
          field.type === "search" ? (
            <SearchInput
              key={index}
              label={field.label}
              value={field.value}
              onSearch={
                field.searchType === "DGClientSelect1" ? handleSearchClient : handleSearchManager
              }
              type={field.searchType}
              className={field.className}
            />
          ) : (
            <FormInput
              key={index}
              label={field.label}
              value={field.value}
              onChange={(value) => handleInputChange(field.field, value)}
              type={field.type}
              options={field.options}
              className={field.className}
            />
          ),
        )}

        <div className="form__input">
          <p>이미지명</p>
          <Button
            label="이미지 찾기"
            size="small"
            onClick={handleAttachImage}
            style={{ width: "fit-content" }}
          />
          <InputText
            value={formData.이미지명}
            onChange={(e) => handleInputChange("이미지명", e.target.value)}
          />
        </div>
      </div>

      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={() => onCloseFn(null)} />
        <Button label="저장" onClick={handleSave} />
      </div>
    </Dialog>
  );
};

export default BouncedNoteForm2208;
