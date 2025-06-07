// 7.3.4.자재그룹등록	A0210	materialGroup	BM-7304

import React, { useEffect, useState } from "react";
import useToastStore from "@/store/toastStore";
import ComSearch from "@/components/ComSearch";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { renderRow } from "@/utils/common";
import { faker } from "@faker-js/faker";
import useDialogStore from "@/store/dialogStore";
import { confirmDialog } from "primereact/confirmdialog";
const TYPES = ["사용", "미사용"];
const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    code: (1000 + index).toString(),
    그룹명: faker.company.name(),
    그룹용도: TYPES[Math.floor(Math.random() * TYPES.length)],
    사용여부: TYPES[Math.floor(Math.random() * TYPES.length)],
    비고: faker.company.name(),
  }));
};

const sampleList = generateSampleList(30);
const MaterialGroupPage = () => {
  const [data, setData] = useState(sampleList);
  const [selectedRow, setselectedRow] = useState(null);
  const openDialog = useDialogStore((s) => s.openDialog);
  const [saveObject, setSaveObject] = useState({}); // 검색용
  const showToast = useToastStore.getState().showToast;
  const searchCategory = {
    pageCode: 7304,
    text: ["그룹코드", "그룹명"],
    select: ["select1"],
    callList: [""],
    detailedSearch: {
      isUse: false,
    },
  };

  const onRowSelect = (event) => {
    showToast({
      severity: "info",
      summary: "행이 선택 되었습니다.",
      detail: `그룹명: ${event.data.그룹명}`,
      life: 3000,
    });
  };
  useEffect(() => {
    setselectedRow(data[0]);
  }, []);
  useEffect(() => {
    showToast({
      severity: "info",
      summary: "백엔드 api 데이터 호출",
      detail: `saveObject: ${JSON.stringify(saveObject)}`,
    });
  }, [saveObject]);

  const basicInfoRows1 = [
    { label: "그룹코드", value: selectedRow?.code },
    { label: "그룹명", value: selectedRow?.그룹명 },
    { label: "그룹용도", value: selectedRow?.그룹용도 },
    { label: "사용여부", value: selectedRow?.사용여부 },
    { label: "비고", value: selectedRow?.비고 },
  ];

  const deleteBtn = () => {
    console.log("deleteBtn", selectedRow);
    confirmDialog({
      message: `자재그룹을 정말로 삭제하시겠습니까?`,
      header: "자재그룹 삭제",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };

  const accept = () => {
    showToast({
      severity: "info",
      summary: "자재그룹 삭제",
      detail: "자재그룹이 삭제되었습니다.",
      life: 3000,
    });
  };

  const addBtn = () => {
    openDialog("MaterialGroupForm7304", {
      state: "추가",
    });
  };

  const editBtn = () => {
    openDialog("MaterialGroupForm7304", {
      state: "수정",
      data: selectedRow,
    });
  };

  return (
    <div id="MaterialGroupPage">
      <ComSearch searchCategory={searchCategory} setSaveObject={setSaveObject} />
      {/* 테이블 */}
      <div className="MaterialGroup-con content-box flex gap-3">
        <section className="datatable width-50">
          <div className="datatable__header">
            <h3>자재그룹 목록</h3>
            <div className="datatable__btns">
              <Button
                label="삭제"
                size="small"
                icon="pi pi-times"
                severity="danger"
                onClick={deleteBtn}
              />
              <Button label="추가" size="small" icon="pi pi-plus" onClick={addBtn} />
            </div>
          </div>

          <DataTable
            emptyMessage="데이터가 없습니다."
            value={data}
            selectionMode="single"
            selection={selectedRow}
            onSelectionChange={(e) => setselectedRow(e.value)}
            onRowSelect={onRowSelect}
            metaKeySelection={true}
            dataKey="code"
            showGridlines
            scrollable
            resizableColumns
            scrollHeight="flex"
          >
            <Column field="code" header="그룹코드"></Column>
            <Column field="그룹명" header="그룹명"></Column>
            <Column field="그룹용도" header="그룹용도"></Column>
            <Column field="사용여부" header="사용여부"></Column>
            <Column field="비고" header="비고"></Column>
          </DataTable>
        </section>

        {/* 상세내용 */}
        <section className="detail mt-3 width-50">
          <div className="con-header">
            <div className="con-header__title">자재그룹 상세</div>
            <div className="con-header__btns">
              <Button label="수정" severity="secondary" onClick={editBtn} size="small" />
            </div>
          </div>

          <div className="con-body">{basicInfoRows1.map((row, idx) => renderRow([row], idx))}</div>
        </section>
      </div>
    </div>
  );
};

export default MaterialGroupPage;
