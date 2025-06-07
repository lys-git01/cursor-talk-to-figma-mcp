/*  2.2.4.구)채권현황(2020) : Y1010, SA-2204 */

import {
  DTBondStatus,
  DTMonthlyReport,
  DTPaymentHistory,
  DTTradeLedger,
} from "@/components/2-SA/ClaimDataTableGather";
import { ClaimStatusTab } from "@/components/2-SA/ClaimStatusTab";
import ComSearch from "@/components/ComSearch";
import useToastStore from "@/store/toastStore";
import { Button } from "primereact/button";
import { useState } from "react";

const OldClaim2020Page = () => {
  const showToast = useToastStore.getState().showToast;
  const [saveObject, setSaveObject] = useState({}); // 검색용
  const [selectedCustomerName, setSelectedCustomerName] = useState("");

  const [activeIndex, setActiveIndex] = useState(0);
  const [totalData, setTotalData] = useState([
    {
      totalCarryOver: 0,
      totalAccrual: 0,
      totalPayment: 0,
      totalBalance: 0,
      totalBillBalance: 0,
    },
  ]);

  const searchCategory = {
    pageCode: 2203,
    text: [],
    dates: [
      {
        label: "조회기간",
        startDate: "firstDay",
        endDate: "today",
        isHelp: true,
      },
    ],
    multiSelect: ["여신등급"],
    callList: [],
    detailedSearch: {
      isUse: true,
      detailList: {
        text: ["거래처"],
        callList: ["담당자"],
      },
    },
  };

  const renderTabPanel = () => {
    // 상단 탭에 따른 DTBondStatus 렌더링
    const bondStatusComponent = (
      <DTBondStatus
        pageCode={2203}
        setSelectedCustomerName={setSelectedCustomerName}
        setTotalData={setTotalData}
      />
    );

    // 하단 탭 컴포넌트 렌더링
    if (selectedCustomerName === "" && activeIndex > 0) {
      showToast({
        severity: "error",
        summary: "이동 불가",
        detail: "거래처를 선택해주세요.",
      });
      return bondStatusComponent;
    }

    switch (activeIndex) {
      case 0:
        return bondStatusComponent;
      case 1:
        return <DTMonthlyReport selectedCustomerName={selectedCustomerName} />;
      case 2:
        return <DTTradeLedger selectedCustomerName={selectedCustomerName} />;
      case 3:
        return <DTPaymentHistory selectedCustomerName={selectedCustomerName} />;
      default:
        return null;
    }
  };

  const handleExport = () => {
    showToast({
      severity: "info",
      summary: "알림",
      detail: "엑셀 출력",
    });
  };

  const handlePrint = () => {
    showToast({
      severity: "info",
      summary: "알림",
      detail: "출력",
    });
  };

  return (
    <div id="SAContainer" className="ClaimStatusPage has-abs-btns">
      <ComSearch
        searchCategory={searchCategory}
        setSaveObject={setSaveObject}
        disabled={activeIndex !== 0 ? true : false}
      />
      <div className="mt-3">
        <ClaimStatusTab
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          selectedCustomerName={selectedCustomerName}
          totalData={totalData}
        />
        <div className="p-tabview-panels">{renderTabPanel()}</div>
      </div>
      <div className="abs_btns">
        <Button label="엑셀" icon="pi pi-download" onClick={handleExport} />
        {activeIndex === 0 || activeIndex === 2 ? (
          <Button label="출력" icon="pi pi-print" onClick={handlePrint} />
        ) : null}
      </div>
    </div>
  );
};

export default OldClaim2020Page;
