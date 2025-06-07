/* 7.1.2.거래처등록의 수정, 추가 : H1001, BM-7102 */
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
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
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
      <Calendar
        locale="ko"
        value={value}
        onChange={onChange}
        showIcon
        dateFormat="yy-mm-dd"
        disabled={disabled}
      />
      <Divider layout="vertical" />
      <div className="flex items-center">
        <Checkbox checked={checked} onChange={onCheckboxChange} />
        <label className="ml-2">없음</label>
      </div>
    </div>
  </div>
);

const CreditEntryFormPage = () => {
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);
  const navigate = useNavigate();
  const { id } = useParams();
  const state = id ? "수정" : "추가";

  //TODO 수정시에는 기본값으로 데이터 넣어주기
  const [formData, setFormData] = useState({
    거래처코드: id ?? "", // 수정,입력불가 참고용
    거래처명: "",
    거래처약칭: "",
    대표자: "",
    주민법인번호: "",
    사업자번호: "",
    거래처담당자: { ID: "", name: "", quit: false }, // 1명
    업태: "",
    업종: "",
    색인: "",
    사용여부: "사용",
    구분: "일반",
    거래처등급: "정상",
    우편번호: "",
    주소: "",
    상세주소: "",
    전화번호1: "",
    전화번호2: "",
    팩스번호: "",
    메일주소: "",
    홈페이지: "",
    은행: { ID: "", name: "" },
    수금처코드: { ID: "", name: "" },
    계좌번호: "",
    예금주: "",
    업체담당자: "",
    영업지역: { ID: "", name: "" },
    핸드폰: "",
    내선: "",
    팩스: "",
    계약기간: null,
    노계약기간: false,
    최초거래일: null,
    노최초거래일: false,
    거래종료: null,
    노거래종료: false,
    주류코드: "",
    월용역비: 0,
    비고: "",
  });
  const selectOptions = {
    구분: ["일반", "무역", "주민", "기타"],
    거래처등급: ["우수", "정상", "경계", "불량", "악성", "악채", "중지"],
    사용여부: ["사용", "미사용"],
    주류코드: [
      "미선택",
      "유흥음식점",
      "일반소매점",
      "수퍼, 연쇄점 및 직영점",
      "수퍼, 연쇄점 및 농, 수, 축, 신협가맹점",
      "기타(실 수요자)",
      "총괄납부승",
      "인 받은 수퍼, 직영점",
      "국가기관 등에서 운영하는 연금매점",
    ],
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

  const onNumberChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.value }));
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

  const findList = (type, field = "거래처담당자") => {
    openDialog(type, {
      onClose: (selectedItems) => {
        setFormData((prev) => ({
          ...prev,
          [field]: selectedItems,
        }));
      },
      isMultiple: false,
    });
  };

  const findComonList = (type, field) => {
    let state = field === "은행" ? "bank" : "salearea";
    openDialog(type, {
      onClose: (selectedItems) => {
        setFormData((prev) => ({
          ...prev,
          [field]: selectedItems,
        }));
      },
      state: state,
    });
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

  return (
    <div className="CreditEntryForm">
      <Card>
        <h3 className="CreditEntryForm__title">거래처 {state}</h3>
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
            {renderInput("업태", "업태")}
          </div>

          <div className="column2">
            {renderInput("거래처약칭", "거래처약칭")}
            {renderInput("업종", "업종")}
          </div>

          <div className="column2">
            {renderInput("대표자", "대표자", true)}
            {renderInput("색인", "색인")}
          </div>

          <div className="column2">
            {renderInput("주민법인번호", "주민/법인번호")}
            {renderDropdown("사용여부", "사용여부", "사용여부", true)}
          </div>

          <div className="column2">
            {renderInput("사업자번호", "사업자번호", true)}
            {renderDropdown("구분", "구분", "구분", true)}
          </div>

          <div className="column2">
            <SearchInput
              label="거래처담당자"
              value={formData.거래처담당자.name}
              onSearch={findList}
              type="DGManager"
            />
            {renderDropdown("거래처등급", "거래처등급", "거래처등급", true)}
          </div>

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
                <Button
                  label="주소검색"
                  size="small"
                  onClick={() => handleAddressSearch(onAddressSelect)}
                />
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

          <div className="column2">
            {renderInput("메일주소", "메일주소")}
            {renderInput("홈페이지", "홈페이지")}
          </div>

          <Divider align="left">
            <b>금융 정보</b>
          </Divider>

          <div className="column2">
            <SearchInput
              label="은행"
              value={formData.은행.name}
              onSearch={findComonList}
              type="DGCommonCode1"
            />
            <SearchInput
              label="수금처코드"
              value={formData.수금처코드.name}
              onSearch={() => {}}
              type="paymentReceiverCode"
            />
          </div>

          <div className="column2">
            {renderInput("계좌번호", "계좌번호")}
            {renderInput("예금주", "예금주")}
          </div>

          <Divider align="left">
            <b>담당자 정보</b>
          </Divider>

          <div className="column2">
            {renderInput("업체담당자", "업체담당자")}
            <SearchInput
              label="영업지역"
              value={formData.영업지역.name}
              onSearch={findComonList}
              type="DGCommonCode1"
            />
          </div>

          <div className="column2">
            {renderInput("핸드폰", "핸드폰")}
            <div className="form__input isExtension">
              <div>
                <p>전화번호</p>
                <InputText
                  id="전화번호"
                  name="전화번호2"
                  value={formData.전화번호2}
                  onChange={handleChange}
                  placeholder="전화번호"
                />
              </div>
              <div className="isExtension-num">
                <p>내선</p>
                <InputText
                  id="내선"
                  name="내선"
                  value={formData.내선}
                  onChange={handleChange}
                  placeholder="내선"
                />
              </div>
            </div>
          </div>

          <div className="column2">{renderInput("팩스", "팩스")}</div>

          <Divider align="left">
            <b>거래 정보</b>
          </Divider>

          <div className="column2">
            <DateInput
              label="계약기간"
              value={formData.계약기간}
              onChange={onDateChange("계약기간")}
              onCheckboxChange={onCheckboxToggle("노계약기간")}
              disabled={formData.노계약기간}
              checked={formData.노계약기간}
            />
            <DateInput
              label="최초거래일"
              value={formData.최초거래일}
              onChange={onDateChange("최초거래일")}
              onCheckboxChange={onCheckboxToggle("노최초거래일")}
              disabled={formData.노최초거래일}
              checked={formData.노최초거래일}
            />
          </div>

          <div className="column2">
            <DateInput
              label="거래종료"
              value={formData.거래종료}
              onChange={onDateChange("거래종료")}
              onCheckboxChange={onCheckboxToggle("노거래종료")}
              disabled={formData.노거래종료}
              checked={formData.노거래종료}
            />
            {renderDropdown("주류코드", "주류코드", "주류코드")}
          </div>

          <div className="form__input">
            <p>월용역비</p>
            <InputNumber
              value={formData.월용역비}
              onValueChange={onNumberChange("월용역비")}
              mode="currency"
              currency="KRW"
              locale="ko-KR"
            />
          </div>

          <Divider align="left">
            <b>비고</b>
          </Divider>

          <div className="form__input">
            <InputTextarea
              value={formData.비고}
              onChange={handleChange}
              name="비고"
              rows={5}
              placeholder="비고를 입력해주세요"
            />
          </div>

          <div className="mt-4 flex justify-center gap-2">
            <Button label="취소" severity="secondary" type="button" onClick={() => navigate(-1)} />
            <Button label="저장" type="submit" onClick={handleSubmit} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreditEntryFormPage;
