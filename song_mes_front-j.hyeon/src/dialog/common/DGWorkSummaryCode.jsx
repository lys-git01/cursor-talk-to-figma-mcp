// 작업적요코드	L1027	DG-workSummaryCode	DG-13

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import useToastStore from "@/store/toastStore";
const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    code: (1000 + index).toString(),
    name: `Name${index + 1}`,
  }));
};
const sampleList = generateSampleList(30);

const DGWorkSummaryCode = ({ onCloseFn }) => {
  const showToast = useToastStore.getState().showToast;
  const [workSummaryCode, setWorkSummaryCode] = useState([]);
  const [selectedWorkSummaryCode, setSelectedWorkSummaryCode] = useState(null);

  const onRowSelect = (event) => {
    showToast({
      severity: "info",
      summary: "선택 완료",
      detail: `청구명: ${event.data.name}`,
      life: 3000,
    });
  };

  useEffect(() => {
    // TODO
    showToast({
      severity: "info",
      summary: "백엔드 api 호출",
      detail: "백엔드 api 호출",
    });
    setWorkSummaryCode(sampleList);
  }, []);

  const selectedItemsBtn = () => {
    onCloseFn(selectedWorkSummaryCode);
  };
  return (
    <Dialog
      header="작업적요코드 선택"
      visible
      modal={false}
      onHide={() => onCloseFn([])}
      className="DGWorkSummaryCode"
    >
      <div className="Dialog-container">
        <div className="DGBillingCode-table">
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={workSummaryCode}
            selectionMode={"checkbox"}
            selection={selectedWorkSummaryCode}
            onSelectionChange={(e) => setSelectedWorkSummaryCode(e.value)}
            onRowSelect={onRowSelect}
            metaKeySelection={true}
            dataKey="code"
            showGridlines
            scrollable
            size="small"
            scrollHeight="calc(60vh - 240px)"
            // virtualScrollerOptions={{ itemSize: 43 }}
            // resizableColumns
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
            <Column field="code" header="코드"></Column>
            <Column field="name" header="적요이름"></Column>
          </DataTable>
        </div>
      </div>

      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={() => onCloseFn([])}></Button>
        <Button label="선택" onClick={selectedItemsBtn}></Button>
      </div>
    </Dialog>
  );
};

export default DGWorkSummaryCode;
