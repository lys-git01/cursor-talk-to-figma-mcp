/* 2.2.8.부도어음관리 : A8550, SA-2208 */

import {
  DTBouncedNoteDetail,
  DTCollectHistory,
  DTManagerReport,
} from "@/components/2-SA/BouncedDataTableGather";
import { BouncedNoteTab } from "@/components/2-SA/BouncedNoteTab";
import { useEffect, useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Panel } from "primereact/panel";
import ComSearch from "@/components/ComSearch";
import { faker } from "@faker-js/faker";
import useToastStore from "@/store/toastStore";
import { formatNumberWithCommas, renderRow } from "@/utils/common";
import useDialogStore from "@/store/dialogStore";
import { useNavigate } from "react-router-dom";
import { TabPanel, TabView } from "primereact/tabview";

const BouncedNotePage = () => {
  const showToast = useToastStore.getState().showToast;
  const [saveObject, setSaveObject] = useState({}); // 검색용
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const searchCategory = {
    pageCode: 2208,
    dates: [
      {
        label: "부도일자",
        startDate: "1YearAgo",
        endDate: "today",
        labelOptions: ["부도일자", "만기일자"],
      },
    ],
    text: [],
    select: ["select1", "select2"],
    detailedSearch: {
      isUse: true,
      detailList: {
        text: ["거래처", "어음번호"],
        callList: ["담당자"],
        dateText: [],
      },
    },
  };

  const renderTabPanel = () => {
    // 상단 탭에 따른 DTBondStatus 렌더링
    const bouncedNoteComponent = (
      <DTBouncedNoteDetail pageCode={2208} setSelectedCustomerName={setSelectedCustomerName} />
    );

    // 하단 탭 컴포넌트 렌더링
    if (selectedCustomerName === "" && activeIndex > 0) {
      showToast({
        severity: "error",
        summary: "이동 불가",
        detail: "거래처를 선택해주세요.",
      });
      return bouncedNoteComponent;
    }

    switch (activeIndex) {
      case 0:
        return bouncedNoteComponent;
      case 1:
        return <DTCollectHistory selectedCustomerName={selectedCustomerName} />;
      case 2:
        return <DTManagerReport selectedCustomerName={selectedCustomerName} />;
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
    <div id="SAContainer" className="BouncedNotePage has-abs-btns">
      <ComSearch
        searchCategory={searchCategory}
        setSaveObject={setSaveObject}
        disabled={activeIndex !== 0}
      />
      <div className="mt-3">
        <BouncedNoteTab
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          selectedCustomerName={selectedCustomerName}
        />
        <div className="p-tabview-panels">{renderTabPanel()}</div>
      </div>
      <div className="abs_btns">
        <Button label="엑셀" icon="pi pi-download" onClick={handleExport} />
        {activeIndex !== 1 ? (
          <Button label="출력" icon="pi pi-print" onClick={handlePrint} />
        ) : null}
      </div>
    </div>
  );
};

export default BouncedNotePage;
