/**
 * 채권현황 - 채권현황테이블
 */

import { useEffect, useState, useMemo } from "react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import useToastStore from "@/store/toastStore";
import { faker } from "@faker-js/faker";
import { DataTable } from "primereact/datatable";
import { formatDates, formatNumberWithCommas } from "@/utils/common";
import useDialogStore from "@/store/dialogStore";

// 임시 데이터 생성
const tempBondStatus = () =>
  Array.from({ length: 20 }, (_, i) => {
    // 오늘 날짜 기준으로 -90일 ~ +90일 사이의 랜덤한 날짜 생성
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 181) - 90; // -90 ~ +90 사이의 랜덤한 일수
    const randomDate = new Date(today.getTime() + randomDays * 24 * 60 * 60 * 1000);
    const formattedDate = randomDate.toISOString().split("T")[0];

    return {
      rowNum: `${i + 1}`,
      customerCode: `CODE ${i + 100000}`,
      customerName: faker.helpers.arrayElement(["A기업", "B기업", "C기업"]),
      manager: faker.helpers.arrayElement(["홍길동", "아무개", "심청"]),
      carryOver: faker.number.int({ min: 1, max: 100 }),
      accrual: faker.number.int({ min: 1, max: 100 }),
      payment: faker.number.int({ min: 1, max: 100 }),
      balance: faker.number.int({ min: 0, max: 100 }), // 잔액은 0 포함하도록 수정
      billBalance: faker.number.int({ min: 1, max: 100 }),
      totalPrice: faker.number.int({ min: 1, max: 100 }),
      memo: `test ${i + 1}`,
      credit: faker.helpers.arrayElement([
        "등급없음",
        "우수",
        "정상",
        "경계",
        "불량",
        "거래중지",
        "악성",
        "악성채권",
      ]),
      aging: "2025-05-29",
      promiseDate: formattedDate,
      isManaged: faker.datatype.boolean(), // 관리 거래처 여부
    };
  });

