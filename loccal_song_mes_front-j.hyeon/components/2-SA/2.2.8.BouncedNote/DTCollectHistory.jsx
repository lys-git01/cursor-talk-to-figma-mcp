/**
 * 부도어음관리 - 회수이력
 */
import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import useToastStore from "@/store/toastStore";
import { faker } from "@faker-js/faker";
import { DataTable } from "primereact/datatable";
import useDialogStore from "@/store/dialogStore";
import { formatNumberWithCommas, renderRow } from "@/utils/common";

// 임시 데이터 생성
const tempPaymentHistory = () =>
  Array.from({ length: 20 }, (_, i) => ({
    rowNum: `${i + 1}`,
    promiseDate: "2025-06-05",
    collectDate: "2025-06-05",
    reason: `test ${i + 1}`,
    writer: faker.helpers.arrayElement(["홍길동", "아무개", "심청"]),
    modifier: faker.helpers.arrayElement(["홍길동", "아무개", "심청"]),
    // 상세 목록
    planDate: "2025-06-05",
    bouncedPrice: faker.number.int({ min: 0, max: 1000000 }),
    collectPrice: faker.number.int({ min: 0, max: 1000000 }),
    manageCode: "관리코드",
    customerName: faker.company.name(),
    balance: faker.number.int({ min: 0, max: 1000000 }),
    paymentPlan: `test - payment plan ${i + 1}`,
  }));

const DTCollectHistory = ({ selectedCustomerName }) => {
  const openDialog = useDialogStore((s) => s.openDialog);
  const showToast = useToastStore.getState().showToast;
  const [tableData, setTableData] = useState(tempPaymentHistory());
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const valueEmptyCheck = (value) => {
    if (!value) return value;
    return formatNumberWithCommas(value);
  };

  const [selectedBouncedNote, setSelectedBouncedNote] = useState({
    planDate: "2025-01-01",
    bouncedPrice: "1,000",
    manageCode: "관리코드",
    collectPrice: "100",
    customerName: "거래처명",
    balance: "900",
    paymentPlan: "수금계획내용",
  });

  // 상세 정보 데이터 구조
  const collectHistoryDetails = [
    [
      {
        label: "계획일",
        value: selectedBouncedNote?.planDate,
      },
      {
        label: "부도금액",
        value: selectedBouncedNote?.bouncedPrice,
      },
    ],
    [
      {
        label: "관리코드",
        value: selectedBouncedNote?.manageCode,
      },
      {
        label: "회수금액",
        value: selectedBouncedNote?.collectPrice,
      },
    ],
    [
      {
        label: "거래처명",
        value: selectedBouncedNote?.customerName,
      },
      {
        label: "잔금",
        value: selectedBouncedNote?.balance,
      },
    ],
    [
      {
        label: "수금계획",
        value: selectedBouncedNote?.paymentPlan,
        fullWidth: true,
      },
    ],
  ];

  // TODO
  const handleAddOrEdit = (rowData, type) => {
    openDialog("CollectHistoryForm2208", {
      data: {
        ...rowData,
        customerName: selectedCustomerName,
      },
      mode: type,
      callback: (result) => {
        if (result) {
          setSelectedBouncedNote({
            ...selectedBouncedNote,
            status: result.status,
          });
        }
      },
    });
  };

  const actionBodyTemplate = (rowData, type) => {
    return (
      <div className="buttonSet">
        <Button
          label="수정"
          outlined
          size="small"
          onClick={() => {
            handleAddOrEdit(rowData, "edit");
          }}
        />
        <Button
          label="삭제"
          outlined
          size="small"
          severity="danger"
          onClick={() => handleDelete(rowData)}
        />
      </div>
    );
  };

  return (
    <div id="SAContainer">
      <div className="sa-half-con datatable-con">
        <section className="datatable width-100">
          <div className="datatable__header">
            <h3>회수 History</h3>
            <div className="con-header__btns">
              <Button label="추가" onClick={() => handleAddOrEdit(null, "add")} />
            </div>
          </div>
          <div className="datatable__body mt-3">
            <DataTable
              emptyMessage="데이터가 없습니다."
              value={tableData}
              dataKey="rowNum"
              showGridlines
              scrollable
              scrollHeight="flex"
              resizableColumns
              metaKeySelection={true}
              className="width-100"
            >
              <Column field="rowNum" header="순번" className="text-center" />
              <Column field="promiseDate" header="약속일자" />
              <Column field="reason" header="사유" style={{ width: "40rem" }} />
              <Column
                field="collectPrice"
                header="회수금액"
                className="text-right"
                body={(rowData) => valueEmptyCheck(rowData.collectPrice)}
              />
              <Column field="writer" header="입력자" />
              <Column field="modifier" header="수정자" />
              <Column
                field="modify"
                header="수정"
                body={actionBodyTemplate}
                style={{ width: "50px" }}
              />
            </DataTable>
          </div>
        </section>
      </div>
      <section className="detail ">
        <div className="con-body">
          {collectHistoryDetails.map((row, idx) => renderRow(row, idx))}
        </div>
      </section>
    </div>
  );
};

export { DTCollectHistory };
