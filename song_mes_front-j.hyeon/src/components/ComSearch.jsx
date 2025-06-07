import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { customSelectOptions } from "@/config/selectOptions";
import { customMultiSelectOptions } from "@/config/multiSelectOptions";
import { callList, checkboxName, dateName, inputName, selectName } from "@/config/inputItem";
import useDialogStore from "@/store/dialogStore";
import { Checkbox } from "primereact/checkbox";
import { formatDates } from "@/utils/common";
import { MultiSelect } from "primereact/multiselect";
import { Tooltip } from "primereact/tooltip";

/**
 * 
  const searchCategory = {
    pageCode: 2201,
    text: [],
    dates: [{
      label:"조회기간",
      startDate:"1MonthAgo",
      endDate:"today",
    }],
    dateText: ["연습용"],
    select: ["전표처리"],
    callList: [],
    detailedSearch: {
      isUse: true,
      detailList: {
        text: ["거래처"],
        select: [],
        callList: ["담당자"],
        dateText: ["입금번호"],
      },
    },
  };
 */

// 분리된 SelectField 컴포넌트
const SelectField = ({
  koName,
  EgName,
  pageCode,
  saveObject,
  setSaveObject,
  sampleOptions,
  pageCustom,
  disabled,
}) => {
  const fieldId = `${pageCode}-${EgName}`;
  const isNumeric = /^\d+$/.test(String(EgName));
  const value = isNumeric ? saveObject[koName] : saveObject[EgName] || null;

  const handleChange = (e) => {
    if (disabled) return;
    const key = isNumeric ? koName : EgName;
    setSaveObject((prev) => ({
      ...prev,
      [key]: e.value,
    }));
  };

  // 커스텀 옵션 로직
  if (isNumeric) {
    const customOption = pageCustom?.find((item) => item.name === koName);
    if (customOption) {
      // data가 함수인 경우 함수를 실행하여 옵션 생성
      const options =
        typeof customOption.data === "function"
          ? customOption.data() // Combo_Comm_Setting 함수는 이미 { value, label } 형식의 배열을 반환
          : customOption.data; // 이미 { value, label } 형식으로 되어있으므로 그대로 사용

      // default 값이 있는 경우 초기값 설정
      useEffect(() => {
        if (customOption.default && !value) {
          setSaveObject((prev) => ({
            ...prev,
            [koName]: customOption.default,
          }));
        }
      }, [customOption.default, koName, value]);

      return (
        <div className="common-search__input" key={EgName}>
          <label htmlFor={fieldId}>{customOption.label}</label>
          <span className="w-fix">
            <Dropdown
              value={value || customOption.default}
              onChange={handleChange}
              options={options}
              optionLabel="label"
              optionValue="value"
              name={EgName}
              id={fieldId}
              placeholder={customOption.placeholder}
              disabled={disabled}
            />
          </span>
        </div>
      );
    }
  }

  // 기본 샘플 옵션
  return (
    <div className="common-search__input" key={EgName}>
      <label htmlFor={fieldId}>{koName}</label>
      <span className="w-fix">
        <Dropdown
          value={value}
          onChange={handleChange}
          options={sampleOptions}
          optionLabel="name"
          optionValue="code"
          name={EgName}
          id={fieldId}
          placeholder={`-- ${koName} 선택 --`}
          disabled={disabled}
        />
      </span>
    </div>
  );
};