const DTBondStatus = ({
  setSelectedCustomerName,
  setTotalData,
  showOnlyManaged = false,
  pageCode,
}) => {
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);
  const [tableData, setTableData] = useState(tempBondStatus());
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const today = formatDates("today");

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    const data = showOnlyManaged ? tableData.filter((row) => row.isManaged) : tableData;
    return data;
  }, [tableData, showOnlyManaged]);

  // 초기 렌더링 시 모든 행 선택
  useEffect(() => {
    if (filteredData.length > 0) {
      setSelectedRows(filteredData);
      setSelectedRow(filteredData[0]);
      setSelectedCustomerName(filteredData[0].customerName);
    }
  }, [filteredData, setSelectedCustomerName, tableData]);

  // 데이터가 필터링될 때 선택된 행도 업데이트
  useEffect(() => {
    if (showOnlyManaged) {
      const managedRows = filteredData.filter((row) => row.isManaged);
      setSelectedRows(managedRows);
      if (managedRows.length > 0) {
        setSelectedRow(managedRows[0]);
        setSelectedCustomerName(managedRows[0].customerName);
      }
    }
  }, [showOnlyManaged, filteredData]);

  // 선택된 행들의 합계 데이터 업데이트
  useEffect(() => {
    if (selectedRows.length > 0) {
      const selectedTotal = selectedRows.reduce(
        (acc, row) => ({
          totalCarryOver: (acc.totalCarryOver || 0) + row.carryOver,
          totalAccrual: (acc.totalAccrual || 0) + row.accrual,
          totalPayment: (acc.totalPayment || 0) + row.payment,
          totalBalance: (acc.totalBalance || 0) + row.balance,
          totalBillBalance: (acc.totalBillBalance || 0) + row.billBalance,
        }),
        {},
      );
      setTotalData([selectedTotal]);
    } else {
      setTotalData([
        {
          totalCarryOver: 0,
          totalAccrual: 0,
          totalPayment: 0,
          totalBalance: 0,
          totalBillBalance: 0,
        },
      ]);
    }
  }, [selectedRows, setTotalData]);

  // 합계 데이터 생성 함수
  const addGrandTotal = (data) => {
    const grandTotal = data.reduce(
      (acc, row) => ({
        carryOver: (acc.carryOver || 0) + row.carryOver,
        accrual: (acc.accrual || 0) + row.accrual,
        payment: (acc.payment || 0) + row.payment,
        balance: (acc.balance || 0) + row.balance,
        billBalance: (acc.billBalance || 0) + row.billBalance,
      }),
      {},
    );

    return {
      isGrandTotal: true,
      isSelected: false,
      ...grandTotal,
    };
  };

  // 체크박스 상태를 포함한 테이블 데이터
  const tableDataWithSelection = useMemo(() => {
    return filteredData.map((row) => ({
      ...row,
      isSelected: selectedRows.some((selected) => selected.rowNum === row.rowNum),
    }));
  }, [filteredData, selectedRows]);

  // 합계가 포함된 데이터
  const grandTotalRow = useMemo(() => {
    return addGrandTotal(filteredData);
  }, [filteredData]);

  const handleHeaderCheckboxChange = (e) => {
    if (e.checked) {
      setSelectedRows([...filteredData]);
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowCheckboxChange = (rowData, checked) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, rowData]);
    } else {
      setSelectedRows((prev) =>
        prev.filter(
          (row) => !(row.customerCode === rowData.customerCode && row.rowNum === rowData.rowNum),
        ),
      );
    }
  };

  const actionBodyTemplate = (rowData, type) => {
    if (rowData.isGrandTotal) return null;
    return type === "customer" ? (
      <Button
        label="거래처명"
        outlined
        size="small"
        onClick={() => handleShowCustomerInfo(rowData)}
      />
    ) : (
      <Button label="관리" outlined size="small" onClick={() => handleSelectedManage(rowData)} />
    );
  };

  const handleShowCustomerInfo = (rowData) => {
    openDialog("DGClientInfo", {
      data: rowData,
    });
  };

  const handleSelectedManage = (rowData) => {
    console.log(rowData);
    // 관리 다이얼로그 열기
    openDialog("DGClaimListManage", {
      data: {
        customerCode: rowData.customerCode,
        customerName: rowData.customerName,
        isManaged: rowData.isManaged,
        memo: rowData.memo,
      },
      callback: (result) => {
        if (result) {
          showToast({
            severity: "info",
            summary: "알림",
            detail: "관리 비고가 저장되었습니다.",
          });
          // 콜백 처리 - 관리 상태 업데이트
          const updatedData = tableData.map((item) => {
            if (item.customerCode === result.customerCode) {
              return {
                ...item,
                isManaged: !item.isManaged,
                memo: result.memo,
              };
            }
            return item;
          });
          setTableData(updatedData);
        }
      },
    });
  };

  // pageCode에 따른 bodyClassName 설정
  const getBodyClassName = (field, rowData) => {
    let className = "text-right";
    if (pageCode === "2203" || (pageCode === "2203" && rowData.isManaged)) {
      className += " text-blue-500";
    }
    return className;
  };

  // 합계 행 텍스트 표시 함수
  const totalRowText = (rowData) => {
    if (rowData.isGrandTotal) {
      return "합계";
    }
    return rowData.customerCode;
  };

  return (
    <div className="bond-status-container pivot-table-wrapper">
      <DataTable
        emptyMessage="데이터가 없습니다."
        value={[...tableDataWithSelection, grandTotalRow]}
        selectionMode="single"
        selection={selectedRow}
        onSelectionChange={(e) => setSelectedRow(e.value)}
        metaKeySelection={true}
        dataKey="customerCode"
        showGridlines
        scrollable
        scrollHeight="flex"
        resizableColumns
        rowClassName={(row) => {
          if (row.isGrandTotal) return "pivot-table-grandtotal-row";
          return "";
        }}
      >
        <Column
          headerStyle={{ width: "3rem" }}
          header={() => (
            <Checkbox
              onChange={handleHeaderCheckboxChange}
              checked={selectedRows.length === filteredData.length}
            />
          )}
          body={(rowData) => {
            if (rowData.isGrandTotal) return null;
            return (
              <Checkbox
                onChange={(e) => handleRowCheckboxChange(rowData, e.checked)}
                checked={rowData.isSelected}
              />
            );
          }}
        />
        <Column field="rowNum" header="순번" style={{ width: "4rem" }} />
        <Column
          field="customerCode"
          header="거래처코드"
          style={{ width: "10rem" }}
          bodyClassName={(rowData) =>
            pageCode === 2203 && rowData.isManaged ? "text-blue-500" : ""
          }
          body={totalRowText}
        />
        <Column field="customerName" header="거래처명" hidden={true} />
        <Column
          body={(rowData) => actionBodyTemplate(rowData, "customer")}
          header="거래처명"
          style={{ width: "110px" }}
        />
        <Column
          field="manager"
          header="담당자"
          style={{ width: "10rem" }}
          bodyClassName={(rowData) =>
            pageCode === 2203 && rowData.isManaged ? "text-blue-500" : ""
          }
        />
        <Column
          field="carryOver"
          header="전기이월"
          style={{ width: "10rem" }}
          bodyClassName={(rowData) => getBodyClassName("carryOver", rowData)}
          body={(rowData) => formatNumberWithCommas(rowData.carryOver)}
        />
        <Column
          field="accrual"
          header="당기발생"
          style={{ width: "10rem" }}
          bodyClassName={(rowData) => getBodyClassName("accrual", rowData)}
          body={(rowData) => formatNumberWithCommas(rowData.accrual)}
        />
        <Column
          field="payment"
          header="당기수금"
          style={{ width: "10rem" }}
          bodyClassName={(rowData) => getBodyClassName("payment", rowData)}
          body={(rowData) => formatNumberWithCommas(rowData.payment)}
        />
        <Column
          field="balance"
          header="잔액"
          style={{ width: "10rem" }}
          bodyClassName={(rowData) => getBodyClassName("balance", rowData)}
          body={(rowData) => formatNumberWithCommas(rowData.balance)}
        />
        <Column
          field="billBalance"
          header="어음잔액"
          style={{ width: "10rem" }}
          bodyClassName={(rowData) => getBodyClassName("billBalance", rowData)}
          body={(rowData) => formatNumberWithCommas(rowData.billBalance)}
        />
        <Column field="credit" header="여신" style={{ width: "10rem" }} />
        <Column field="aging" header="에이징" style={{ width: "10rem" }} />
        <Column
          field="promiseDate"
          header="약속일자"
          style={{ width: "10rem" }}
          bodyClassName={(rowData) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const promiseDate = new Date(rowData.promiseDate);
            promiseDate.setHours(0, 0, 0, 0);
            return promiseDate <= today && rowData.balance > 0 ? "text-red-500" : "";
          }}
        />
        <Column field="memo" header="비고" style={{ width: "10rem" }} />
        {pageCode === 2203 && (
          <Column
            field="manage"
            header="관리"
            body={(rowData) => actionBodyTemplate(rowData, "manage")}
            style={{ width: "50px" }}
          />
        )}
      </DataTable>
    </div>
  );
};

export { DTBondStatus };
