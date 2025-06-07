/* 7.3.1.금융거래처등록의 수정, 추가  BM-7301 */
import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import useToastStore from "@/store/toastStore";
import { Dropdown } from "primereact/dropdown";
import useDialogStore from "@/store/dialogStore";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { loadDaumPostcodeScript, handleAddressSearch } from "@/utils/addressSearch";

// 공통 입력 필드 컴포넌트
const FormInput = ({ label, required, children }) => (
  <div className="form__input">
    <p>
      {label}
      {required && "*"}
    </p>
    {children}
  </div>
);

// 검색 버튼이 있는 입력 필드 컴포넌트
const SearchInput = ({ label, value, onSearch, type }) => (
  <div className="form__input common-search__input">
    <p>{label}</p>
    <span className="callList">{value}</span>
    <Button label="찾기" size="small" onClick={() => onSearch(type, label)} />
  </div>
);

// 날짜 입력 필드 컴포넌트
const DateInput = ({ label, value, onChange, onCheckboxChange, disabled, checked }) => (
  <div className="form__input">
    <p>{label}</p>
    <div className="flex items-center">
      {label === "해지일" ? (
        <Calendar
          locale="ko"
          value={value}
          onChange={onChange}
          showIcon
          dateFormat="yy-mm-dd"
          disabled={disabled}
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
        />
      ) : (
        <Calendar
          locale="ko"
          value={value}
          onChange={onChange}
          showIcon
          dateFormat="yy-mm-dd"
          disabled={disabled}
        />
      )}
      <Divider layout="vertical" />
      <div className="flex items-center">
        <Checkbox checked={checked} onChange={onCheckboxChange} />
        <label className="ml-2">없음</label>
      </div>
    </div>
  </div>
);

