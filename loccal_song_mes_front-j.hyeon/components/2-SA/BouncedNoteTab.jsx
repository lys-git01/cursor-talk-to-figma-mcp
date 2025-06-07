import React, { useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { TabMenu } from "primereact/tabmenu";
import useToastStore from "@/store/toastStore";
import { formatNumberWithCommas } from "@/utils/common";

export const BouncedNoteTab = ({ activeIndex, setActiveIndex, selectedCustomerName }) => {
  const showToast = useToastStore.getState().showToast;

  const tabItems = [
    { label: "부도어음 내역", index: 0 },
    { label: "회수 History", index: 1 },
    { label: "담당자별 집계", index: 2 },
  ];

  const handleTabChange = (e) => {
    if (!selectedCustomerName) {
      showToast({
        severity: "error",
        summary: "이동 불가",
        detail: "거래처를 선택해주세요.",
      });
      return;
    }
    console.log(e.value.index);

    setActiveIndex(e.value.index);
  };

  return (
    <div className="BouncedNoteTab flex mt-3">
      <TabMenu
        model={[tabItems[0]]}
        activeIndex={activeIndex === 0 ? 0 : -1}
        onTabChange={() => setActiveIndex(0)}
        className="big-tabmenu"
      />
      <div className="small-tabmenu">
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
          model={[tabItems[1]]}
          activeIndex={activeIndex === 1 ? 0 : -1}
          onTabChange={(e) => handleTabChange(e)}
        />
      </div>
      <TabMenu
        model={[tabItems[2]]}
        activeIndex={activeIndex === 2 ? 0 : -1}
        onTabChange={() => setActiveIndex(2)}
        className="last-tabmenu"
      />
    </div>
  );
};
