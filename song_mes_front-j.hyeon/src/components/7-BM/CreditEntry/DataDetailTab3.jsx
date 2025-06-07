import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { renderRow } from "@/utils/common";
import { faker } from "@faker-js/faker";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";

const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    id: (1000 + index).toString(),
    order: index + 1,
    date: faker.date.between({ from: "2025-01-01", to: "2025-12-31" }).toISOString().split("T")[0],
    type: faker.helpers.arrayElement(["Normal", "Abnormal", "Missing", "Excess"]),
    reason: faker.lorem.words(3),
    modifier: faker.name.fullName(),
  }));
};

const sampleList = generateSampleList(30);

const DataDetailTab3 = ({ company = "company" }) => {
  const openDialog = useDialogStore((s) => s.openDialog);
  const [salesDetails, setSalesDetails] = useState();
  const [selectedRow, setSelectedRow] = useState(null);
  const showToast = useToastStore.getState().showToast;

  const onRowSelect = (event) => {
    showToast({
      severity: "info",
      summary: "Product Selected",
      detail: `Name: ${event.data.order}`,
      life: 3000,
    });
  };

  useEffect(() => {
    // TODO 백엔드 데이터 호출
    console.log(company, "백엔드 데이터");
    setSalesDetails(sampleList);

    setSelectedRow(sampleList[0]);
  }, []);

  // TODO 버튼 클릭 시 호출되는 함수
  const handleEdit = (rowData) => {
    // rowData를 기반으로 수정 작업 수행
    console.log("수정할 데이터:", rowData, InfoRows);
    // 임시 데이터를 전달함 수정해야함
    openDialog("AddCreditEntry7102", {
      company: company || "거래처명",
      state: "수정",
      data: InfoRows,
    });
  };

  const handleDelete = (rowData) => {
    // rowData를 기반으로 삭제 작업 수행
    console.log("삭제할 데이터:", rowData);
    confirmDialog({
      message: `${rowData.id}을(를) 정말로 삭제하시겠습니까?`,
      header: "거래처 삭제",
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
      summary: "거래처 삭제",
      detail: "거래처가 삭제되었습니다.",
      life: 3000,
    });
  };

  const addCreditEntryBtn = () => {
    openDialog(
      "AddCreditEntry7102", // 고유는 뒤에 숫자
      { company: company || "거래처명", state: "추가" },
    );
  };

  // 버튼을 렌더링하는 템플릿 함수
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="buttonSet">
        <Button
          label="삭제"
          outlined
          size="small"
          severity="danger"
          onClick={() => handleDelete(rowData)}
        />
        <Button label="수정" outlined size="small" onClick={() => handleEdit(rowData)} />
      </div>
    );
  };

  const InfoRows = [
    [{ label: "거래처명", value: "거래처명" }],
    [{ label: "변경일", value: selectedRow?.date || "2025-01-01" }],
    [{ label: "변경유형", value: "등급조정" }],
    [{ label: "변경사유", value: "변경사유" }],
    [{ label: "거래처등급", value: "정상" }],
    [
      { label: "결제일", value: "2025-01-01" },
      { label: "여신계산시작일", value: "2025-01-01" },
    ],
    [
      { label: "결제유예일", value: "1일" },
      { label: "수금 에이징 시작일", value: "2025-01-01" },
    ],
  ];

  return (
    <div className="tab3">
      <div className="con-header">
        <h4 className="con-header__title">여신관리 내역</h4>
        <Button label="추가" onClick={addCreditEntryBtn} />
      </div>
      <DataTable
        emptyMessage="데이터가 없습니다."
        value={salesDetails}
        selectionMode="single"
        selection={selectedRow}
        onSelectionChange={(e) => setSelectedRow(e.value)}
        onRowSelect={onRowSelect}
        metaKeySelection={true}
        dataKey="id"
        showGridlines
        scrollable
        size="small"
        scrollHeight="calc(60vh - 240px)"
        rowClassName={(rowData) => (rowData.quit ? "allRed" : "")}
      >
        <Column field="order" header="순서"></Column>
        <Column field="date" header="일자"></Column>
        <Column field="type" header="구분"></Column>
        <Column field="reason" header="조정사유"></Column>
        <Column field="modifier" header="수정자"></Column>
        <Column header="삭제 / 수정" body={actionBodyTemplate} style={{ width: "150px" }} />
      </DataTable>
      <div className="con-body mt-5">{InfoRows.map((row, idx) => renderRow(row, idx))}</div>
    </div>
  );
};

export default DataDetailTab3;