const FinanceClientFormPage = () => {
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);
  const navigate = useNavigate();
  const { id } = useParams();
  const state = id ? "수정" : "추가";

  const [formData, setFormData] = useState({
    거래처코드: id ?? "",
    거래처명: "",
    거래처약칭: "",
    사업자번호: "",
    사용여부: "사용",
    구분: "금융기관",
    우편번호: "",
    주소: "",
    상세주소: "",
    전화번호1: "",
    팩스번호: "",
    홈페이지: "",
    금융기관: { ID: "", name: "" },
    월불입액: "",
    계좌번호: "",
    결제일: "",
    이자율: "",
    계좌계설점: "",
    당좌한도액: "",
    예금종류: "",
    해지일: null,
    노해지일: true,
    계좌계설일: null,
    노계좌계설일: true,
  });
  // 구분이 금융기관일 경우 금융정보 필드 렌더링
  const 금융기관 = {
    금융기관: { ID: "", name: "" },
    월불입액: "",
    계좌번호: "",
    결제일: "",
    예금명: "",
    이자율: "",
    계좌계설점: "",
    당좌한도액: "",
    예금종류: "", // select
    해지일: null,
    노해지일: true,
    계좌계설일: null,
    노계좌계설일: true,
  };
  const 정기예금 = {
    금융기관: { ID: "", name: "" },
    월이자수입: "",
    계좌번호: "",
    이자이체일: "",
    예금명: "",
    이자율: "",
    계좌계설점: "",
    금액: "",
    예금종류: "", // select
    계약기간: null,
    노계약기간: true,
    만기지급일: null,
    노만기지급일: true,
  };
  const 정기적금 = {
    금융기관: { ID: "", name: "" },
    매회불입액: "",
    계좌번호: "",
    매회납입일: "",
    적금명: "",
    이자율: "",
    계좌계설점: "",
    계약금액: "",
    적금종류: "", // select
    계약기간: null,
    노계약기간: true,
    만기지급일: null,
    노만기지급일: true,
  };
  const 카드사 = {
    금융기관: { ID: "", name: "" },
    월불입액: "",
    입금계좌: { ID: "", name: "" },
    수수료율: "",
    계좌계설점: "",
    계약금액: "",
    계약기간: "",
    노계약기간: true,
    만기지급일: null,
    노만기지급일: true,
  };
  const 신용카드 = {
    주민번호: "",
    신용카드사: { ID: "", name: "" },
    월불입액: "",
    카드번호: "",
    결제일: "",
    결제계좌: { ID: "", name: "" },
    수수료율: "",
    계좌계설점: "",
    월한도액: "",
    카드회원명: "",
    카드구분: "", // select
    유효기간: "",
    노유효기간: true,
    만기지급일: null,
    노만기지급일: true,
  };

  const selectOptions = {
    구분: ["금융기관", "정기예금", "정기적금", "카드사", "신용카드"],
    거래처등급: ["우수", "정상", "경계", "불량", "악성", "악채", "중지"],
    사용여부: ["사용", "미사용"],
    예금종류: [
      "보통예금",
      "대출통장",
      "당좌예금",
      "외화예금",
      "별단예금",
      "정기예금",
      "정기적금",
      "신탁연금",
      "연금보험",
      "기타",
    ],
    적금종류: ["정기적금", "자유적금", "기타"],
    카드구분: ["신용카드", "체크카드", "기타"],
  };

  useEffect(() => {
    const script = loadDaumPostcodeScript();
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onDateChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.value }));
  };

  const onCheckboxToggle = (field) => (e) => {
    const checked = e.checked;
    const dateField = field.replace("노", "");
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
      [dateField]: checked ? null : prev[dateField],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    showToast({
      severity: "info",
      summary: "저장",
      detail: "저장이 완료되었습니다.",
    });
  };

  const findComonList = (type, field) => {
    if (field === "은행") {
      openDialog(type, {
        onClose: (selectedItems) => {
          setFormData((prev) => ({
            ...prev,
            [field]: selectedItems,
          }));
        },
        state: "bank",
      });
    } else if (field === "결제계좌" || field === "입금계좌") {
      openDialog(type, {
        onClose: (selectedItems) => {
          setFormData((prev) => ({
            ...prev,
            [field]: selectedItems,
          }));
        },
        state: "paymentReceiverCode",
      });
    }
  };

  const onAddressSelect = (data) => {
    setFormData((prev) => ({
      ...prev,
      우편번호: data.zonecode,
      주소: data.address,
      상세주소: "",
    }));
  };

  // 공통 입력 필드 렌더링 함수
  const renderInput = (
    name,
    label,
    required = false,
    placeholder = `${label}을(를) 입력해주세요.`,
  ) => (
    <FormInput label={label} required={required}>
      <InputText
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
      />
    </FormInput>
  );

  // 드롭다운 필드 렌더링 함수
  const renderDropdown = (name, label, options, required = false) => (
    <FormInput label={label} required={required}>
      <Dropdown
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        options={selectOptions[options]}
        placeholder={`${label}을(를) 선택해주세요.`}
      />
    </FormInput>
  );

  // 금융정보 필드 렌더링 함수
  const renderFinanceFields = () => {
    switch (formData.구분) {
      case "금융기관":
        return (
          <>
            <div className="column2">
              <SearchInput
                label="금융기관"
                value={formData.금융기관.name}
                onSearch={() => findComonList("DGCommonCode1", "은행")}
                type="paymentReceiverCode"
              />
              {renderInput("월불입액", "월 불입액")}
            </div>
            <div className="column2">
              {renderInput("계좌번호", "계좌번호", true)}
              {renderInput("결제일", "결제일", true)}
            </div>
            <div className="column2">
              {renderInput("예금명", "예금명", true)}
              {renderInput("이자율", "이자율", true)}
            </div>
            <div className="column2">
              {renderInput("계좌계설점", "계좌계설점", true)}
              {renderInput("당좌한도액", "당좌한도액", true)}
            </div>
            <div className="column2">
              {renderDropdown("예금종류", "예금종류", "예금종류", true)}
            </div>
            <div>
              <DateInput
                label="해지일"
                value={formData.해지일}
                onChange={onDateChange("해지일")}
                onCheckboxChange={onCheckboxToggle("노해지일")}
                disabled={formData.노해지일}
                checked={formData.노해지일}
              />
            </div>
            <div>
              <DateInput
                label="계좌계설일"
                value={formData.계좌계설일}
                onChange={onDateChange("계좌계설일")}
                onCheckboxChange={onCheckboxToggle("노계좌계설일")}
                disabled={formData.노계좌계설일}
                checked={formData.노계좌계설일}
              />
            </div>
          </>
        );
      case "정기예금":
        return (
          <>
            <div className="column2">
              <SearchInput
                label="금융기관"
                value={formData.금융기관.name}
                onSearch={() => findComonList("DGCommonCode1", "은행")}
                type="paymentReceiverCode"
              />
              {renderInput("월이자수입", "월 이자수입")}
            </div>
            <div className="column2">
              {renderInput("계좌번호", "계좌번호", true)}
              {renderInput("이자이체일", "이자이체일", true)}
            </div>
            <div className="column2">
              {renderInput("예금명", "예금명", true)}
              {renderInput("이자율", "이자율", true)}
            </div>
            <div className="column2">{renderInput("계좌계설점", "계좌계설점", true)}</div>
            <div className="column2">
              {renderInput("금액", "금액", true)}
              {renderDropdown("예금종류", "예금종류", "예금종류", true)}
            </div>
            <div>
              <DateInput
                label="계약기간"
                value={formData.계약기간}
                onChange={onDateChange("계약기간")}
                onCheckboxChange={onCheckboxToggle("노계약기간")}
                disabled={formData.노계약기간}
                checked={formData.노계약기간}
              />
            </div>
            <div>
              <DateInput
                label="만기지급일"
                value={formData.만기지급일}
                onChange={onDateChange("만기지급일")}
                onCheckboxChange={onCheckboxToggle("노만기지급일")}
                disabled={formData.노만기지급일}
                checked={formData.노만기지급일}
              />
            </div>
          </>
        );
      case "정기적금":
        return (
          <>
            <div className="column2">
              <SearchInput
                label="금융기관"
                value={formData.금융기관.name}
                onSearch={() => findComonList("DGCommonCode1", "은행")}
                type="paymentReceiverCode"
              />
              {renderInput("매회불입액", "매회 불입액")}
            </div>
            <div className="column2">
              {renderInput("계좌번호", "계좌번호", true)}
              {renderInput("매회납입일", "매회납입일", true)}
            </div>
            <div className="column2">
              {renderInput("적금명", "적금명", true)}
              {renderInput("이자율", "이자율", true)}
            </div>
            <div className="column2">
              {renderInput("계좌계설점", "계좌계설점", true)}
              {renderInput("계약금액", "계약금액", true)}
            </div>
            <div className="column2">
              {renderDropdown("적금종류", "적금종류", "적금종류", true)}
            </div>
            <div>
              <DateInput
                label="계약기간"
                value={formData.계약기간}
                onChange={onDateChange("계약기간")}
                onCheckboxChange={onCheckboxToggle("노계약기간")}
                disabled={formData.노계약기간}
                checked={formData.노계약기간}
              />
            </div>
            <div>
              <DateInput
                label="만기지급일"
                value={formData.만기지급일}
                onChange={onDateChange("만기지급일")}
                onCheckboxChange={onCheckboxToggle("노만기지급일")}
                disabled={formData.노만기지급일}
                checked={formData.노만기지급일}
              />
            </div>
          </>
        );
      case "카드사":
        return (
          <>
            <div className="column2">
              <SearchInput
                label="금융기관"
                value={formData.금융기관.name}
                onSearch={() => findComonList("DGCommonCode1", "은행")}
                type="paymentReceiverCode"
              />
              {renderInput("월불입액", "월 불입액")}
            </div>
            <div className="column2">
              <SearchInput
                label="입금계좌"
                value={formData.입금계좌.clientName}
                onSearch={() => findComonList("DGClientSelect1", "입금계좌")}
                type="paymentReceiverCode"
              />
              {renderInput("결제일", "결제일", true)}
            </div>
            <div className="column2">
              {renderInput("가맹점 번호", "가맹점 번호", true)}
              {renderInput("수수료율", "수수료율", true)}
            </div>
            <div className="column2">
              {renderInput("계좌계설점", "계좌계설점", true)}
              {renderInput("계약금액", "계약금액", true)}
            </div>
            <div>
              <DateInput
                label="계약기간"
                value={formData.계약기간}
                onChange={onDateChange("계약기간")}
                onCheckboxChange={onCheckboxToggle("노계약기간")}
                disabled={formData.노계약기간}
                checked={formData.노계약기간}
              />
            </div>
            <div>
              <DateInput
                label="만기지급일"
                value={formData.만기지급일}
                onChange={onDateChange("만기지급일")}
                onCheckboxChange={onCheckboxToggle("노만기지급일")}
                disabled={formData.노만기지급일}
                checked={formData.노만기지급일}
              />
            </div>
          </>
        );
      case "신용카드":
        return (
          <>
            <div className="column2">
              <SearchInput
                label="신용카드사"
                value={formData.신용카드사.name}
                onSearch={() => findComonList("DGCommonCode1", "신용카드사")}
                type="paymentReceiverCode"
              />
              {renderInput("월불입액", "월 불입액")}
            </div>
            <div className="column2">
              {renderInput("카드번호", "카드번호", true)}
              {renderInput("결제일", "결제일", true)}
            </div>
            <div className="column2">
              <SearchInput
                label="결제계좌"
                value={formData.결제계좌.clientName}
                onSearch={() => findComonList("DGClientSelect1", "결제계좌")}
                type="paymentReceiverCode"
              />
              {renderInput("수수료율", "수수료율", true)}
            </div>
            <div className="column2">
              {renderInput("계좌계설점", "계좌계설점", true)}
              {renderInput("월한도액", "월한도액", true)}
            </div>
            <div className="column2">
              {renderInput("카드회원명", "카드회원명", true)}
              {renderDropdown("카드구분", "카드구분", "카드구분", true)}
            </div>
            <div>
              <DateInput
                label="유효기간"
                value={formData.유효기간}
                onChange={onDateChange("유효기간")}
                onCheckboxChange={onCheckboxToggle("노유효기간")}
                disabled={formData.노유효기간}
                checked={formData.노유효기간}
              />
            </div>
            <div>
              <DateInput
                label="만기지급일"
                value={formData.만기지급일}
                onChange={onDateChange("만기지급일")}
                onCheckboxChange={onCheckboxToggle("노만기지급일")}
                disabled={formData.노만기지급일}
                checked={formData.노만기지급일}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // 구분 변경 시 formData 초기화
  const handleDivisionChange = (e) => {
    const division = e.value;
    setFormData((prev) => {
      const newData = {
        ...prev,
        구분: division,
      };

      // 구분에 따라 해당하는 필드들만 초기화
      switch (division) {
        case "금융기관":
          return { ...newData, ...금융기관 };
        case "정기예금":
          return { ...newData, ...정기예금 };
        case "정기적금":
          return { ...newData, ...정기적금 };
        case "카드사":
          return { ...newData, ...카드사 };
        case "신용카드":
          return { ...newData, ...신용카드 };
        default:
          return newData;
      }
    });
  };

  return (
    <div className="FinanceClientForm">
      <Card>
        <h3 className="FinanceClientForm__title">금융거래처 {state}</h3>
        <div className="form-list">
          {state === "수정" && (
            <div className="column2">
              <FormInput label="거래처코드">
                <span>{formData.거래처코드}</span>
              </FormInput>
            </div>
          )}

          <div className="column2">
            {renderInput("거래처명", "거래처명", true)}
            {renderDropdown("사용여부", "사용여부", "사용여부", true)}
          </div>

          <div className="column2">
            {renderInput("거래처약칭", "거래처약칭", true)}
            <FormInput label="구분" required={true}>
              <Dropdown
                id="구분"
                name="구분"
                value={formData.구분}
                onChange={handleDivisionChange}
                options={selectOptions.구분}
                placeholder="구분을 선택해주세요."
              />
            </FormInput>
          </div>
          <div className="column2">
            {renderInput("사업자번호", "사업자번호", true)}
            {formData.구분 === "신용카드" && renderInput("주민번호", "주민번호", true)}
          </div>

          <Divider align="left">
            <b>금융 정보</b>
          </Divider>

          {renderFinanceFields()}

          <Divider align="left">
            <b>연락처 정보</b>
          </Divider>
          <div className="column2">
            <div className="form__input">
              <p>우편번호</p>
              <div className="common-search__input">
                <InputText
                  id="우편번호"
                  name="우편번호"
                  value={formData.우편번호}
                  onChange={handleChange}
                  disabled
                />
                <Button label="검색" onClick={() => handleAddressSearch(onAddressSelect)} />
              </div>
            </div>
          </div>
          <div className="column2">
            {renderInput("주소", "회사주소")}
            {renderInput("상세주소", "상세주소")}
          </div>
          <div className="column2">
            {renderInput("전화번호1", "전화번호")}
            {renderInput("팩스번호", "팩스번호")}
          </div>

          <div className="column2">{renderInput("홈페이지", "홈페이지")}</div>
          <div className="mt-4 flex justify-center gap-2">
            <Button label="취소" severity="secondary" type="button" onClick={() => navigate(-1)} />
            <Button label="저장" type="submit" onClick={handleSubmit} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinanceClientFormPage;
