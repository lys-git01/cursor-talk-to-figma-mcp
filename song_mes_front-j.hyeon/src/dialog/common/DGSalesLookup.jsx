/* 매출내역조회 L3049 DG-salesLookup DG-49 */

import { useMemo, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { faker } from "@faker-js/faker";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { formatNumberWithCommas } from "@/utils/common";

// 임시 데이터 생성
const tempSalesLookup = () =>
  Array.from({ length: 5 }, (_, i) => {
    return {
      rowNum: `${i + 1}`,
      paymentNum: `SH250${i + 500000}`,
      paymentDate: "2025-05-29",
      paymentName: "수주명",
      price: faker.number.int({ min: 1, max: 100 }),
      writer: faker.helpers.arrayElement(["홍길동", "아무개", "심청"]),
    };
  });

const DGSalesLookup = ({ data, onCloseFn }) => {
  const toast = useRef(null);

  const [tableData, setTableData] = useState(tempSalesLookup());

  // 합계 계산
  const totalRow = useMemo(() => {
    return tableData.reduce(
      (acc, row) => ({
        rowNum: "합계",
        price: (acc.price || 0) + row.price,
      }),
      {},
    );
  }, [tableData]);

  return (
    <Dialog
      header={`매출 내역 조회`}
      visible
      onHide={() => onCloseFn(null)}
      className="DGSalesLookup"
      style={{ width: "45vw" }}
    >
      <Toast ref={toast} />
      <div className="Dialog-container form-list pivot-table-wrapper">
        <div className="form__input">
          <p>거래처명</p>
          <span className="flex-1">{data}</span>
          <div className="float-right text-red-500">* 부가세 미포함 금액</div>
        </div>
        <DataTable emptyMessage="내역이 없습니다." value={tableData}>
          <Column field="rowNum" header="순번" />
          <Column field="paymentNum" header="수주번호" />
          <Column field="paymentDate" header="수주일자" />
          <Column field="paymentName" header="수주명" />
          <Column field="price" header="금액" className="text-right" />
          <Column field="writer" header="작성자" />
        </DataTable>
        <div className="pivot-table-footer-fixed">
          <div className="footer-label">합계</div>
          <div></div>
          <div className="text-right">{formatNumberWithCommas(tableData.length)}</div>
          <div></div>
          <div className="text-right">{formatNumberWithCommas(totalRow.price)}</div>
          <div></div>
        </div>
      </div>
      <div className="Dialog__btns">
        <Button label="닫기" severity="secondary" onClick={() => onCloseFn(null)} />
      </div>
    </Dialog>
  );
};

export default DGSalesLookup;
