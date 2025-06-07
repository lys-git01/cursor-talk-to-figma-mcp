// 7.3.6.기계별담당지정	F1126	machineManager	BM-7306

import useToastStore from "@/store/toastStore";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";

const MachineManagerPage = () => {
  const showToast = useToastStore.getState().showToast;
  const [filterType, setFilterType] = useState("전체");
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailData, setDetailData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [allMachines, setAllMachines] = useState([]);

  // 임시 데이터 로드
  useEffect(() => {
    // TODO: API 연동
    const tempData = Array.from({ length: 30 }, (_, index) => ({
      order: String(index + 1).padStart(3, "0"),
      code: `EMP${String(index + 1).padStart(3, "0")}`, // 사번
      name: `홍길동${index + 1}`, // 사원명
      assignedCount: Math.floor(Math.random() * 5) + 1, // 배정수
      quit: index % 2 === 0 ? true : false,
      detailData: [
        {
          order: String(index + 1).padStart(3, "0"),
          code: `MCH${String(index + 1).padStart(3, "0")}`,
          name: `자동화설비${index + 1}`, // 통합기기명
          workMachine: `CNC${String.fromCharCode(65 + (index % 26))}${String(index + 1).padStart(3, "0")}`, // 작업기기
        },
        {
          order: String(index + 2).padStart(3, "0"),
          code: `MCH${String(index + 2).padStart(3, "0")}`,
          name: `로봇설비${index + 1}`,
          workMachine: `ROBOT${String.fromCharCode(65 + (index % 26))}${String(index + 1).padStart(3, "0")}`,
        },
        {
          order: String(index + 3).padStart(3, "0"),
          code: `MCH${String(index + 3).padStart(3, "0")}`,
          name: `검사설비${index + 1}`,
          workMachine: `INSP${String.fromCharCode(65 + (index % 26))}${String(index + 1).padStart(3, "0")}`,
        },
      ],
    }));

    // 모든 기계 데이터 생성
    const allMachineData = Array.from({ length: 50 }, (_, index) => ({
      order: String(index + 1).padStart(3, "0"),
      code: `MCH${String(index + 1).padStart(3, "0")}`,
      name: `자동화설비${index + 1}`,
      workMachine: `CNC${String.fromCharCode(65 + (index % 26))}${String(index + 1).padStart(3, "0")}`,
    }));

    setAllData(tempData);
    setAllMachines(allMachineData);

    // 초기 필터링 적용
    let filteredData;
    if (filterType === "전체") {
      filteredData = tempData;
    } else if (filterType === "사용") {
      filteredData = tempData.filter((item) => !item.quit);
    } else if (filterType === "미사용자") {
      filteredData = tempData.filter((item) => item.quit);
    }

    setData(filteredData);
    // 첫 번째 행 선택
    if (filteredData.length > 0) {
      setSelectedRow(filteredData[0]);
    }
  }, [filterType]);

  // 선택된 공정에 따른 상세공정 데이터 로드
  useEffect(() => {
    if (selectedRow) {
      if (isEdit) {
        // 수정 모드일 때는 모든 기계를 보여주되, 기존 담당 기계는 파란색으로 표시
        const existingMachineCodes = selectedRow.detailData.map((machine) => machine.code);
        const machinesWithStatus = allMachines.map((machine) => ({
          ...machine,
          isAssigned: existingMachineCodes.includes(machine.code),
        }));
        setDetailData(machinesWithStatus);
      } else {
        // 일반 모드일 때는 해당 사원의 담당 기계만 표시
        setDetailData(selectedRow.detailData);
      }
    } else {
      setDetailData([]);
    }
  }, [selectedRow, isEdit, allMachines]);

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setIsEdit(true);
    setSelectedMachines([]);
  };

  const handleSave = () => {
    // 선택된 기계들의 코드와 사원 코드를 반환
    const result = {
      employeeCode: selectedRow.code,
      machineCodes: selectedMachines.map((machine) => machine.code),
    };

    console.log("저장할 데이터:", result);

    showToast({
      severity: "success",
      summary: "저장완료",
      detail: `기계별 담당자 수정자 저장완료`,
      life: 3000,
    });

    // 상태 초기화
    setIsEdit(false);
    setSelectedMachines([]);
    setSelectedRow(null);
    setDetailData([]);
    // 첫 번째 행 선택
    if (data.length > 0) {
      setSelectedRow(data[0]);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    setSelectedMachines([]);
    setSelectedRow(null);
    setDetailData([]);
    // 첫 번째 행 선택
    if (data.length > 0) {
      setSelectedRow(data[0]);
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="buttonSet">
        <Button label="수정" outlined size="small" onClick={() => handleEdit(rowData)} />
      </div>
    );
  };

  const onDetailRowSelect = (event) => {
    setSelectedMachines(event.value);
  };

  const onChangeFilterType = (e) => {
    setFilterType(e.value);
    if (e.value === "전체") {
      setData(allData);
    } else if (e.value === "사용") {
      setData(allData.filter((item) => !item.quit));
    } else if (e.value === "미사용자") {
      setData(allData.filter((item) => item.quit));
    }
  };

  const rowClass = (rowData) => {
    return {
      "assigned-machine": rowData.isAssigned,
    };
  };

  return (
    <div id="machineManagerPage">
      <div className="common-search">
        <div className="common-search__input">
          <label htmlFor="filterType">조회구분</label>
          <Dropdown
            value={filterType}
            options={["전체", "사용", "미사용자"]}
            onChange={onChangeFilterType}
            placeholder="선택"
          />
        </div>
      </div>

      <div className="AutoProcessCode-con content-box flex gap-3">
        <section className="datatable">
          <div className="datatable__header">
            <h3>사원 목록</h3>
          </div>
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={data}
            selectionMode="single"
            selection={selectedRow}
            onSelectionChange={(e) => setSelectedRow(e.value)}
            metaKeySelection={true}
            dataKey="code"
            showGridlines
            scrollable
            resizableColumns
            scrollHeight="flex"
            rowClassName={(rowData) => (rowData.quit ? "allRed" : "")}
          >
            <Column field="code" header="사번"></Column>
            <Column field="name" header="사원명"></Column>
            <Column field="assignedCount" header="배정수"></Column>
            <Column
              body={(rowData) => actionBodyTemplate(rowData)}
              header="수정"
              style={{ width: "150px" }}
            ></Column>
          </DataTable>
        </section>
        <section className="datatable">
          <div className="datatable__header">
            <h3>기계 목록</h3>
          </div>
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={detailData}
            selectionMode={isEdit ? "multiple" : "single"}
            selection={selectedMachines}
            onSelectionChange={onDetailRowSelect}
            metaKeySelection={true}
            dataKey="code"
            showGridlines
            scrollable
            resizableColumns
            scrollHeight="flex"
            rowClassName={rowClass}
          >
            <Column
              className="color-blue"
              header="순번"
              body={(_, options) => options.rowIndex + 1}
            />
            {isEdit && <Column selectionMode="multiple" style={{ width: "3rem" }} />}
            <Column className="color-blue" field="code" header="코드"></Column>
            <Column className="color-blue" field="name" header="통합기기명"></Column>
            <Column className="color-blue" field="workMachine" header="작업기기"></Column>
          </DataTable>
        </section>
        <section>
          {isEdit && (
            <div className="detail">
              <div className="con-header">
                <h4 className="con-header__title">기계별 담당자 수정자</h4>
              </div>
              <div className="con-body">
                <div className="con-body__data">
                  <p>담당자</p>
                  <span>{selectedRow.name}</span>
                </div>
                <div className="con-body__btn">
                  <Button label="저장" onClick={handleSave} />
                  <Button label="취소" onClick={handleCancel} />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MachineManagerPage;
