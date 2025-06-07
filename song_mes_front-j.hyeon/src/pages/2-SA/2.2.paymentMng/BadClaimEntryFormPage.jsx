/* 2.2.5.악성채권전환등록 폼 : C1020, SA-2205 */
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import useToastStore from "@/store/toastStore";
import { Dropdown } from "primereact/dropdown";
import useDialogStore from "@/store/dialogStore";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { formatNumberWithCommas } from "@/utils/common";

// 공통 입력 필드 컴포넌트
const FormInput = ({ label, required, children, className }) => (
  <div className="form__input">
    <p style={className ? { color: "red" } : undefined}>
      {label}
      {required && "*"}
    </p>
    {children}
  </div>
);

// 검색 버튼이 있는 입력 필드 컴포넌트
const SearchInput = ({ label, value = "", onSearch, type }) => (
  <div className="form__input common-search__input">
    <p>{label}</p>
    <span className="callList">{value}</span>
    <Button label="찾기" size="small" onClick={() => onSearch(type, label)} />
  </div>
);

const BadClaimEntryFormPage = () => {
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const isEdit = id ? "수정" : "추가";

  const [formData, setFormData] = useState(
    state?.formData || {
      거래처: null,
      전환일자: new Date(),
      보고일자: new Date(),
      보고자: null,
      전담당자: null,
      현담당자: null,
      책임사원1: null,
      책임사원2: null,
      발생유형: "분류",
      간략내용: "",
      특이사항: "",
      총채권금액: 0,
      악성전환금액: 0,
      요율1: 0,
      요율2: 0,
      원인및내용: "",
      재발방지대책: "",
    },
  );

  const selectOptions = {
    발생유형: ["분류", "유형1", "유형2", "유형3"],
  };

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

  const findList = (type, field) => {
    let dialogConfig = {
      onClose: (selectedItems) => {
        setFormData((prev) => ({
          ...prev,
          [field]: selectedItems,
        }));
      },
      isMultiple: false,
    };

    // 특정 다이얼로그에 대한 추가 설정
    if (type === "DGClientSelect1") {
      dialogConfig = {
        ...dialogConfig,
        state: "customer",
      };
    } else if (type === "DGManager") {
      dialogConfig = {
        ...dialogConfig,
        state: "manager",
      };
    } else if (type === "DGItemCodeList") {
      dialogConfig = {
        ...dialogConfig,
        type: "악성채권발생유형",
      };
    }

    openDialog(type, dialogConfig);
  };

  // 드롭다운 필드 렌더링 함수
  const renderDropdown = (label, required = false) => (
    <FormInput label={label} required={required}>
      <Dropdown
        id={label}
        name={label}
        value={formData[label]}
        onChange={handleChange}
        options={selectOptions[label]}
        placeholder={`${label}을(를) 선택해주세요.`}
      />
    </FormInput>
  );

  return (
    <div className="BadClaimEntryForm">
      <Card>
        <h3 className="BadClaimEntryForm__title">악성채권전환 {isEdit}</h3>
        <div className="form-list">
          <div className="column2">
            <SearchInput
              label="거래처"
              value={formData.거래처?.name || ""}
              onSearch={findList}
              type="DGClientSelect1"
            />
          </div>

          <div className="column2">
            <FormInput label="전환일자">
              <Calendar
                locale="ko"
                value={formData.전환일자}
                onChange={onDateChange("전환일자")}
                showIcon
                dateFormat="yy-mm-dd"
              />
            </FormInput>
            {/* {renderDropdown("발생유형")} */}
            <SearchInput
              label="발생유형"
              value={formData.발생유형 || ""}
              onSearch={findList}
              type="DGItemCodeList"
            />
          </div>

          <div className="column2">
            <FormInput label="보고일자">
              <Calendar
                locale="ko"
                value={formData.보고일자}
                onChange={onDateChange("보고일자")}
                showIcon
                dateFormat="yy-mm-dd"
              />
            </FormInput>
            <FormInput label="간략사유">
              <InputText
                value={formData.간략내용}
                onChange={handleChange}
                name="간략사유"
                rows={2}
                placeholder="간략사유"
              />
            </FormInput>
          </div>

          <div className="column2">
            <SearchInput
              label="보고자"
              value={formData.보고자?.name || ""}
              onSearch={findList}
              type="DGManager"
            />
            <FormInput label="특이사항">
              <InputText
                value={formData.특이사항}
                onChange={handleChange}
                name="특이사항"
                rows={2}
                placeholder="특이사항"
              />
            </FormInput>
          </div>

          <div className="column2">
            <SearchInput
              label="전담당자"
              value={formData.전담당자?.name || ""}
              onSearch={findList}
              type="DGManager"
            />
            <FormInput label="총채권금액" className="text-red">
              <InputNumber
                value={formData.총채권금액}
                onValueChange={onNumberChange("총채권금액")}
              />
            </FormInput>
          </div>

          <div className="column2">
            <SearchInput
              label="현담당자"
              value={formData.현담당자?.name || ""}
              onSearch={findList}
              type="DGManager"
            />
            <FormInput label="악성전환금액" className="text-red">
              <InputNumber
                value={formData.악성전환금액}
                onValueChange={onNumberChange("악성전환금액")}
              />
            </FormInput>
          </div>

          <div className="column2">
            <SearchInput
              label="책임사원1"
              value={formData.책임사원1?.name || ""}
              onSearch={findList}
              type="DGManager"
            />
            <FormInput label="요율">
              <InputNumber
                value={formData.요율1}
                onValueChange={onNumberChange("요율1")}
                max={100}
                style={{ width: "100px" }}
              />
              <span>
                % ({formatNumberWithCommas((formData.총채권금액 * formData.요율1) / 100)})
              </span>
            </FormInput>
          </div>

          <div className="column2">
            <SearchInput
              label="책임사원2"
              value={formData.책임사원2?.name || ""}
              onSearch={findList}
              type="DGManager"
            />
            <FormInput label="요율">
              <InputNumber
                value={formData.요율2}
                onValueChange={onNumberChange("요율2")}
                max={100}
                style={{ width: "100px" }}
              />
              <span>
                % ({formatNumberWithCommas((formData.총채권금액 * formData.요율2) / 100)})
              </span>
            </FormInput>
          </div>

          <div className="form__input">
            <p>원인 및 내용</p>
            <InputTextarea
              value={formData.원인및내용}
              onChange={handleChange}
              name="원인및내용"
              rows={5}
              placeholder="원인 및 내용을 입력해주세요"
            />
          </div>

          <div className="form__input">
            <p>재발 방지 대책</p>
            <InputTextarea
              value={formData.재발방지대책}
              onChange={handleChange}
              name="재발방지대책"
              rows={5}
              placeholder="재발 방지 대책을 입력해주세요"
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

export default BadClaimEntryFormPage;
