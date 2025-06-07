/**
 * 채권현황 - 월별집계표
 */

import { useState, useMemo } from "react";
import { Column } from "primereact/column";
import { faker } from "@faker-js/faker";
import { DataTable } from "primereact/datatable";
import { formatNumberWithCommas } from "@/utils/common";

// 임시 데이터 생성
const tempMonthlyReport = () => {
  const selectedCustomer = "B기업";
  const months = ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06"];

  let rowNum = 1;
  const data = [];
  let previousBalance = 0;

  months.forEach((month) => {
    const occurrence = faker.number.int({ min: 100000, max: 1000000 });
    const payment = faker.number.int({ min: 0, max: occurrence });
    const carryOver = previousBalance;
    const balance = carryOver + occurrence - payment;

    data.push({
      rowNum: rowNum++,
      month,
      customerName: selectedCustomer,
      carryOver,
      occurrence,
      payment,
      balance,
      isData: true,
    });

    previousBalance = balance;
  });

  return data;
};

const DTMonthlyReport = ({ selectedCustomerName = "B기업" }) => {
  const [tableData, setTableData] = useState(tempMonthlyReport());

  // 합계 데이터 생성 함수
  const addGrandTotal = (data) => {
    const result = [...data];
    const grandTotal = data.reduce(
      (acc, row) => ({
        carryOver: (acc.carryOver || 0) + row.carryOver,
        occurrence: (acc.occurrence || 0) + row.occurrence,
        payment: (acc.payment || 0) + row.payment,
        balance: row.balance, // 마지막 잔액을 사용
      }),
      {},
    );

    // 합계 행 추가
    result.push({
      isGrandTotal: true,
      month: "합계",
      ...grandTotal,
    });

    return result;
  };

  // 합계가 포함된 데이터
  const dataWithTotal = useMemo(() => addGrandTotal(tableData), [tableData]);
  const grandTotalRow = dataWithTotal.find((row) => row.isGrandTotal);
  const dataWithoutGrandTotal = dataWithTotal.filter((row) => !row.isGrandTotal);

  return (
    <div className="pivot-table-wrapper">
      <DataTable
        emptyMessage="데이터가 없습니다."
        value={[...dataWithoutGrandTotal, grandTotalRow]}
        dataKey="rowNum"
        showGridlines
        scrollable
        scrollHeight="flex"
        resizableColumns
        rowClassName={(row) => {
          if (row.isGrandTotal) return "pivot-table-grandtotal-row";
          return "";
        }}
      >
        <Column field="rowNum" header="순번" style={{ width: "4rem" }} />
        <Column
          field="month"
          header="년월"
          style={{ width: "10rem" }}
          body={(rowData) => rowData.month}
        />
        <Column
          field="carryOver"
          header="전기(월)이월"
          style={{ width: "10rem" }}
          body={(rowData) => formatNumberWithCommas(rowData.carryOver)}
          className="text-right"
        />
        <Column
          field="occurrence"
          header="당기발생"
          style={{ width: "10rem" }}
          body={(rowData) => formatNumberWithCommas(rowData.occurrence)}
          className="text-right"
        />
        <Column
          field="payment"
          header="당기수금"
          style={{ width: "10rem" }}
          body={(rowData) => formatNumberWithCommas(rowData.payment)}
          className="text-right"
        />
        <Column
          field="balance"
          header="잔액"
          style={{ width: "10rem" }}
          body={(rowData) => formatNumberWithCommas(rowData.balance)}
          className="text-right"
        />
      </DataTable>
    </div>
  );
};

export { DTMonthlyReport };
