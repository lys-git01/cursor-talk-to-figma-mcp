/* 7.4.1.회사등록(수정, 추가) BM-7401 */
import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { useParams, useNavigate } from "react-router-dom";
import { loadDaumPostcodeScript, handleAddressSearch } from "@/utils/addressSearch";
import useToastStore from "@/store/toastStore";

const FormInput = ({ label, required, children }) => (
  <div className="form__input">
    <p>
      {label}
      {required && <span style={{ color: "red" }}>*</span>}
    </p>
    {children}
  </div>
);

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

const CompanyEntryFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const state = id ? "수정" : "추가";
  const showToast = useToastStore.getState().showToast;
  const [formData, setFormData] = useState({
    회사코드: id ?? "",
    더존전송회사ID: "",
    회사명: "",
    거래처명: "",
    사용여부: "사용",
    관리회사명: "",
    내외국인: "내국인",
    구분: "일반",
    대표자: "",
    주민번호: "",
    사업자번호: "",
    법인번호: "",
    우편번호: "",
    주소: "",
    상세주소: "",
    전화번호: "",
    팩스번호: "",
    업태: "",
    업종: "",
    홈페이지: "",
    대표자_우편번호: "",
    대표자_주소: "",
    대표자_상세주소: "",
    대표자_전화번호: "",
    개업일자: null,
    폐업일자: null,
    폐업없음: false,
    영문회사명: "",
    영문대표자: "",
    영문_우편번호: "",
    영문_주소: "",
    영문_상세주소: "",
  });

  useEffect(() => {
    const script = loadDaumPostcodeScript();
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onAddressSelect = (data) => {
    setFormData((prev) => ({
      ...prev,
      우편번호: data.zonecode,
      주소: data.address,
      상세주소: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    showToast({
      severity: "info",
      summary: "저장",
      detail: "저장이 완료되었습니다.",
    });
  };
  return (
    <div className="CompanyEntryForm">
      <Card>
        <h3 className="CompanyEntryForm__title">회사등록 {state}</h3>
        <div className="form-list">
          <div className="column2">
            {id && (
              <FormInput label="회사코드">
                <span>{formData.회사코드}</span>
              </FormInput>
            )}
            {renderInput("더존전송 회사ID", "더존전송 회사ID")}
          </div>

          <div className="column2">
            {renderInput("회사명", "회사명", true)}
            {renderDropdown("사용여부", "사용여부", "사용여부", true)}
          </div>
          <div className="column2">
            {renderInput("관리 회사명", "관리 회사명")}
            {renderDropdown("구분", "구분", "구분", true)}
          </div>
          <div className="column2">{renderInput("대표자", "대표자", true)}</div>
          <div className="column2">{renderInput("주민번호", "주민번호", true)}</div>
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
            {renderInput("전화번호", "전화번호")}
            {renderInput("팩스번호", "팩스번호")}
          </div>
          <div className="column2">
            {renderInput("업태", "업태")}
            {renderInput("업종", "업종")}
          </div>
          <div className="column2">{renderInput("홈페이지", "홈페이지")}</div>
        </div>

        {/* 대표자 관련 사항 */}
        <Divider align="left">
          <b>대표자 관련 사항</b>
        </Divider>
        <div className="form-list">
          <div className="column2">
            <div className="form__input">
              <p>우편번호</p>
              <div className="common-search__input">
                <InputText
                  id="대표자_우편번호"
                  name="대표자_우편번호"
                  value={formData.대표자_우편번호}
                  onChange={handleChange}
                  disabled
                />
                <Button
                  label="검색"
                  onClick={() =>
                    handleAddressSearch((data) =>
                      setFormData((prev) => ({
                        ...prev,
                        대표자_우편번호: data.zonecode,
                        대표자_주소: data.address,
                      })),
                    )
                  }
                />
              </div>
            </div>
          </div>
          <div className="column2">{renderInput("대표자_주소", "주소")}</div>
          <div className="column2">
            {renderInput("대표자_상세주소", "상세주소")}
            {renderInput("대표자_전화번호", "전화번호")}
          </div>
        </div>

        {/* 회계 관련 사항 */}
        <Divider align="left">
          <b>회계 관련 사항</b>
        </Divider>
        <div className="form-list">
          <div className="column2">
            <DateInput
              label="개업일자"
              value={formData.개업일자}
              onChange={onDateChange("개업일자")}
              onCheckboxChange={onCheckboxToggle("노개업일자")}
              disabled={formData.노개업일자}
              checked={formData.노개업일자}
            />
            <DateInput
              label="폐업일자"
              value={formData.폐업일자}
              onChange={onDateChange("폐업일자")}
              onCheckboxChange={onCheckboxToggle("노폐업일자")}
              disabled={formData.노폐업일자}
              checked={formData.노폐업일자}
            />
          </div>
        </div>

        {/* 영문 회사명 사항 */}
        <Divider align="left">
          <b>영문 회사명 사항</b>
        </Divider>
        <div className="form-list">
          <div className="column2">
            {renderInput("영문회사명", "영문회사명")}
            {renderInput("영문대표자", "영문대표자")}
          </div>
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
            {renderInput("영문주소", "영문주소")}
            {renderInput("영문상세주소", "상세주소")}
          </div>
        </div>

        {/* 저장/취소 버튼 */}
        <div className="mt-4 flex justify-center gap-2">
          <Button label="취소" severity="secondary" type="button" onClick={() => navigate(-1)} />
          <Button label="저장" type="submit" onClick={handleSubmit} />
        </div>
      </Card>
    </div>
  );
};

export default CompanyEntryFormPage;
