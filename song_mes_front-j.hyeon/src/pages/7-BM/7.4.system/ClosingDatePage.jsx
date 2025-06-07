/*  7.4.8.마감일등록 : A0045, BM-7408 */

import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { renderRow } from "@/utils/common";

const STATUS = ["사용", "미사용"];

const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    module: (1000 + index).toString(),
    siteName: `(주)송운사`,
    code: index + 1,
    closeName: `Sample Closing Name ${index + 1}`,
    closeDate: "2025-05-26",
    status: STATUS[Math.floor(Math.random() * STATUS.length)],
    memo: `test ${index + 1}`,
  }));
};

const sampleList = generateSampleList(30);

const ClosingDatePage = () => {
  const [selectedRow, setselectedRow] = useState(null);
  const [data, setData] = useState(sampleList);
  const openDialog = useDialogStore((s) => s.openDialog);
  const showToast = useToastStore.getState().showToast;

  // TODO 백엔드 호출 상세 데이터 교체
  const onRowSelect = (event) => {
    showToast({
      severity: "info",
      summary: "Selected Row",
      detail: `Module: ${event.data.module}`,
      life: 3000,
    });
  };

  useEffect(() => {
    setselectedRow(sampleList[0]);
  }, [sampleList]);

  // TODO
  const basicInfoRows1 = [
    { label: "모듈", value: selectedRow?.module },
    { label: "현장명", value: selectedRow?.siteName },
    { label: "코드", value: selectedRow?.code },
    { label: "마감명", value: selectedRow?.closeName },
    { label: "마감일", value: selectedRow?.closeDate },
    { label: "사용여부", value: selectedRow?.status, colorSet: true },
    { label: "비고", value: selectedRow?.memo, memo: true },
  ];

  // TODO
  const addBtn = () => {
    openDialog("ClosingDateForm7408", {
      data,
      state: "추가",
    });
  };

  // TODO
  const editBtn = () => {
    openDialog("ClosingDateForm7408", {
      data: selectedRow,
      state: "수정",
    });
  };

  // TODO
  const deleteBtn = () => {
    console.log("deleteBtn", selectedRow);
    confirmDialog({
      message: `마감일을(를) 정말로 삭제하시겠습니까?`,
      header: "마감일 삭제",
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
      summary: "마감일 삭제",
      detail: "마감일이 삭제되었습니다.",
      life: 3000,
    });
  };

  return (
    <div id="ClosingDate">
      {/* 테이블 */}
      <div className="ClosingDate-con content-box flex gap-3">
        <section className="datatable">
          <div className="datatable__header">
            <h3>마감일등록 목록</h3>
            <div className="datatable__btns">
              <Button
                label="삭제"
                size="small"
                severity="danger"
                icon="pi pi-times"
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
            dataKey="module"
            showGridlines
            scrollable
            resizableColumns
            scrollHeight="flex"
            rowClassName={(rowData) => (rowData.status === "미사용" ? "text-red-500" : "")}
          >
            <Column field="module" header="모듈"></Column>
            <Column field="siteName" header="현장명"></Column>
            <Column field="code" header="코드"></Column>
            <Column field="closeName" header="마감명"></Column>
            <Column field="closeDate" header="마감일자"></Column>
            <Column field="status" header="여부"></Column>
          </DataTable>
        </section>

        {/* 상세내용 */}
        <section className="detail">
          <div className="con-header">
            <div className="con-header__title">마감일등록 상세</div>
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

export default ClosingDatePage;
