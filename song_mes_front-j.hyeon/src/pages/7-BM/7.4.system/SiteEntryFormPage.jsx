// 7.4.2.사업장등록	A0015	siteEntry	BM-7402

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
import useDialogStore from "@/store/dialogStore";

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

const SiteEntryFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const state = id ? "수정" : "추가";
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);

  const [formData, setFormData] = useState({
    회사코드: id ?? "",
    더존전송회사ID: "",
    사업장명: "",
    사용여부: "사용",
    대표자: "",
    구분: "본점",
    사업자번호: "",
    법인번호: "",
    우편번호: "",
    주소: "",
    상세주소: "",
    전화번호: "",
    팩스번호: "",
    업태: "",
    업종: "",
    개업일자: null,
    폐업일자: null,
    노개업일자: false,
    노폐업일자: false,
    세무소코드: {},
    주업종코드: {},
    신고방법: "월별",
    전자신고ID: "",
    납세지: "",
    신고사업장명: "",
    지방세신고지1: "",
    지방세신고지2: "",
    지방세구분: {},
    세부납부방법: "개별",
    집계사업장: "",
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
    구분: ["본점", "지점"],
    사용여부: ["사용", "미사용"],
    신고방법: ["월별", "반기"],
    집계사업장: ["집계사업장", "(주)송운사"],
    세부납부방법: ["개별", "총괄"],
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

  const handleSearch = (field) => {
    if (field === "세무소코드") {
      openDialog("DGCommonCode1", {
        state: "taxo",
        onClose: (selectedItems) => {
          setFormData((prev) => ({
            ...prev,
            [field]: selectedItems,
          }));
        },
      });
    } else if (field === "지방세구분") {
      openDialog("DGCommonCode1", {
        state: "corp",
        onClose: (selectedItems) => {
          setFormData((prev) => ({
            ...prev,
            [field]: selectedItems,
          }));
        },
      });
    } else if (field === "주업종코드") {
      openDialog("DGCommonCode2", {
        state: "Sbusiness",
        onClose: (selectedItems) => {
          setFormData((prev) => ({
            ...prev,
            [field]: selectedItems,
          }));
        },
      });
    } else if (field === "지방세신고지1" || field === "지방세신고지2") {
      openDialog("DGCommonCode2", {
        state: "Sbebgong",
        onClose: (selectedItems) => {
          setFormData((prev) => ({
            ...prev,
            [field]: selectedItems,
          }));
        },
      });
    }
  };
  return (
    <div className="SiteEntryForm">
      <Card>
        <h3 className="SiteEntryForm__title">사업장 {state}</h3>
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
            {renderInput("사업장명", "사업장명", true)}
            {renderDropdown("사용여부", "사용여부", "사용여부", true)}
          </div>
          <div className="column2">
            {renderInput("대표자", "대표자")}
            {renderDropdown("구분", "구분", "구분", true)}
          </div>
          <div className="column2">{renderInput("사업자번호", "사업자번호", true)}</div>
          <div className="column2">{renderInput("법인번호", "법인번호", true)}</div>
          <div className="column2">
            <div className="form__input">
              <p>사업장 주소</p>
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
            {renderInput("주소", "주소")}
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
          <div>
            <div className="column2">
              {renderDropdown("세부납부방법", "세부납부방법", "세부납부방법")}
              {formData.세부납부방법 === "총괄" && (
                <div className="form__input">
                  <p>집계사업장</p>
                  <Dropdown
                    id="집계사업장"
                    name="집계사업장"
                    value={formData.집계사업장}
                    onChange={handleChange}
                    options={selectOptions.집계사업장}
                    placeholder={`집계사업장을 선택해주세요.`}
                  />
                  <p>사업장코드</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 세무 신고 관련 */}
        <Divider align="left">
          <b>세무 신고 관련</b>
        </Divider>
        <div className="form-list">
          <div className="column2">
            <div className="form__input">
              <p>세무소코드</p>
              <div className="common-search__input">
                <InputText
                  id="세무소코드"
                  name="세무소코드"
                  value={
                    (formData.세무소코드?.code || "") + " " + (formData.세무소코드?.name || "")
                  }
                  disabled
                />
                <Button label="검색" onClick={() => handleSearch("세무소코드")} />
              </div>
            </div>
            <div className="form__input">
              <p>주업종코드</p>
              <div className="common-search__input">
                <InputText
                  id="주업종코드"
                  name="주업종코드"
                  value={
                    (formData.주업종코드?.code || "") + " " + (formData.주업종코드?.name || "")
                  }
                  disabled
                />
                <Button label="검색" onClick={() => handleSearch("주업종코드")} />
              </div>
            </div>
          </div>
          <div className="column2">
            {renderDropdown("신고방법", "신고방법", "신고방법")}
            {renderInput("전자신고ID", "전자신고ID")}
          </div>
          <div className="column2">
            {renderInput("납세지", "납세지")}
            {renderInput("신고사업장명", "신고사업장명")}
          </div>
          <div className="column2">
            {renderInput("전화번호", "전화번호")}
            {renderInput("팩스번호", "팩스번호")}
          </div>
          <div>
            <div className="form__input">
              <p>
                지방세신고지
                <br />
                (행정동)
              </p>
              <div className="common-search__input">
                <InputText
                  id="지방세신고지1"
                  name="지방세신고지1"
                  value={
                    (formData.지방세신고지1?.code || "") +
                    " " +
                    (formData.지방세신고지1?.name || "")
                  }
                  disabled
                />
                <Button label="검색" onClick={() => handleSearch("지방세신고지1")} />
              </div>
            </div>
          </div>
          <div>
            <div className="form__input">
              <p>
                지방세신고지
                <br />
                (법정동)
              </p>
              <div className="common-search__input">
                <InputText
                  id="지방세신고지2"
                  name="지방세신고지2"
                  value={
                    (formData.지방세신고지2?.code || "") +
                    " " +
                    (formData.지방세신고지2?.name || "")
                  }
                  disabled
                />
                <Button label="검색" onClick={() => handleSearch("지방세신고지2")} />
              </div>
            </div>
          </div>
          <div>
            <div className="form__input">
              <p>지방세구분</p>
              <div className="common-search__input">
                <InputText
                  id="지방세구분"
                  name="지방세구분"
                  value={
                    (formData.지방세구분?.code || "") + " " + (formData.지방세구분?.name || "")
                  }
                  disabled
                />
                <Button label="검색" onClick={() => handleSearch("지방세구분")} />
              </div>
            </div>
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

export default SiteEntryFormPage;
