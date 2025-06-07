import React, { useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { TabMenu } from "primereact/tabmenu";
import useToastStore from "@/store/toastStore";
import { formatNumberWithCommas } from "@/utils/common";

export const ClaimStatusTab = ({
  activeIndex,
  setActiveIndex,
  selectedCustomerName,
  totalData,
}) => {
  const showToast = useToastStore.getState().showToast;

  const tabItems = [
    { label: "채권현황", index: 0 },
    { label: "월별 집계표", index: 1 },
    { label: "거래 원장", index: 2 },
    { label: "수금 History", index: 3 },
  ];

  const handleTabChange = (e) => {
    // 채권현황(index: 0)으로 돌아가는 경우는 항상 허용
    if (e.value.index === 0) {
      setActiveIndex(0);
      return;
    }

    if (!selectedCustomerName) {
      showToast({
        severity: "error",
        summary: "이동 불가",
        detail: "거래처를 선택해주세요.",
      });
      return;
    }

    setActiveIndex(e.value.index);
  };

  return (
    <div className="ClaimStatusTab flex mt-3">
      <TabMenu
        model={[tabItems[0]]}
        activeIndex={activeIndex === 0 ? 0 : -1}
        onTabChange={() => setActiveIndex(0)}
        className="left-tabmenu"
      />
      <div className="right-tabmenu">
        <div className="selected-tabmenu p-tabmenu">
          <ul className="p-tabmenu-nav">
            <li className="p-tabmenuitem">
              <InputText
                placeholder="선택한 행의 거래처명"
                value={selectedCustomerName}
                disabled
              ></InputText>
            </li>
          </ul>
        </div>
        <TabMenu
          model={tabItems.slice(1)}
          activeIndex={activeIndex > 0 ? activeIndex - 1 : -1}
          onTabChange={handleTabChange}
        />
      </div>
      {activeIndex === 0 && (
        <DataTable value={totalData} className="total-data" showGridlines>
          <Column
            field="totalCarryOver"
            header="전기(월)이월"
            style={{ width: "10rem" }}
            className="text-right "
            body={(rowData) => formatNumberWithCommas(rowData.totalCarryOver)}
          />
          <Column
            field="totalAccrual"
            header="당기발생"
            style={{ width: "10rem" }}
            className="text-right"
            body={(rowData) => formatNumberWithCommas(rowData.totalAccrual)}
          />
          <Column
            field="totalPayment"
            header="당기수금"
            style={{ width: "10rem" }}
            className="text-right"
            body={(rowData) => formatNumberWithCommas(rowData.totalPayment)}
          />
          <Column
            field="totalBalance"
            header="잔액"
            style={{ width: "10rem" }}
            className="text-right"
            body={(rowData) => formatNumberWithCommas(rowData.totalBalance)}
          />
          <Column
            field="totalBillBalance"
            header="어음잔액"
            style={{ width: "10rem" }}
            className="text-right"
            body={(rowData) => formatNumberWithCommas(rowData.totalBillBalance)}
          />
        </DataTable>
      )}
    </div>
  );
};
