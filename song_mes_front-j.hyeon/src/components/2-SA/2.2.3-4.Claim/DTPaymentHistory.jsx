/**
 * 채권현황 - 수금이력테이블
 */
import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import useToastStore from "@/store/toastStore";
import { faker } from "@faker-js/faker";
import { DataTable } from "primereact/datatable";
import useDialogStore from "@/store/dialogStore";
import PaymentResonForm from "@/dialog/2-SA/PaymentResonForm2203-4";

// 임시 데이터 생성
const tempPaymentHistory = () =>
  Array.from({ length: 20 }, (_, i) => ({
    rowNum: `${i + 1}`,
    promiseDate: "2025-05-29",
    memo: `test - memo this customer payment history ${i + 1}`,
    writer: faker.helpers.arrayElement(["홍길동", "아무개", "심청"]),
    modifier: faker.helpers.arrayElement(["홍길동", "아무개", "심청"]),
  }));

const DTPaymentHistory = () => {
  const showToast = useToastStore.getState().showToast;
  const [tableData, setTableData] = useState(tempPaymentHistory());
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleSelectedUpdate = (rowData) => {
    setEditData(rowData);
    setShowDialog(true);
  };

  const handleDialogClose = (data) => {
    setShowDialog(false);
    if (data) {
      // 데이터가 있으면 저장 로직 실행
      console.log("저장된 데이터:", data);
      showToast({
        severity: "success",
        summary: "성공",
        detail: "수정되었습니다.",
      });
    }
  };

  const actionBodyTemplate = (rowData) => (
    <Button label="수정" outlined size="small" onClick={() => handleSelectedUpdate(rowData)} />
  );

  return (
    <>
      <DataTable
        emptyMessage="데이터가 없습니다."
        value={tableData}
        dataKey="rowNum"
        showGridlines
        scrollable
        scrollHeight="flex"
        resizableColumns
      >
        <Column field="rowNum" header="순번" style={{ width: "4rem" }} />
        <Column field="promiseDate" header="약속일자" style={{ width: "10rem" }} />
        <Column field="memo" header="사유" style={{ width: "72rem" }} />
        <Column field="writer" header="입력자" style={{ width: "10rem" }} />
        <Column field="modifier" header="수정자" style={{ width: "10rem" }} />
        <Column field="modify" header="수정" body={actionBodyTemplate} style={{ width: "50px" }} />
      </DataTable>

      {showDialog && <PaymentResonForm data={editData} onCloseFn={handleDialogClose} />}
    </>
  );
};

export { DTPaymentHistory };
