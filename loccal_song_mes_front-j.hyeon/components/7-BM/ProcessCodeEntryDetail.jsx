import { renderRow } from "@/utils/common";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import useDialogStore from "@/store/dialogStore";

const ProcessCodeEntryDetail = ({ selectedProcess, selectedDetailProcess }) => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedDetailMachine, setSelectedDetailMachine] = useState(null);
  const [processCodeRows, setProcessCodeRows] = useState([]);
  const [detailProcessCodeRows, setDetailProcessCodeRows] = useState([]);
  const { openDialog } = useDialogStore();
  // 공정코드 데이터가 변경될 때마다 rows 업데이트
  useEffect(() => {
    if (selectedProcess) {
      setProcessCodeRows([
        [{ label: "공정코드", value: selectedProcess.code }],
        [{ label: "공정명", value: selectedProcess.name }],
        [{ label: "청구명", value: selectedProcess.billingName }],
        [{ label: "기본적요", value: selectedProcess.basicDescription }],
        [{ label: "표시순서", value: selectedProcess.displayOrder }],
        [
          {
            label: "사용유무",
            value: selectedProcess.useStatus,
            tooltip: "0-미사용, 1-사용, 2-특수기능",
          },
        ],
        [{ label: "생산원가", value: selectedProcess.productionCost }],
        [{ label: "판매원가", value: selectedProcess.salesCost }],
        [{ label: "메인기계", value: selectedProcess.mainMachine }],
      ]);
    } else {
      setProcessCodeRows([]);
    }
  }, [selectedProcess]);

  // 상세공정코드 데이터가 변경될 때마다 rows 업데이트
  useEffect(() => {
    if (selectedDetailProcess) {
      setDetailProcessCodeRows([
        [{ label: "공정명", value: selectedDetailProcess.name }],
        [{ label: "상세공정명", value: selectedDetailProcess.detailName }],
        [{ label: "상세청구명", value: selectedDetailProcess.detailBillingName }],
        [{ label: "표시순서", value: selectedDetailProcess.displayOrder }],
        [{ label: "사용유무", value: selectedDetailProcess.useStatus }],
        [{ label: "생산원가", value: selectedDetailProcess.productionCost }],
        [{ label: "판매원가", value: selectedDetailProcess.salesCost }],
        [{ label: "메인기계", value: selectedDetailProcess.mainMachine }],
      ]);
    } else {
      setDetailProcessCodeRows([]);
    }
  }, [selectedDetailProcess]);

  // 임시 데이터
  const processMachines = [
    { code: "M001", name: "기계1" },
    { code: "M002", name: "기계2" },
    { code: "M003", name: "기계3" },
    { code: "M004", name: "기계4" },
    { code: "M005", name: "기계5" },
    { code: "M006", name: "기계6" },
    { code: "M007", name: "기계7" },
    { code: "M008", name: "기계8" },
    { code: "M009", name: "기계9" },
    { code: "M010", name: "기계10" },
    { code: "M011", name: "기계11" },
    { code: "M012", name: "기계12" },
    { code: "M013", name: "기계13" },
    { code: "M014", name: "기계14" },
    { code: "M015", name: "기계15" },
    { code: "M016", name: "기계16" },
    { code: "M017", name: "기계17" },
  ];

  const detailProcessMachines = [
    { code: "DM001", name: "상세기계1" },
    { code: "DM002", name: "상세기계2" },
  ];

  const updateMachine = (type) => {
    openDialog("DGMachineList", {
      onClose: (value) => {
        if (value.mainMachine) {
          if (type === "process") {
            // 백엔드 api 공정기기 수정
            console.log("공정기기 수정", selectedProcess.code, value);
          } else {
            // 백엔드 api 상세 공정기기 수정
            console.log("상세 공정기기 수정", selectedDetailProcess.code, value);
          }
        }
      },
    });
  };

  return (
    <div className="detail width-50">
      <div className="flex gap-3">
        <div className="width-50">
          <div className="con-header">
            <h4 className="con-header__title">공정코드</h4>
          </div>
          <div className="con-body">{processCodeRows.map((row, idx) => renderRow(row, idx))}</div>
        </div>
        <div className="width-50">
          <div className="con-header">
            <h4 className="con-header__title">공정 작업기기 목록</h4>
            <div className="datatable__btns">
              <Button
                label="기기수정"
                size="small"
                icon="pi pi-plus"
                onClick={() => updateMachine("process")}
              />
            </div>
          </div>
          <div className="datatable__body">
            <DataTable
              size="small"
              emptyMessage="데이터가 없습니다."
              value={processMachines}
              selectionMode="single"
              selection={selectedMachine}
              onSelectionChange={(e) => setSelectedMachine(e.value)}
              scrollable
              scrollHeight="flex"
            >
              <Column field="code" header="코드"></Column>
              <Column field="name" header="기계명"></Column>
            </DataTable>
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-3">
        <div className="width-50">
          <div className="con-header">
            <h4 className="con-header__title">상세 공정코드</h4>
          </div>
          <div className="con-body">
            {detailProcessCodeRows.map((row, idx) => renderRow(row, idx))}
          </div>
        </div>
        <div className="width-50">
          <div className="con-header">
            <h4 className="con-header__title">작업기기 목록</h4>
            <div className="datatable__btns">
              <Button
                label="기기수정"
                size="small"
                icon="pi pi-plus"
                onClick={() => updateMachine("detail")}
              />
            </div>
          </div>
          <div className="datatable__body">
            <DataTable
              size="small"
              emptyMessage="데이터가 없습니다."
              value={detailProcessMachines}
              selectionMode="single"
              selection={selectedDetailMachine}
              onSelectionChange={(e) => setSelectedDetailMachine(e.value)}
              scrollable
              scrollHeight="flex"
            >
              <Column field="code" header="코드"></Column>
              <Column field="name" header="기계명"></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessCodeEntryDetail;
