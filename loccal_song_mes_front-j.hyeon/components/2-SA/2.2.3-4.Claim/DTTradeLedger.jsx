/**
 * 채권현황 - 거래원장테이블
 */

import { useState, useMemo } from "react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import useToastStore from "@/store/toastStore";
import { faker } from "@faker-js/faker";
import { DataTable } from "primereact/datatable";
import { formatNumberWithCommas } from "@/utils/common";

// 임시 데이터 생성 (선택된 거래처의 데이터만 생성)
const tempTradeLedger = () => {
  const selectedCustomer = "B기업";
  const dates = [
    // 1월 데이터
    "2024-01-05",
    "2024-01-15",
    "2024-01-25",
    // 2월 데이터
    "2024-02-10",
    "2024-02-20",
    // 3월 데이터
    "2024-03-05",
    "2024-03-15",
  ];

  let rowNum = 1;
  let previousBalance = 500000; // 초기 전기이월 금액
  const data = [];

  dates.forEach((date) => {
    const value = faker.number.int({ min: 10000, max: 1000000 });
    const tax = Math.floor(value * 0.1);
    const total = value + tax;
    const payment = faker.number.int({ min: 0, max: total });
    const balance = previousBalance + total - payment;

    data.push({
      rowNum: rowNum++,
      date,
      memo: `거래내역 ${rowNum}`,
      carryOver: previousBalance, // 전기이월
      value,
      tax,
      total,
      payment,
      balance,
      isData: true,
    });

    previousBalance = balance; // 다음 거래를 위한 전기이월 업데이트
  });

  return data;
};

const DTTradeLedger = ({ selectedCustomerName = "B기업" }) => {
  const showToast = useToastStore.getState().showToast;
  const [tableData, setTableData] = useState(tempTradeLedger());
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  // 월별 월계/누계 계산
  const processedData = useMemo(() => {
    const result = [];
    let monthlyTotal = {
      carryOver: 0,
      value: 0,
      tax: 0,
      total: 0,
      payment: 0,
      balance: 0,
    };
    let cumulativeTotal = {
      carryOver: tableData[0]?.carryOver || 0, // 첫 거래의 전기이월을 누계의 전기이월로 사용
      value: 0,
      tax: 0,
      total: 0,
      payment: 0,
      balance: 0,
    };
    let currentMonth = null;

    tableData.forEach((row, index) => {
      const rowMonth = row.date.substring(0, 7); // YYYY-MM

      // 월이 변경되거나 마지막 행인 경우 월계 추가
      if (currentMonth !== null && (currentMonth !== rowMonth || index === tableData.length - 1)) {
        // 현재 행이 마지막 행이면 현재 행의 값도 포함
        if (index === tableData.length - 1) {
          monthlyTotal.carryOver = row.carryOver;
          monthlyTotal.value += row.value;
          monthlyTotal.tax += row.tax;
          monthlyTotal.total += row.total;
          monthlyTotal.payment += row.payment;
          monthlyTotal.balance = row.balance;

          cumulativeTotal.value += row.value;
          cumulativeTotal.tax += row.tax;
          cumulativeTotal.total += row.total;
          cumulativeTotal.payment += row.payment;
          cumulativeTotal.balance = row.balance;
        }

        // 월계 추가
        result.push({
          rowNum: `${result.length + 1}-M`,
          memo: "(월계)",
          carryOver: monthlyTotal.carryOver,
          value: monthlyTotal.value,
          tax: monthlyTotal.tax,
          total: monthlyTotal.total,
          payment: monthlyTotal.payment,
          balance: monthlyTotal.balance,
          isMonthly: true,
        });

        // 누계 추가
        result.push({
          rowNum: `${result.length + 1}-C`,
          memo: "(누계)",
          carryOver: cumulativeTotal.carryOver,
          value: cumulativeTotal.value,
          tax: cumulativeTotal.tax,
          total: cumulativeTotal.total,
          payment: cumulativeTotal.payment,
          balance: cumulativeTotal.balance,
          isCumulative: true,
        });

        // 월계 초기화
        monthlyTotal = {
          carryOver: row.carryOver,
          value: 0,
          tax: 0,
          total: 0,
          payment: 0,
          balance: 0,
        };
      }

      // 현재 행 추가
      if (currentMonth !== rowMonth) {
        currentMonth = rowMonth;
      }
      result.push(row);

      // 월계와 누계 누적 (마지막 행이 아닌 경우에만)
      if (index !== tableData.length - 1) {
        monthlyTotal.value += row.value;
        monthlyTotal.tax += row.tax;
        monthlyTotal.total += row.total;
        monthlyTotal.payment += row.payment;
        monthlyTotal.balance = row.balance;

        cumulativeTotal.value += row.value;
        cumulativeTotal.tax += row.tax;
        cumulativeTotal.total += row.total;
        cumulativeTotal.payment += row.payment;
        cumulativeTotal.balance = row.balance;
      }
    });

    return result;
  }, [tableData]);

  const rowClass = (data) => {
    if (data.isMonthly || data.isCumulative) {
      return "pivot-table-subtotal-row";
    }
    return "";
  };

  // No와 거래일자 컬럼의 body 템플릿
  const dateBodyTemplate = (rowData) => {
    if (rowData.isMonthly || rowData.isCumulative) {
      return null;
    }
    return rowData.date;
  };

  const numberBodyTemplate = (rowData) => {
    if (rowData.isMonthly || rowData.isCumulative) {
      return null;
    }
    return rowData.rowNum;
  };

  return (
    <DataTable
      emptyMessage="데이터가 없습니다."
      value={processedData}
      dataKey="rowNum"
      showGridlines
      scrollable
      scrollHeight="flex"
      resizableColumns
      rowClassName={rowClass}
    >
      <Column field="rowNum" header="순번" style={{ width: "4rem" }} body={numberBodyTemplate} />
      <Column field="date" header="거래일자" style={{ width: "10rem" }} body={dateBodyTemplate} />
      {/* 거래처명 컬럼 - 현재는 사용하지 않음 */}
      {/* <Column 
        field="customerName" 
        header="거래처명" 
        style={{ width: "15rem" }}
        body={(rowData) => {
          if (rowData.isMonthly || rowData.isCumulative) {
            return null;
          }
          return rowData.customerName;
        }}
      /> */}
      <Column field="memo" header="적요" style={{ width: "40rem" }} />
      <Column
        field="carryOver"
        header="전기이월"
        style={{ width: "10rem" }}
        body={(rowData) => formatNumberWithCommas(rowData.carryOver)}
        className="text-right"
      />
      <Column
        field="value"
        header="가액"
        style={{ width: "10rem" }}
        body={(rowData) => formatNumberWithCommas(rowData.value)}
        className="text-right"
      />
      <Column
        field="tax"
        header="세액"
        style={{ width: "10rem" }}
        body={(rowData) => formatNumberWithCommas(rowData.tax)}
        className="text-right"
      />
      <Column
        field="total"
        header="합계"
        style={{ width: "10rem" }}
        body={(rowData) => formatNumberWithCommas(rowData.total)}
        className="text-right"
      />
      <Column
        field="payment"
        header="수금액"
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
  );
};

export { DTTradeLedger };
