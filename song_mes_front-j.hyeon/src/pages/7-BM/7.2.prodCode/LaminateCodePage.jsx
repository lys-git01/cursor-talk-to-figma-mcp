/* 7.2.1.합지코드등록 : H1011, BM-7201 */
import ComSearch from "@/components/ComSearch";
import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { faker } from "@faker-js/faker";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";

const generateSampleData = (type, count = 30) => {
  const generators = {
    laminate: (index) => ({
      num: (index + 1).toString(),
      code: faker.string.alphanumeric(10).toLowerCase(),
      name: `Sample Name ${index + 1}`,
      width: faker.number.int({ min: 100, max: 1000 }),
      height: faker.number.int({ min: 100, max: 1000 }),
    }),
    weight: (index) => ({
      code: faker.number.int({ min: 1000, max: 9999 }),
      newCode: faker.number.int({ min: 10, max: 99 }),
      name: `Sample Name ${index + 1}`,
      weight: faker.number.int({ min: 100, max: 1000 }),
    }),
    size: () => ({
      code: faker.number.int({ min: 1000, max: 9999 }),
      newCode: faker.number.int({ min: 10, max: 99 }),
      width: faker.number.int({ min: 100, max: 1000 }),
      height: faker.number.int({ min: 100, max: 1000 }),
    }),
  };

  return Array.from({ length: count }, (_, index) => generators[type](index));
};

const initialLaminateForm = {
  code: "A",
  newCode: "A8800",
  sizeCode: { code: "", width: "", height: "", newCode: "" },
  weightCode: { code: "", name: "", weight: "", newCode: "" },
  거래처약칭: { clientName: "", id: "" },
  추가명칭: "",
  표시중량: "",
  구분코드1: "8",
  구분코드2: "8",
  합지종류: "0",
  사용여부: "1",
  합치명칭: "",
};

