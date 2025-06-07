import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { Divider } from "primereact/divider";
import { InputSwitch } from "primereact/inputswitch";
import { Combo_Comm_Setting } from "@/utils/comboSetting";

const StyleGuideTab1 = () => {
  // Calendar states
  const [date, setDate] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  // Dropdown states
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState(null);
  const [selectedUseYn, setSelectedUseYn] = useState(null);
  const [selectedCustStatus, setSelectedCustStatus] = useState(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
  const [selectedPurchaseType, setSelectedPurchaseType] = useState(null);
  const [selectedOutStatus, setSelectedOutStatus] = useState(null);
  const [selectedOrderType, setSelectedOrderType] = useState(null);
  const [selectedProcessStatus, setSelectedProcessStatus] = useState(null);
  const [selectedManageStatus, setSelectedManageStatus] = useState(null);
  const [selectedPurchaseProd, setSelectedPurchaseProd] = useState(null);
  const [selectedEmpStatus, setSelectedEmpStatus] = useState(null);

  // Checkbox & Radio states
  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState(null);

  // InputSwitch states
  const [switchValue, setSwitchValue] = useState(false);

  return (
    <div>
      <section className="style-guide__section">
        <h2 className="style-guide__title">🧩 Buttons</h2>
        <div className="style-guide__button-group">
          <Button label="Primary" />
          <Button label="Secondary" severity="secondary" />
          <Button label="Success" severity="success" />
          <Button label="Info" severity="info" />
          <Button label="Warning" severity="warning" />
          <Button label="Help" severity="help" />
          <Button label="Danger" severity="danger" />
          <Button label="Disabled" disabled />
          <Button label="Loading" loading />
          <Button icon="pi pi-check" />
          <Button label="Submit" icon="pi pi-check" />
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__title">📝 Inputs</h2>
        <div className="style-guide__input-group">
          <InputText type="text" placeholder="Normal" />
          <InputText keyfilter="int" placeholder="숫자만 입력" />
          <InputText type="text" placeholder="경고" invalid />
          <div className="p-inputgroup">
            <InputText placeholder="검색" name="search" id="search" />
            <Button icon="pi pi-search" />
          </div>
        </div>
      </section>
      <section className="style-guide__section">
        <h2 className="style-guide__title">📝 InputsNumber </h2>
        <div className="style-guide__input-group">
          <InputNumber type="number" placeholder="숫자만 입력" min="0" max="9" />
          <InputNumber type="number" placeholder="경고" invalid />
        </div>
      </section>
      <section className="style-guide__section">
        <h2 className="style-guide__title">📝 Textarea</h2>
        <div className="style-guide__input-group">
          <InputTextarea name="비고" rows={5} placeholder="비고를 입력해주세요" autoResize />
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__title">📅 Calendar</h2>
        <div className="style-guide__input-group">
          <div className="form-list">
            <div className="form__input">
              <p>날짜 선택</p>
              <div className="flex items-center">
                <Calendar
                  value={date}
                  onChange={(e) => setDate(e.value)}
                  locale="ko"
                  showIcon
                  dateFormat="yy-mm-dd"
                />
              </div>
            </div>
          </div>
          <div className="form-list">
            <div className="form__input">
              <p>범위 선택</p>
              <div className="flex items-center">
                <Calendar
                  value={dateRange}
                  onChange={(e) => setDateRange(e.value)}
                  locale="ko"
                  showIcon
                  dateFormat="yy-mm-dd"
                  selectionMode="range"
                  readOnlyInput
                  hideOnRangeSelection
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__title">🔍 Dropdown & MultiSelect</h2>
        <div className="style-guide__dropdown-group">
          <Dropdown
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.value)}
            options={[
              { name: "서울", code: "SEL" },
              { name: "부산", code: "BSN" },
              { name: "대구", code: "DGU" },
              { name: "인천", code: "ICN" },
              { name: "광주", code: "GWJ" },
              { name: "대전", code: "DJN" },
              { name: "울산", code: "USN" },
            ]}
            optionLabel="name"
            placeholder="도시 선택"
          />
          <MultiSelect
            emptyFilterMessage="검색 결과가 없습니다."
            filter
            value={selectedDepartments}
            onChange={(e) => setSelectedDepartments(e.value)}
            options={[
              { name: "영업부", code: "SALES" },
              { name: "인사부", code: "HR" },
              { name: "개발부", code: "DEV" },
              { name: "마케팅부", code: "MKT" },
              { name: "경리부", code: "ACCT" },
              { name: "무역부", code: "TRADE" },
            ]}
            optionLabel="name"
            placeholder="부서 다중 선택"
          />
          <Divider />
          <h3>공통함수 : Combo_Comm_Setting</h3>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="form-list">
              <div className="form__input">
                <p>날짜 선택</p>
                <div className="flex items-center">
                  <Dropdown
                    value={selectedUseYn}
                    onChange={(e) => setSelectedUseYn(e.value)}
                    options={Combo_Comm_Setting(0, 0)}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="사용여부 선택"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            <div className="form-list">
              <div className="form__input">
                <p>거래처상태</p>
                <div className="flex items-center">
                  <Dropdown
                    value={selectedCustStatus}
                    onChange={(e) => setSelectedCustStatus(e.value)}
                    options={Combo_Comm_Setting(1, 0)}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="거래처상태 선택"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="form-list">
              <div className="form__input">
                <p>수주서상태</p>
                <div className="flex items-center">
                  <Dropdown
                    value={selectedOrderStatus}
                    onChange={(e) => setSelectedOrderStatus(e.value)}
                    options={Combo_Comm_Setting(2)}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="수주서상태 선택"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="form-list">
              <div className="form__input">
                <p>매입구분</p>
                <div className="flex items-center">
                  <Dropdown
                    value={selectedPurchaseType}
                    onChange={(e) => setSelectedPurchaseType(e.value)}
                    options={Combo_Comm_Setting(3, 0)}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="매입구분 선택"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="form-list">
              <div className="form__input">
                <p>출고상태</p>
                <div className="flex items-center">
                  <Dropdown
                    value={selectedOutStatus}
                    onChange={(e) => setSelectedOutStatus(e.value)}
                    options={Combo_Comm_Setting(4)}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="출고상태 선택"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="form-list">
              <div className="form__input">
                <p>발주구분</p>
                <div className="flex items-center">
                  <Dropdown
                    value={selectedOrderType}
                    onChange={(e) => setSelectedOrderType(e.value)}
                    options={Combo_Comm_Setting(5, 0)}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="발주구분 선택"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="form-list">
              <div className="form__input">
                <p>처리상태</p>
                <div className="flex items-center">
                  <Dropdown
                    value={selectedProcessStatus}
                    onChange={(e) => setSelectedProcessStatus(e.value)}
                    options={Combo_Comm_Setting(6, 0)}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="처리상태 선택"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="form-list">
              <div className="form__input">
                <p>관리상태</p>
                <div className="flex items-center">
                  <Dropdown
                    value={selectedManageStatus}
                    onChange={(e) => setSelectedManageStatus(e.value)}
                    options={Combo_Comm_Setting(7)}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="관리상태 선택"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="form-list">
              <div className="form__input">
                <p>구매/생산 구분</p>
                <div className="flex items-center">
                  <Dropdown
                    value={selectedPurchaseProd}
                    onChange={(e) => setSelectedPurchaseProd(e.value)}
                    options={Combo_Comm_Setting(8)}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="구매/생산 구분 선택"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="form-list">
              <div className="form__input">
                <p>재직상태</p>
                <div className="flex items-center">
                  <Dropdown
                    value={selectedEmpStatus}
                    onChange={(e) => setSelectedEmpStatus(e.value)}
                    options={Combo_Comm_Setting(9, 0)}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="재직상태 선택"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__title">✅ Checkbox & Radio</h2>
        <div className="style-guide__input-group">
          <div className="flex items-center ">
            <Checkbox checked={checked} onChange={(e) => setChecked(e.checked)} id="check" />
            <label htmlFor="check" className="ml-2">
              동의합니다
            </label>
          </div>
          <div className="flex items-center ">
            <RadioButton
              value="option1"
              checked={radioValue === "option1"}
              onChange={(e) => setRadioValue(e.value)}
              id="option1"
            />
            <label htmlFor="option1" className="ml-2">
              옵션 1
            </label>
          </div>
          <div className="flex items-center ">
            <RadioButton
              value="option2"
              checked={radioValue === "option2"}
              onChange={(e) => setRadioValue(e.value)}
              id="option2"
            />
            <label htmlFor="option2" className="ml-2">
              옵션 2
            </label>
          </div>
          <div className="flex items-center ">
            <RadioButton
              value="option3"
              checked={radioValue === "option3"}
              onChange={(e) => setRadioValue(e.value)}
              id="option3"
            />
            <label htmlFor="option3" className="ml-2">
              옵션 3
            </label>
          </div>
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__title">🔄 InputSwitch</h2>
        <div className="style-guide__input-group">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <InputSwitch checked={switchValue} onChange={(e) => setSwitchValue(e.value)} />
              <label className="ml-2">기본 스위치</label>
            </div>
            <div className="flex items-center">
              <InputSwitch checked={true} disabled />
              <label className="ml-2">비활성화된 스위치</label>
            </div>
          </div>
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__title">💡 Tooltip</h2>
        <div className="style-guide__tooltip-group">
          <div className="flex flex-wrap gap-4">
            <div>
              <Button
                label="기본 툴팁"
                tooltip="기본 툴팁 메시지입니다."
                tooltipOptions={{ position: "top" }}
              />
            </div>
            <div>
              <Button
                label="우측 툴팁"
                tooltip="우측에 표시되는 툴팁입니다."
                tooltipOptions={{ position: "right" }}
              />
            </div>
            <div>
              <Button
                label="하단 툴팁"
                tooltip="하단에 표시되는 툴팁입니다."
                tooltipOptions={{ position: "bottom" }}
              />
            </div>
            <div>
              <Button
                label="좌측 툴팁"
                tooltip="좌측에 표시되는 툴팁입니다."
                tooltipOptions={{ position: "left" }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StyleGuideTab1;
