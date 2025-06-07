import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import React, { useState, useRef } from "react";

const AddUserEntry7104 = ({ onCloseFn, state, data }) => {
  const toast = useRef(null);
  const initialForm = {
    userID: data?.id ?? "",
    name: data?.name ?? "",
    department: data?.department ?? "",
    password: data?.password ?? "",
    extension: data?.extension ?? "",
    hireDate: data?.hireDate ? new Date(data.hireDate) : null,
    noHireDate: data?.noHireDate ?? false,
    resignationDate: data?.resignationDate ? new Date(data.resignationDate) : null,
    noResignationDate: data?.noResignationDate ?? false,
    useOperationSearch: data?.useOperationSearch ?? "미사용",
    useOfficeSearch: data?.useOfficeSearch ?? "미사용",
    usePOSearch: data?.usePOSearch ?? "미사용",
    useFieldSearch: data?.useFieldSearch ?? "미사용",
  };
  const [form, setForm] = useState(initialForm);

  const onChange = (field) => (e) => {
    const value = e.target ? e.target.value : e.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onCheckboxChange = (field) => (e) => {
    const checked = e.checked;
    setForm((prev) => ({
      ...prev,
      [field]: checked,
      [field === "noHireDate" ? "hireDate" : "resignationDate"]: checked
        ? null
        : prev[field === "noHireDate" ? "hireDate" : "resignationDate"],
    }));
  };

  const validateForm = () => {
    if (!form.name) {
      toast.current.show({
        severity: "error",
        summary: "오류",
        detail: "사원이름을 입력해주세요.",
      });
      return false;
    }
    if (!form.password) {
      toast.current.show({
        severity: "error",
        summary: "오류",
        detail: "비밀번호를 입력해주세요.",
      });
      return false;
    }
    if (!form.department) {
      toast.current.show({
        severity: "error",
        summary: "오류",
        detail: "부서를 선택해주세요.",
      });
      return false;
    }
    if (!form.noHireDate && !form.hireDate) {
      toast.current.show({
        severity: "error",
        summary: "오류",
        detail: "입사일을 선택해주세요.",
      });
      return false;
    }
    return true;
  };

  const saveData = () => {
    if (!validateForm()) return;

    const formData = {
      ...form,
      hireDate: form.hireDate ? form.hireDate.toISOString().split("T")[0] : null,
      resignationDate: form.resignationDate
        ? form.resignationDate.toISOString().split("T")[0]
        : null,
    };

    console.log(formData);
    onCloseFn(formData);
  };

  const departmentOptions = [
    { label: "총무팀", value: "총무팀" },
    { label: "영업팀", value: "영업팀" },
    { label: "현장팀", value: "현장팀" },
  ];

  return (
    <Dialog
      header={`사원 ${state}`}
      visible
      style={{ width: "50vw", maxWidth: "1000px" }}
      onHide={() => onCloseFn(null)}
    >
      <Toast ref={toast} />
      <div className="Dialog-container form-list">
        <div className="column2">
          {state !== "추가" && (
            <div className="form__input">
              <p>사원코드*</p>
              <InputText value={form.userID} onChange={onChange("userID")} disabled />
            </div>
          )}
          <div className="form__input">
            <p>입사일*</p>
            <Calendar
              locale="ko"
              value={form.hireDate}
              onChange={onChange("hireDate")}
              showIcon
              dateFormat="yy-mm-dd"
              disabled={form.noHireDate}
            />
            <Divider layout="vertical" className="mr-1 ml-1" />
            <div className="flex items-center">
              <Checkbox
                inputId="noHireDate"
                checked={form.noHireDate}
                onChange={onCheckboxChange("noHireDate")}
              />
              <label htmlFor="noHireDate" className="ml-2">
                없음
              </label>
            </div>
          </div>
        </div>

        <div className="column2">
          <div className="form__input">
            <p>사원이름*</p>
            <InputText value={form.name} onChange={onChange("name")} />
          </div>
          <div className="form__input">
            <p>퇴사일</p>
            <Calendar
              locale="ko"
              value={form.resignationDate}
              onChange={onChange("resignationDate")}
              showIcon
              dateFormat="yy-mm-dd"
              disabled={form.noResignationDate}
            />
            <Divider layout="vertical" className="mr-1 ml-1" />
            <div className="flex items-center">
              <Checkbox
                inputId="noResignationDate"
                checked={form.noResignationDate}
                onChange={onCheckboxChange("noResignationDate")}
              />
              <label htmlFor="noResignationDate" className="ml-2">
                없음
              </label>
            </div>
          </div>
        </div>

        <div className="column2">
          <div className="form__input">
            <p>비밀번호*</p>
            <InputText value={form.password} onChange={onChange("password")} />
          </div>
          <div className="form__input">
            <p>부서*</p>
            <Dropdown
              value={form.department}
              onChange={onChange("department")}
              options={departmentOptions}
              placeholder="부서 선택"
            />
          </div>
        </div>

        <div className="column2">
          <div className="form__input">
            <p>내선번호</p>
            <InputText
              value={form.extension}
              onChange={onChange("extension")}
              placeholder="내선번호 입력"
              keyfilter="int"
            />
          </div>
        </div>

        <div className="form__input">
          <p>
            운영관리 검색
            <Tooltip target=".tooltip-icon-01" />
            <i
              className="pi pi-info-circle tooltip-icon-01 ml-1"
              data-pr-tooltip="운영관리 프로그램 로그인 여부"
              data-pr-position="right"
              data-pr-at="right+5 top"
              data-pr-my="left center-2"
            ></i>
          </p>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <RadioButton
                inputId="operation1"
                name="운영관리"
                value="사용"
                onChange={onChange("useOperationSearch")}
                checked={form.useOperationSearch === "사용"}
              />
              <label htmlFor="operation1" className="ml-2">
                사용
              </label>
            </div>
            <div className="flex items-center">
              <RadioButton
                inputId="operation2"
                name="운영관리"
                value="미사용"
                onChange={onChange("useOperationSearch")}
                checked={form.useOperationSearch === "미사용"}
              />
              <label htmlFor="operation2" className="ml-2">
                미사용
              </label>
            </div>
          </div>
        </div>

        <div className="form__input">
          <p>
            사무실 검색
            <Tooltip target=".tooltip-icon-01" />
            <i
              className="pi pi-info-circle tooltip-icon-01 ml-1"
              data-pr-tooltip="사무실 관련 검색 여부"
              data-pr-position="right"
              data-pr-at="right+5 top"
              data-pr-my="left center-2"
            ></i>
          </p>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <RadioButton
                inputId="office1"
                name="사무실"
                value="사용"
                onChange={onChange("useOfficeSearch")}
                checked={form.useOfficeSearch === "사용"}
              />
              <label htmlFor="office1" className="ml-2">
                사용
              </label>
            </div>
            <div className="flex items-center">
              <RadioButton
                inputId="office2"
                name="사무실"
                value="미사용"
                onChange={onChange("useOfficeSearch")}
                checked={form.useOfficeSearch === "미사용"}
              />
              <label htmlFor="office2" className="ml-2">
                미사용
              </label>
            </div>
          </div>
        </div>

        <div className="form__input">
          <p>
            포스 검색
            <Tooltip target=".tooltip-icon-01" />
            <i
              className="pi pi-info-circle tooltip-icon-01 ml-1"
              data-pr-tooltip="포스에서 검색 여부"
              data-pr-position="right"
              data-pr-at="right+5 top"
              data-pr-my="left center-2"
            ></i>
          </p>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <RadioButton
                inputId="pos1"
                name="포스"
                value="사용"
                onChange={onChange("usePOSearch")}
                checked={form.usePOSearch === "사용"}
              />
              <label htmlFor="pos1" className="ml-2">
                사용
              </label>
            </div>
            <div className="flex items-center">
              <RadioButton
                inputId="pos2"
                name="포스"
                value="미사용"
                onChange={onChange("usePOSearch")}
                checked={form.usePOSearch === "미사용"}
              />
              <label htmlFor="pos2" className="ml-2">
                미사용
              </label>
            </div>
          </div>
        </div>

        <div className="form__input">
          <p>
            현장 검색
            <Tooltip target=".tooltip-icon-01" />
            <i
              className="pi pi-info-circle tooltip-icon-01 ml-1"
              data-pr-tooltip="현장관련 검색 여부"
              data-pr-position="right"
              data-pr-at="right+5 top"
              data-pr-my="left center-2"
            ></i>
          </p>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <RadioButton
                inputId="field1"
                name="현장"
                value="사용"
                onChange={onChange("useFieldSearch")}
                checked={form.useFieldSearch === "사용"}
              />
              <label htmlFor="field1" className="ml-2">
                사용
              </label>
            </div>
            <div className="flex items-center">
              <RadioButton
                inputId="field2"
                name="현장"
                value="미사용"
                onChange={onChange("useFieldSearch")}
                checked={form.useFieldSearch === "미사용"}
              />
              <label htmlFor="field2" className="ml-2">
                미사용
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="Dialog__btns mt-4 flex justify-end space-x-2">
        <Button label="취소" severity="secondary" onClick={() => onCloseFn(null)} />
        <Button label="저장" onClick={saveData} />
      </div>
    </Dialog>
  );
};

export default AddUserEntry7104;