const LaminateCodePage = () => {
  const [saveObjects, setSaveObjects] = useState({});
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);
  const [laminateEditMode, setLaminateEditMode] = useState(false);
  const [laminateForm, setLaminateForm] = useState(initialLaminateForm);

  const [tableData, setTableData] = useState({
    laminate: [],
    weight: [],
    size: [],
  });

  const [selectedRows, setSelectedRows] = useState({
    laminate: null,
    weight: null,
    size: null,
  });

  useEffect(() => {
    // TODO 백엔드 호출
    const laminateData = generateSampleData("laminate");
    const weightData = generateSampleData("weight");
    const sizeData = generateSampleData("size");

    setTableData({
      laminate: laminateData,
      weight: weightData,
      size: sizeData,
    });
    setSelectedRows({
      laminate: laminateData[0],
      weight: weightData[0],
      size: sizeData[0],
    });
  }, []);

  useEffect(() => {
    showToast({
      severity: "info",
      summary: "백엔드 api 데이터 호출",
      detail: `saveObjects: ${JSON.stringify(saveObjects)}`,
    });
  }, [saveObjects]);

  const handleRowSelect = (type) => (event) => {
    showToast({
      severity: "info",
      summary: "Product Selected",
      detail: `Name: ${event.data.name}`,
      life: 3000,
    });
    if (laminateEditMode) {
      const weightCode = type === "weight" ? event.data.code : laminateForm.weightCode.code;
      const newWeightCode =
        type === "weight" ? event.data.newCode : laminateForm.weightCode.newCode;
      const sizeCode = type === "size" ? event.data.code : laminateForm.sizeCode.code;
      const newSizeCode = type === "size" ? event.data.newCode : laminateForm.sizeCode.newCode;
      const weight = type === "weight" ? event.data.weight : laminateForm.weightCode.weight;
      const sizeWidth = type === "size" ? event.data.width : laminateForm.sizeCode.width;
      const sizeHeight = type === "size" ? event.data.height : laminateForm.sizeCode.height;

      const isNull = laminateForm.표시중량 === "";
      setLaminateForm({
        ...laminateForm,
        [type + "Code"]: event.data,
        code: "A" + weightCode + sizeCode,
        newCode:
          "A" +
          laminateForm.구분코드1 +
          laminateForm.구분코드2 +
          "0" +
          laminateForm.합지종류 +
          laminateForm.거래처약칭.id +
          newWeightCode +
          newSizeCode,
        합지명칭: isNull
          ? weight + // 중량
            "." +
            (laminateForm.추가명칭 && laminateForm.추가명칭 + ".") + // 추가명칭
            sizeWidth + // 가로
            "*" +
            sizeHeight // 세로
          : laminateForm.표시중량 +
            "(" +
            weight +
            ")." +
            (laminateForm.추가명칭 && laminateForm.추가명칭 + ".") +
            sizeWidth +
            "*" +
            sizeHeight,
      });
    }
  };

  const handleSelectionChange = (type) => (e) => {
    setSelectedRows((prev) => ({
      ...prev,
      [type]: e.value,
    }));
  };

  const searchCategories = {
    laminate: {
      pageCode: 7201,
      text: ["명칭", "가로 / 세로"],
      select: [],
      callList: [],
      detailedSearch: { isUse: false },
      isClear: true,
    },
    weight: {
      pageCode: 7201,
      text: ["명칭", "중량"],
      select: [],
      callList: [],
      detailedSearch: { isUse: false },
      isClear: true,
    },
    size: {
      pageCode: 7201,
      text: ["사이즈"],
      select: [],
      callList: [],
      detailedSearch: { isUse: false },
      isClear: true,
    },
  };

  const handleEdit = (rowData, type) => {
    if (type !== "laminate") {
      openDialog("LaminateForm7201", {
        state: { case: type, mode: "edit" },
        data: rowData,
      });
    } else {
      setLaminateEditMode(true);
    }
  };

  const handleDelete = (title, rowData) => {
    // TODO: 삭제 로직 구현
    console.log("삭제할 데이터:", rowData);
    confirmDialog({
      message: `${rowData.code}을(를) 정말로 삭제하시겠습니까?`,
      header: `${title} 삭제`,
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => accept(rowData.code),
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };
  const accept = (code) => {
    showToast({
      severity: "info",
      summary: `${code} 삭제`,
      detail: `${code} 삭제되었습니다.`,
      life: 3000,
    });
  };
  const handleAdd = (type) => {
    if (type !== "laminate") {
      openDialog("LaminateForm7201", {
        state: { case: type, mode: "add" },
      });
    } else {
      setLaminateEditMode(true);
    }
  };
  const actionBodyTemplate = (title, rowData, type) => (
    <div className="buttonSet">
      <Button
        label="삭제"
        outlined
        size="small"
        severity="danger"
        onClick={() => handleDelete(title, rowData)}
      />
      <Button label="수정" outlined size="small" onClick={() => handleEdit(rowData, type)} />
    </div>
  );

  const renderDataTable = (type, columns) => {
    const title = type === "laminate" ? "합지코드" : type === "weight" ? "중량코드" : "사이즈코드";
    return (
      <div>
        <div className="datatable__header">
          <h3>{title}</h3>
          {!laminateEditMode && (
            <div className="datatable__btns">
              <Button label="추가" size="small" icon="pi pi-plus" onClick={() => handleAdd(type)} />
            </div>
          )}
        </div>
        <div className="datatable__body">
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={tableData[type]}
            selectionMode="single"
            selection={selectedRows[type]}
            onSelectionChange={handleSelectionChange(type)}
            onRowSelect={handleRowSelect(type)}
            metaKeySelection={true}
            dataKey="code"
            size="small"
            showGridlines
            scrollable
            scrollHeight="flex"
            // virtualScrollerOptions={{ itemSize: 43 }}
            resizableColumns
          >
            {columns.map((col, index) => (
              <Column key={index} {...col} />
            ))}
            {!laminateEditMode && (
              <Column
                header="삭제 / 수정"
                body={(e) => actionBodyTemplate(title, e, type)}
                style={{ width: "150px" }}
              />
            )}
          </DataTable>
        </div>
      </div>
    );
  };

  const handleCancel = () => {
    setLaminateForm(initialLaminateForm);
    setLaminateEditMode(false);
  };

  return (
    <div id="LaminateCode">
      <TabView className="TabStyle2">
        <TabPanel header="합지코드">
          <ComSearch
            searchCategory={searchCategories.laminate}
            setSaveObject={(obj) => setSaveObjects((prev) => ({ ...prev, laminate: obj }))}
            disabled={laminateEditMode}
          />
        </TabPanel>
        <TabPanel header="중량코드">
          <ComSearch
            searchCategory={searchCategories.weight}
            setSaveObject={(obj) => setSaveObjects((prev) => ({ ...prev, weight: obj }))}
            disabled={laminateEditMode}
          />
        </TabPanel>
        <TabPanel header="사이즈코드">
          <ComSearch
            searchCategory={searchCategories.size}
            setSaveObject={(obj) => setSaveObjects((prev) => ({ ...prev, size: obj }))}
            disabled={laminateEditMode}
          />
        </TabPanel>
      </TabView>
      <div className="LaminateCode-con content-box">
        <section className="datatable">
          {laminateEditMode ? (
            <LaminateForm
              setLaminateEditMode={setLaminateEditMode}
              selectedRows={selectedRows}
              laminateForm={laminateForm}
              setLaminateForm={setLaminateForm}
              onCancel={handleCancel}
            />
          ) : (
            renderDataTable("laminate", [
              { field: "num", header: "순번" },
              { field: "code", header: "코드" },
              { field: "name", header: "합지명" },
              { field: "width", header: "가로" },
              { field: "height", header: "세로" },
            ])
          )}

          {renderDataTable("weight", [
            { field: "code", header: "코드" },
            { field: "name", header: "중량명칭" },
            { field: "weight", header: "중량" },
          ])}
          {renderDataTable("size", [
            { field: "code", header: "코드" },
            { field: "width", header: "가로" },
            { field: "height", header: "세로" },
          ])}
        </section>
      </div>
    </div>
  );
};

export default LaminateCodePage;

const LaminateForm = ({ setLaminateEditMode, laminateForm, setLaminateForm, onCancel }) => {
  const openDialog = useDialogStore((s) => s.openDialog);

  const findList = (index) => {
    openDialog("DGClientSelect1", {
      onClose: (data) => {
        setLaminateForm((prev) => ({
          ...prev,
          [index]: data,
          newCode: generateNewCode(prev, "거래처약칭", data.id),
        }));
      },
    });
  };

  const generateLaminateName = (prev, value, isWeightNull) => {
    const { weightCode, sizeCode, 추가명칭, 표시중량 } = prev;
    const weight = weightCode.weight;
    const size = `${sizeCode.width}*${sizeCode.height}`;
    const additionalName = 추가명칭 ? `${추가명칭}.` : "";

    if (isWeightNull) {
      return `${weight}.${additionalName}${size}`;
    }
    return `${표시중량}(${weight}).${additionalName}${size}`;
  };

  const generateNewCode = (prev, field, value) => {
    const { 구분코드1, 구분코드2, 합지종류, 거래처약칭, weightCode, sizeCode } = prev;
    const codes = {
      구분코드1: { code1: value, code2: 구분코드2, code3: 합지종류, clientId: 거래처약칭.id },
      구분코드2: { code1: 구분코드1, code2: value, code3: 합지종류, clientId: 거래처약칭.id },
      합지종류: { code1: 구분코드1, code2: 구분코드2, code3: value, clientId: 거래처약칭.id },
      거래처약칭: { code1: 구분코드1, code2: 구분코드2, code3: 합지종류, clientId: value },
    };

    const { code1, code2, code3, clientId } = codes[field] || {
      code1: 구분코드1,
      code2: 구분코드2,
      code3: 합지종류,
      clientId: 거래처약칭.id,
    };
    return `A${code1}${code2}0${code3}${clientId}${weightCode.newCode}${sizeCode.newCode}`;
  };

  const onChange1 = (e) => {
    const value = e.target.value;
    setLaminateForm((prev) => ({
      ...prev,
      추가명칭: value,
      합지명칭: generateLaminateName(prev, value, prev.표시중량 === ""),
    }));
  };

  const onChange2 = (e) => {
    const value = e.target.value;
    setLaminateForm((prev) => ({
      ...prev,
      표시중량: value,
      합지명칭: generateLaminateName(prev, value, value === ""),
    }));
  };

  const handleCodeChange = (field) => (e) => {
    const value = e.target.value;
    setLaminateForm((prev) => ({
      ...prev,
      [field]: value,
      newCode: generateNewCode(prev, field, value),
    }));
  };

  const handleSave = () => {
    //TODO 유효성
    console.log(laminateForm);
    setLaminateEditMode(false);
    setLaminateForm(initialLaminateForm);
  };

  return (
    <div>
      <div className="datatable__header">
        <h3>합지코드</h3>
        <div className="datatable__btns">
          <Button label="취소" size="small" severity="secondary" onClick={onCancel} />
          <Button label="저장" size="small" onClick={handleSave} />
        </div>
      </div>
      <div className="form-list">
        <div className="form__input">
          <p>코드</p>
          <span>{laminateForm.code}</span>
        </div>
        <div className="form__input">
          <p>신코드</p>
          <span>{laminateForm.newCode}</span>
        </div>
        <div className="form__input">
          <p>사이즈코드*</p>
          <span>{laminateForm.sizeCode.code}</span>
          <span>
            {laminateForm.sizeCode.code &&
              `${laminateForm.sizeCode.width}*${laminateForm.sizeCode.height}`}
          </span>
          <span>{laminateForm.sizeCode.newCode}</span>
        </div>
        <div className="form__input">
          <p>중량코드*</p>
          <span>{laminateForm.weightCode.code}</span>
          <span>{laminateForm.weightCode.name}</span>
          <span>{laminateForm.weightCode.newCode}</span>
        </div>
        <div className="form__input">
          <p>거래처약칭*</p>
          <div className="common-search__input">
            <div className="p-inputgroup">
              <InputText
                placeholder="거래처약칭"
                name="거래처약칭"
                id="거래처약칭"
                value={laminateForm.거래처약칭.clientName}
                readOnly
              />
              <Button icon="pi pi-search" onClick={() => findList("거래처약칭")} />
            </div>
          </div>
        </div>
        <div className="form__input">
          <p>추가명칭*</p>
          <InputText
            id="추가명칭"
            value={laminateForm.추가명칭}
            onChange={onChange1}
            placeholder="추가명칭"
          />
        </div>
        <div className="form__input">
          <p>표시중량*</p>
          <InputText
            id="표시중량"
            value={laminateForm.표시중량}
            onChange={onChange2}
            placeholder="표시중량"
          />
          G
        </div>
        <div className="form__input">
          <p>구분코드1*</p>
          <Dropdown
            id="구분코드1"
            value={laminateForm.구분코드1}
            onChange={handleCodeChange("구분코드1")}
            placeholder="구분코드1"
            options={[
              { label: "신규", value: "8" },
              { label: "예전", value: "9" },
            ]}
          />
        </div>
        <div className="form__input">
          <p>구분코드2*</p>
          <Dropdown
            id="구분코드2"
            value={laminateForm.구분코드2}
            onChange={handleCodeChange("구분코드2")}
            placeholder="구분코드2"
            options={[
              { label: "타사합지", value: "8" },
              { label: "본사합지", value: "9" },
            ]}
          />
        </div>
        <div className="form__input">
          <p>합지종류*</p>
          <Dropdown
            id="합지종류"
            value={laminateForm.합지종류}
            onChange={handleCodeChange("합지종류")}
            placeholder="합지종류"
            options={[
              { label: "일반", value: "0" },
              { label: "골판지", value: "1" },
            ]}
          />
        </div>
        <div className="form__input">
          <p>사용여부</p>
          <Dropdown
            id="사용여부"
            value={laminateForm.사용여부}
            onChange={(e) => setLaminateForm({ ...laminateForm, 사용여부: e.target.value })}
            placeholder="사용여부"
            options={[
              { label: "사용", value: "1" },
              { label: "미사용", value: "0" },
            ]}
          />
        </div>
        <div className="form__input">
          <p>합치명칭</p>
          <span>{laminateForm.합지명칭}</span>
        </div>
      </div>
    </div>
  );
};