// 분리된 DateField 컴포넌트
const DateField = ({ dateItem, pageCode, saveObject, setSaveObject, disabled }) => {
  const [dateValue, setDateValue] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(dateItem.labelOptions?.[0] || dateItem.label);

  // 부도일자일 경우 확인
  const isBouncedDate =
    dateItem.labelOptions?.find((label) => label === "부도일자") && selectedLabel === "부도일자";
  const isRange = dateItem.startDate && dateItem.endDate && !isBouncedDate;

  // dateName에서 해당 라벨에 맞는 EgName 찾기
  const getEgNameForLabel = (label) => {
    const dateItem = dateName.find((item) => item.koName === label);
    return dateItem ? dateItem.EgName : pageCode;
  };

  useEffect(() => {
    if (isBouncedDate) {
      const date = formatDates("today");
      setDateValue(date);
      setSaveObject((prev) => ({
        ...prev,
        [dateItem.EgName]: date,
      }));
    } else if (isRange) {
      const start = formatDates(dateItem.startDate);
      const end = formatDates(dateItem.endDate);
      setDateValue([start, end]);
      setSaveObject((prev) => ({
        ...prev,
        [`${dateItem.EgName}_start`]: start,
        [`${dateItem.EgName}_end`]: end,
        [dateItem.EgName]: getEgNameForLabel(selectedLabel),
      }));
    } else {
      const start = formatDates(dateItem.startDate || "today");
      setDateValue(start);
      setSaveObject((prev) => ({
        ...prev,
        [dateItem.EgName]: start,
      }));
    }
  }, [dateItem, isRange, setSaveObject, selectedLabel, isBouncedDate]);

  // saveObject가 변경될 때 dateValue 업데이트
  useEffect(() => {
    if (isBouncedDate) {
      const value = saveObject[dateItem.EgName];
      if (value) {
        setDateValue(value);
      }
    } else if (isRange) {
      const start = saveObject[`${dateItem.EgName}_start`];
      const end = saveObject[`${dateItem.EgName}_end`];
      if (start && end) {
        setDateValue([start, end]);
      }
    } else {
      const value = saveObject[dateItem.EgName];
      if (value) {
        setDateValue(value);
      }
    }
  }, [saveObject, dateItem.EgName, isRange, isBouncedDate]);

  const handleDateChange = (e) => {
    if (disabled) return;

    setDateValue(e.value);
    if (isBouncedDate) {
      setSaveObject((prev) => ({
        ...prev,
        [dateItem.EgName]: e.value,
      }));
    } else if (isRange) {
      setSaveObject((prev) => ({
        ...prev,
        [`${dateItem.EgName}_start`]: e.value[0],
        [`${dateItem.EgName}_end`]: e.value[1],
      }));
    } else {
      setSaveObject((prev) => ({
        ...prev,
        [dateItem.EgName]: e.value,
      }));
    }
  };

  const handleLabelChange = (e) => {
    if (disabled) return;
    console.log("handleLabelChange:", e);
    setSelectedLabel(e.value);
    setSaveObject((prev) => ({
      ...prev,
      [dateItem.EgName]: getEgNameForLabel(e.value),
    }));
  };

  return (
    <div className="common-search__input" key={dateItem.EgName}>
      {dateItem.labelOptions ? (
        <div className="flex gap-2 items-center">
          <Dropdown
            value={selectedLabel}
            options={dateItem.labelOptions}
            onChange={handleLabelChange}
            className="w-32"
            disabled={disabled}
            placeholder="선택"
          />
          <Calendar
            value={dateValue}
            onChange={handleDateChange}
            locale="ko"
            showIcon
            dateFormat="yy-mm-dd"
            selectionMode={isRange ? "range" : "single"}
            readOnlyInput
            hideOnRangeSelection
            disabled={disabled}
            className="w-fix"
          />
          {isBouncedDate && <span className="mr-6">이전</span>}
        </div>
      ) : (
        <>
          <label htmlFor={`${pageCode}-${dateItem.EgName}`}>
            {dateItem.koName}
            {dateItem.isHelp && showHelp(pageCode)}
          </label>
          <Calendar
            value={dateValue}
            onChange={handleDateChange}
            locale="ko"
            showIcon
            dateFormat="yy-mm-dd"
            selectionMode={isRange ? "range" : "single"}
            readOnlyInput
            hideOnRangeSelection
            disabled={disabled}
            className="w-fix"
          />
        </>
      )}
    </div>
  );
};

