// 7.4.3.부서등록	A0020	deptEntry	BM-7403
import React, { useEffect, useState } from "react";
import { TabPanel, TabView } from "primereact/tabview";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import useToastStore from "@/store/toastStore";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { renderRow } from "@/utils/common";
import { faker } from "@faker-js/faker";
import useDialogStore from "@/store/dialogStore";

const generateDeptList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    id: (1000 + index).toString(),
    code: faker.string.alphanumeric(10).toLowerCase(),
    name: `Sample Dept ${index + 1}`,
    division: faker.string.alphanumeric(10).toLowerCase(),
    deptName: faker.string.alphanumeric(10).toLowerCase(),
  }));
};

const generateDivisionList = (count = 10) => {
  return Array.from({ length: count }, (_, index) => ({
    id: (2000 + index).toString(),
    code: faker.string.alphanumeric(10).toLowerCase(),
    name: `Sample Division ${index + 1}`,
    useStatus: faker.datatype.boolean(),
    startDate: faker.date.past().toISOString(),
    endDate: faker.date.future().toISOString(),
    noEndDate: faker.datatype.boolean(),
    note: faker.lorem.sentence(),
  }));
};

const sampleDeptList = generateDeptList(30);
const sampleDivisionList = generateDivisionList(10);

const DeptEntryPage = () => {
  const showToast = useToastStore.getState().showToast;
  const [deptData, setDeptData] = useState([]);
  const [divisionData, setDivisionData] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const openDialog = useDialogStore((s) => s.openDialog);

  useEffect(() => {
    // TODO 백엔드 호출
    setDeptData(sampleDeptList);
    setDivisionData(sampleDivisionList);
    setSelectedDept(sampleDeptList[0]);
    setSelectedDivision(sampleDivisionList[0]);
  }, []);

  const basicInfoRows = [
    [{ label: "사업장", value: selectedDept?.name || "0001 본사" }],
    [{ label: "부문", value: selectedDept?.division || "경영지원" }],
    [{ label: "부서코드", value: selectedDept?.code || "DEP001" }],
    [{ label: "사용유무", value: "사용" }],
    [{ label: "부서명", value: selectedDept?.deptName || "인사팀" }],
    [{ label: "사용시작", value: "2023-01-01" }],
    [{ label: "사용종료", value: "2099-12-31" }],
    [{ label: "비고", value: "인사 업무 담당 부서" }],
  ];

  const divisionRows = [
    [{ label: "부문코드", value: selectedDivision?.code || "DIV001" }],
    [{ label: "부문명", value: selectedDivision?.name || "경영지원" }],
    [{ label: "사용유무", value: "사용" }],
    [{ label: "사용시작", value: "2023-01-01" }],
    [{ label: "사용종료", value: "2099-12-31" }],
    [{ label: "비고", value: "인사 업무 담당 부서" }],
  ];

  const handleDelete = (type) => {
    const selected = type === "dept" ? selectedDept : selectedDivision;
    if (!selected) {
      showToast({
        severity: "warn",
        summary: "알림",
        detail: `삭제할 ${type === "dept" ? "부서" : "부문"}를 선택해주세요.`,
        life: 3000,
      });
      return;
    }

    confirmDialog({
      message: `${selected.name}을(를) 정말로 삭제하시겠습니까?`,
      header: `${type === "dept" ? "부서" : "부문"} 삭제`,
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => {
        // TODO: API 호출 구현
        showToast({
          severity: "info",
          summary: `${type === "dept" ? "부서" : "부문"} 삭제`,
          detail: `${type === "dept" ? "부서" : "부문"}가 삭제되었습니다.`,
          life: 3000,
        });
      },
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };

  const handleAdd = (type) => {
    // TODO: API 호출 구현
    if (type === "dept") {
      openDialog("DeptForm7403", {
        state: "추가",
      });
    } else {
      openDialog("DivisionForm7403", {
        state: "추가",
      });
    }
  };

  const handleEdit = (type) => {
    // TODO: API 호출 구현
    if (type === "dept") {
      openDialog("DeptForm7403", {
        state: "수정",
        data: selectedDept,
      });
    } else {
      openDialog("DivisionForm7403", {
        state: "수정",
        data: selectedDivision,
      });
    }
  };

  return (
    <div id="DeptEntryPage">
      <TabView>
        <TabPanel header="부서등록">
          <div className="DeptEntry-con content-box">
            <section className="datatable">
              <div className="datatable__header">
                <h3>부서 목록</h3>
                <div className="datatable__btns">
                  <Button
                    label="삭제"
                    size="small"
                    severity="danger"
                    icon="pi pi-times"
                    onClick={() => handleDelete("dept")}
                  />
                  <Button
                    label="추가"
                    size="small"
                    icon="pi pi-plus"
                    onClick={() => handleAdd("dept")}
                  />
                </div>
              </div>
              <DataTable
                emptyMessage="데이터가 없습니다."
                value={deptData}
                selectionMode="single"
                selection={selectedDept}
                onSelectionChange={(e) => setSelectedDept(e.value)}
                metaKeySelection={true}
                dataKey="code"
                showGridlines
                scrollable
                scrollHeight="flex"
                resizableColumns
              >
                <Column field="name" header="사업장명"></Column>
                <Column field="division" header="부문"></Column>
                <Column field="code" header="코드"></Column>
                <Column field="deptName" header="부서명"></Column>
              </DataTable>
            </section>
            <section className="detail">
              <div className="con-header">
                <h4 className="con-header__title">기본정보</h4>
                <div className="con-header__btns">
                  <Button label="수정" severity="secondary" onClick={() => handleEdit("dept")} />
                </div>
              </div>
              <div className="con-body">{basicInfoRows.map((row, idx) => renderRow(row, idx))}</div>
            </section>
          </div>
        </TabPanel>
        <TabPanel header="부문등록">
          <div className="DeptEntry-con content-box">
            <section className="datatable">
              <div className="datatable__header">
                <h3>부문 목록</h3>
                <div className="datatable__btns">
                  <Button
                    label="삭제"
                    size="small"
                    severity="danger"
                    icon="pi pi-times"
                    onClick={() => handleDelete("division")}
                  />
                  <Button
                    label="추가"
                    size="small"
                    icon="pi pi-plus"
                    onClick={() => handleAdd("division")}
                  />
                </div>
              </div>
              <DataTable
                emptyMessage="데이터가 없습니다."
                value={divisionData}
                selectionMode="single"
                selection={selectedDivision}
                onSelectionChange={(e) => setSelectedDivision(e.value)}
                metaKeySelection={true}
                dataKey="code"
                showGridlines
                scrollable
                scrollHeight="flex"
                resizableColumns
              >
                <Column field="name" header="부문"></Column>
                <Column field="code" header="코드"></Column>
              </DataTable>
            </section>
            <section className="detail">
              <div className="con-header">
                <h4 className="con-header__title">기본정보</h4>
                <div className="con-header__btns">
                  <Button
                    label="수정"
                    severity="secondary"
                    onClick={() => handleEdit("division")}
                  />
                </div>
              </div>
              <div className="con-body">{divisionRows.map((row, idx) => renderRow(row, idx))}</div>
            </section>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default DeptEntryPage;