// 분리된 DateTextField 컴포넌트
const DateTextField = ({ dateItem, pageCode, saveObject, setSaveObject, disabled }) => {
  const [dateValue, setDateValue] = useState(null);
  const [textValue, setTextValue] = useState("");

  useEffect(() => {
    const date = formatDates("today");
    setDateValue(date);
    setTextValue("");
    setSaveObject((prev) => ({
      ...prev,
      [`${dateItem.EgName}_date`]: date,
      [`${dateItem.EgName}_text`]: "",
    }));
  }, [dateItem.EgName, setSaveObject]);

  // saveObject가 변경될 때 dateValue와 textValue 업데이트
  useEffect(() => {
    const date = saveObject[`${dateItem.EgName}_date`];
    const text = saveObject[`${dateItem.EgName}_text`];
    if (date) {
      setDateValue(date);
    }
    if (text !== undefined) {
      setTextValue(text);
    }
  }, [saveObject, dateItem.EgName]);

  const handleDateChange = (e) => {
    if (disabled) return;
    setDateValue(e.value);
    setSaveObject((prev) => ({
      ...prev,
      [`${dateItem.EgName}_date`]: e.value,
    }));
  };

  const handleTextChange = (e) => {
    if (disabled) return;
    setTextValue(e.target.value);
    setSaveObject((prev) => ({
      ...prev,
      [`${dateItem.EgName}_text`]: e.target.value,
    }));
  };

  return (
    <div className="common-search__input" key={dateItem.EgName}>
      <label htmlFor={`${pageCode}-${dateItem.EgName}`}>{dateItem.koName}</label>
      <div className="flex gap-2 w-fix dateTextField">
        <Calendar
          value={dateValue}
          onChange={handleDateChange}
          locale="ko"
          showIcon
          dateFormat="yy-mm-dd"
          readOnlyInput
          disabled={disabled}
        />
        <InputText
          value={textValue}
          onChange={handleTextChange}
          placeholder={`${dateItem.koName}`}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

// 검색 페이지 헬프 툴팁
const showHelp = (pageCode) => {
  const helpList = {
    2203: "2019년 이후 조회 가능",
    2204: "2020년 이전만 조회 가능(구ERP DB)",
  };

  return (
    <>
      <Tooltip target=".tooltip-icon-01" />
      <i
        className="pi pi-question-circle tooltip-icon-01 ml-2"
        data-pr-tooltip={helpList[pageCode]}
        data-pr-position="right"
        data-pr-at="right+5 top"
        data-pr-my="left center-2"
      ></i>
    </>
  );
};

const ComSearch = ({ searchCategory, setSaveObject: setsendObject, disabled }) => {
  const [inputConfig, setInputConfig] = useState({});
  const [saveObject, setSaveObject] = useState({});
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const openDialog = useDialogStore((s) => s.openDialog);

  const sample = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  useEffect(() => {
    // 렌더링용 config 생성
    const inputs = inputName.filter(({ koName }) => searchCategory?.text?.includes(koName));
    const selects = searchCategory?.select?.map((selKey) => {
      const found = selectName.find(({ koName }) => koName === selKey);
      return found ? found : { koName: selKey, EgName: searchCategory.pageCode };
    });
    const multiSelects = searchCategory?.multiSelect?.map((selKey) => {
      const found = selectName.find(({ koName }) => koName === selKey);
      const customOption = customMultiSelectOptions
        .find((opt) => opt.code === searchCategory.pageCode)
        ?.selectlist.find((item) => item.name === selKey);
      return found ? found : { koName: selKey, EgName: customOption?.EgName || selKey };
    });
    const calls = callList.filter(({ koName }) => searchCategory?.callList?.includes(koName));
    const checkbox = searchCategory?.checkbox?.map((cbKey) => {
      const found = checkboxName.find(({ koName }) => koName === cbKey);
      return found ? found : { koName: cbKey, EgName: searchCategory.pageCode };
    });
    const dates = searchCategory?.dates?.map((dateItem) => {
      const found = dateName.find(({ koName }) => koName === dateItem.label);
      return {
        koName: dateItem.label,
        EgName: found?.EgName || searchCategory.pageCode,
        startDate: dateItem.startDate,
        endDate: dateItem.endDate,
        isHelp: dateItem.isHelp,
        labelOptions: dateItem.labelOptions,
      };
    });

    // 메인 검색 영역의 dateText 필드 처리
    const dateTexts = searchCategory?.dateText?.map((label) => {
      const found = dateName.find(({ koName }) => koName === label);
      return {
        koName: label,
        EgName: found?.EgName || searchCategory.pageCode,
        label,
      };
    });

    // 상세검색의 dateText 필드 처리
    const detailDateTexts = searchCategory?.detailedSearch?.detailList?.dateText?.map((label) => {
      const found = dateName.find(({ koName }) => koName === label);
      return {
        koName: label,
        EgName: found?.EgName || searchCategory.pageCode,
        label,
      };
    });

    // 상세검색의 select 필드 처리
    const detailSelects = searchCategory?.detailedSearch?.detailList?.select?.map((selKey) => {
      const found = selectName.find(({ koName }) => koName === selKey);
      return found ? found : { koName: selKey, EgName: searchCategory.pageCode };
    });

    // 상세검색의 multiSelect 필드 처리
    const detailMultiSelects = searchCategory?.detailedSearch?.detailList?.multiSelect?.map(
      (selKey) => {
        const found = selectName.find(({ koName }) => koName === selKey);
        const customOption = customMultiSelectOptions
          .find((opt) => opt.code === searchCategory.pageCode)
          ?.selectlist.find((item) => item.name === selKey);
        return found ? found : { koName: selKey, EgName: customOption?.EgName || selKey };
      },
    );

    // saveObject 초기값 설정 - 기존 값 유지하면서 새로운 필드만 초기화
    const saveObj = { ...saveObject };

    // 새로운 필드들만 초기화
    inputs?.forEach(({ EgName }) => {
      if (!(EgName in saveObj)) saveObj[EgName] = "";
    });
    selects?.forEach(({ koName, EgName }) => {
      const key = /^\d+$/.test(String(EgName)) ? koName : EgName;
      if (!(key in saveObj)) saveObj[key] = "";
    });

    multiSelects?.forEach(({ koName, EgName }) => {
      if (!(EgName in saveObj)) {
        const customOption = customMultiSelectOptions
          .find((opt) => opt.code === searchCategory.pageCode)
          ?.selectlist.find((item) => item.name === koName);

        const defaultValues =
          customOption?.data?.filter((item) => item.default)?.map((item) => item.value) || [];
        saveObj[EgName] = defaultValues;
      }
    });

    calls?.forEach(({ EgName }) => {
      if (!(EgName in saveObj)) saveObj[EgName] = [];
    });
    checkbox?.forEach(({ EgName }) => {
      if (!(EgName in saveObj)) saveObj[EgName] = false;
    });
    dates?.forEach(({ startDate, endDate, EgName }) => {
      if (startDate && endDate) {
        if (!(`${EgName}_start` in saveObj)) saveObj[`${EgName}_start`] = formatDates(startDate);
        if (!(`${EgName}_end` in saveObj)) saveObj[`${EgName}_end`] = formatDates(endDate);
      } else {
        if (!(EgName in saveObj)) saveObj[EgName] = formatDates(startDate || "today");
      }
    });

    // 메인 검색 영역의 dateText 필드 초기화
    dateTexts?.forEach(({ EgName }) => {
      if (!(`${EgName}_date` in saveObj)) saveObj[`${EgName}_date`] = formatDates("today");
      if (!(`${EgName}_text` in saveObj)) saveObj[`${EgName}_text`] = "";
    });

    // 상세검색의 dateText 필드 초기화
    detailDateTexts?.forEach(({ EgName }) => {
      if (!(`${EgName}_date` in saveObj)) saveObj[`${EgName}_date`] = formatDates("today");
      if (!(`${EgName}_text` in saveObj)) saveObj[`${EgName}_text`] = "";
    });

    // 상세검색의 select 필드 초기화
    detailSelects?.forEach(({ koName }) => {
      if (!(koName in saveObj)) saveObj[koName] = "";
    });

    // 상세검색의 multiSelect 필드 초기화
    detailMultiSelects?.forEach(({ EgName }) => {
      if (!(EgName in saveObj)) saveObj[EgName] = [];
    });

    // 상세검색의 select 필드 초기화
    detailSelects?.forEach(({ koName }) => {
      if (!(koName in saveObj)) saveObj[koName] = "";
    });

    // 상세검색의 multiSelect 필드 초기화
    detailMultiSelects?.forEach(({ EgName }) => {
      if (!(EgName in saveObj)) saveObj[EgName] = [];
    });

    setInputConfig({
      pageCode: searchCategory.pageCode,
      inputs,
      selects,
      multiSelects,
      calls,
      checkbox,
      dates,
      dateTexts,
      detailDateTexts,
      detailSelects,
      detailMultiSelects,
    });

    setSaveObject(saveObj);
  }, [searchCategory]);

  // 수정예정. 공통 함수 사용해야 함.
  const pageCustom = customSelectOptions.find(
    (opt) => opt.code === inputConfig.pageCode,
  )?.selectlist;

  const pageMultiCustom = customMultiSelectOptions.find(
    (opt) => opt.code === inputConfig.pageCode,
  )?.selectlist;

  const findList = (EgName) => {
    if (disabled) return;

    // 기본 콜리스트에서 찾기
    let callItem = inputConfig.calls?.find((item) => item.EgName === EgName);

    // 상세검색의 콜리스트에서 찾기
    if (!callItem && searchCategory.detailedSearch?.detailList?.callList) {
      const foundCallItem = callList.find((item) => item.EgName === EgName);
      if (foundCallItem) {
        callItem = foundCallItem;
      }
    }

    if (!callItem) return;
    // 수정예정. 리턴형식은 동일하도록
    openDialog(EgName, {
      onClose: (item) => {
        if (EgName === "DGManager") {
          setSaveObject((prev) => ({
            ...prev,
            [EgName]: item,
          }));
        } else {
          setSaveObject((prev) => ({
            ...prev,
            [EgName]: [item],
          }));
        }
      },
      ...callItem.props,
    });
  };

  const callListValue = (EgName) => {
    const isName = EgName === "DGManager" || EgName === "DGCommonCode1";

    if (isName) {
      return Array.isArray(saveObject[EgName])
        ? saveObject[EgName].slice(0, 2)
            .map((item) => item?.name)
            .join(", ") + (saveObject[EgName].length > 2 ? ", ..." : "")
        : "";
    } else {
      return Array.isArray(saveObject[EgName])
        ? saveObject[EgName].slice(0, 2)
            .map((item) => item?.clientName)
            .join(", ") + (saveObject[EgName].length > 2 ? ", ..." : "")
        : "";
    }
  };

  const handleSearch = () => {
    setsendObject({ ...saveObject }); // 객체를 복사하여 전달
  };
  return (
    <section className="common-search">
      <div className="common-search-filters flex-col">
        <div className="flex flex-wrap gap-2">
          {/* 날짜 필드 */}
          {inputConfig.dates?.map((dateItem) => (
            <DateField
              key={dateItem.EgName}
              dateItem={dateItem}
              pageCode={inputConfig.pageCode}
              saveObject={saveObject}
              setSaveObject={setSaveObject}
              disabled={disabled}
            />
          ))}

          {/* 텍스트 필드 */}
          {inputConfig.inputs?.map(({ koName, EgName }) => (
            <div className="common-search__input" key={EgName}>
              <label htmlFor={`${inputConfig.pageCode}-${EgName}`}>{koName}</label>
              <InputText
                className="w-fix"
                placeholder={koName}
                name={EgName}
                id={`${inputConfig.pageCode}-${EgName}`}
                value={saveObject[EgName] || ""}
                onChange={(e) =>
                  !disabled &&
                  setSaveObject((prev) => ({
                    ...prev,
                    [EgName]: e.target.value,
                  }))
                }
                disabled={disabled}
              />
            </div>
          ))}

          {/* 메인 검색 영역의 날짜+텍스트 필드 */}
          {inputConfig.dateTexts?.map((dateItem) => (
            <DateTextField
              key={dateItem.EgName}
              dateItem={dateItem}
              pageCode={inputConfig.pageCode}
              saveObject={saveObject}
              setSaveObject={setSaveObject}
              disabled={disabled}
            />
          ))}

          {/* 분리된 SelectField 컴포넌트 사용 */}
          {inputConfig.selects?.map(({ koName, EgName }) => (
            <SelectField
              key={EgName}
              koName={koName}
              EgName={EgName}
              pageCode={inputConfig.pageCode}
              saveObject={saveObject}
              setSaveObject={setSaveObject}
              sampleOptions={sample}
              pageCustom={pageCustom}
              disabled={disabled}
            />
          ))}

          {/* MultiSelect 필드 추가 */}
          {inputConfig.multiSelects?.map(({ koName, EgName }) => {
            const customOption = pageMultiCustom?.find((item) => item.name === koName);
            if (customOption) {
              return (
                <div className="common-search__input" key={EgName}>
                  <label htmlFor={`${inputConfig.pageCode}-${EgName}`}>{customOption.label}</label>
                  <MultiSelect
                    value={saveObject[EgName] || []}
                    options={customOption.data}
                    onChange={(e) => {
                      console.log(e);
                      !disabled &&
                        setSaveObject((prev) => ({
                          ...prev,
                          [EgName]: e.value,
                        }));
                    }}
                    optionLabel="label"
                    optionValue="value"
                    placeholder={customOption.placeholder}
                    className="w-fix"
                    disabled={disabled}
                  />
                </div>
              );
            }
            return null;
          })}

          {/* 담당자 callList (2개 초과 시 '...' 표시) */}
          {inputConfig.calls?.map(({ koName, EgName }) => (
            <div className="common-search__input" key={EgName}>
              <label htmlFor={`${inputConfig.pageCode}-${EgName}`}>{koName}</label>
              <div className="p-inputgroup">
                <InputText
                  placeholder={koName}
                  name={EgName}
                  id={`${inputConfig.pageCode}-${EgName}`}
                  value={callListValue(EgName)}
                  readOnly
                  disabled={disabled}
                />
                <Button icon="pi pi-search" onClick={() => findList(EgName)} disabled={disabled} />
              </div>
            </div>
          ))}

          {/* 체크박스 */}
          <div className="flex flex-wrap gap-2">
            {inputConfig.checkbox?.map(({ koName, EgName }) => (
              <div className="common-search__input" key={EgName}>
                <Checkbox
                  inputId={`${inputConfig.pageCode}-${EgName}`}
                  checked={saveObject[EgName]}
                  onChange={(e) =>
                    setSaveObject((prev) => ({ ...prev, [EgName]: e.target.checked }))
                  }
                />
                <label htmlFor={`${inputConfig.pageCode}-${EgName}`}>{koName}</label>
              </div>
            ))}
          </div>
        </div>
        <div>
          {/* 상세검색 영역 */}
          {isDetailOpen && searchCategory.detailedSearch?.detailList && (
            <div className="common-search-detail flex flex-wrap gap-2">
              {/* 상세검색 텍스트 입력 */}
              {searchCategory.detailedSearch.detailList.text?.map((koName) => {
                const inputItem = inputName.find((item) => item.koName === koName);
                if (!inputItem) return null;
                return (
                  <div className="common-search__input" key={inputItem.EgName}>
                    <label htmlFor={`${inputConfig.pageCode}-${inputItem.EgName}`}>{koName}</label>
                    <InputText
                      className="w-fix"
                      placeholder={koName}
                      name={inputItem.EgName}
                      id={`${inputConfig.pageCode}-${inputItem.EgName}`}
                      value={saveObject[inputItem.EgName] || ""}
                      onChange={(e) =>
                        !disabled &&
                        setSaveObject((prev) => ({
                          ...prev,
                          [inputItem.EgName]: e.target.value,
                        }))
                      }
                      disabled={disabled}
                    />
                  </div>
                );
              })}

              {/* 상세검색의 날짜+텍스트 필드 */}
              {inputConfig.detailDateTexts?.map((dateItem) => (
                <DateTextField
                  key={dateItem.EgName}
                  dateItem={dateItem}
                  pageCode={inputConfig.pageCode}
                  saveObject={saveObject}
                  setSaveObject={setSaveObject}
                  disabled={disabled}
                />
              ))}

              {/* 상세검색 셀렉트 */}
              {inputConfig.detailSelects?.map(({ koName, EgName }) => {
                const customOption = pageCustom?.find((item) => item.name === koName);
                if (customOption) {
                  return (
                    <div className="common-search__input" key={EgName}>
                      <label htmlFor={`${inputConfig.pageCode}-${EgName}`}>
                        {customOption.label}
                      </label>
                      <Dropdown
                        value={saveObject[koName] || ""}
                        options={customOption.data}
                        onChange={(e) =>
                          !disabled &&
                          setSaveObject((prev) => ({
                            ...prev,
                            [koName]: e.value,
                          }))
                        }
                        optionLabel="label"
                        optionValue="value"
                        placeholder={customOption.placeholder}
                        className="w-fix"
                        disabled={disabled}
                      />
                    </div>
                  );
                }
                return null;
              })}

              {/* 상세검색 MultiSelect */}
              {inputConfig.detailMultiSelects?.map(({ koName, EgName }) => {
                const customOption = pageMultiCustom?.find((item) => item.name === koName);
                if (customOption) {
                  return (
                    <div className="common-search__input" key={EgName}>
                      <label htmlFor={`${inputConfig.pageCode}-${EgName}`}>
                        {customOption.label}
                      </label>
                      <MultiSelect
                        value={saveObject[EgName] || []}
                        options={customOption.data}
                        onChange={(e) =>
                          !disabled &&
                          setSaveObject((prev) => ({
                            ...prev,
                            [EgName]: e.value,
                          }))
                        }
                        optionLabel="label"
                        optionValue="value"
                        placeholder={customOption.placeholder}
                        className="w-fix"
                        disabled={disabled}
                      />
                    </div>
                  );
                }
                return null;
              })}

              {/* 상세검색 콜리스트 */}
              {searchCategory.detailedSearch.detailList.callList?.map((koName) => {
                const callItem = callList.find((item) => item.koName === koName);
                if (!callItem) return null;
                return (
                  <div className="common-search__input" key={callItem.EgName}>
                    <label htmlFor={`${inputConfig.pageCode}-${callItem.EgName}`}>{koName}</label>
                    <div className="p-inputgroup">
                      <InputText
                        placeholder={koName}
                        name={callItem.EgName}
                        id={`${inputConfig.pageCode}-${callItem.EgName}`}
                        value={callListValue(callItem.EgName)}
                        readOnly
                        disabled={disabled}
                      />
                      <Button
                        icon="pi pi-search"
                        onClick={() => findList(callItem.EgName)}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                );
              })}

              {/* 상세검색 체크박스 */}
              <div className="flex flex-wrap gap-2">
                {searchCategory.detailedSearch.detailList.checkbox?.map((koName) => {
                  const checkboxItem = checkboxName.find((item) => item.koName === koName);
                  if (!checkboxItem) return null;
                  return (
                    <div className="common-search__input" key={checkboxItem.EgName}>
                      <Checkbox
                        inputId={`${inputConfig.pageCode}-${checkboxItem.EgName}`}
                        checked={saveObject[checkboxItem.EgName]}
                        onChange={(e) =>
                          setSaveObject((prev) => ({
                            ...prev,
                            [checkboxItem.EgName]: e.target.checked,
                          }))
                        }
                      />
                      <label htmlFor={`${inputConfig.pageCode}-${checkboxItem.EgName}`}>
                        {koName}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="common-search-btns">
        <Button
          label="검색"
          icon="pi pi-search"
          iconPos="right"
          onClick={handleSearch}
          disabled={disabled}
        />
        {searchCategory.detailedSearch?.isUse && (
          <Button
            label="상세검색"
            icon={isDetailOpen ? "pi pi-angle-up" : "pi pi-angle-down"}
            severity="secondary"
            iconPos="right"
            onClick={() => setIsDetailOpen(!isDetailOpen)}
            disabled={disabled}
          />
        )}
        {isDetailOpen && (
          <Button
            label="초기화"
            icon="pi pi-refresh"
            severity="secondary"
            iconPos="right"
            onClick={() => setSaveObject({})}
            disabled={disabled}
          />
        )}
        {searchCategory.isClear && (
          <Button
            label="초기화"
            icon="pi pi-refresh"
            severity="secondary"
            iconPos="right"
            onClick={() => setSaveObject({})}
            disabled={disabled}
          />
        )}
      </div>
    </section>
  );
};

export default ComSearch;
