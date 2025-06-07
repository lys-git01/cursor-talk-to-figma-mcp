/* 7.2.2.공정코드등록 H1013, BM-7202 */
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import ProcessCodeEntryDetail from "@/components/7-BM/ProcessCodeEntryDetail";

const ProcessCodeEntryPage = () => {
  const openDialog = useDialogStore((s) => s.openDialog);
  const showToast = useToastStore.getState().showToast;
  const [processData, setProcessData] = useState([]);
  const [detailProcessData, setDetailProcessData] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [selectedDetailProcess, setSelectedDetailProcess] = useState(null);

  // 임시 데이터 로드
  useEffect(() => {
    // TODO: API 연동
    const tempData = Array.from({ length: 30 }, (_, index) => ({
      code: `P${String(index + 1).padStart(3, "0")}`,
      name: `공정${index + 1}`,
      billingName: `청구명${index + 1}`,
      basicDescription: `기본적요${index + 1}`,
      displayOrder: String(index + 1).padStart(4, "0"),
      useStatus: index % 3 === 0 ? "0" : index % 3 === 1 ? "1" : "2",
      productionCost: String(Math.floor(Math.random() * 1000000)),
      salesCost: String(Math.floor(Math.random() * 1000000)),
      mainMachine: `메인기계${index + 1}`,
    }));

    const tempDetailData = Array.from({ length: 30 }, (_, index) => ({
      code: `DP${String(index + 1).padStart(3, "0")}`,
      name: `상세공정${index + 1}`,
      detailName: `상세공정명${index + 1}`,
      detailBillingName: `상세청구명${index + 1}`,
      displayOrder: String(index + 1).padStart(4, "0"),
      useStatus: index % 3 === 0 ? "0" : index % 3 === 1 ? "1" : "2",
      productionCost: String(Math.floor(Math.random() * 1000000)),
      salesCost: String(Math.floor(Math.random() * 1000000)),
      mainMachine: `상세메인기계${index + 1}`,
      processCode: `P${String(Math.floor(index / 3) + 1).padStart(3, "0")}`, // 3개의 상세공정이 하나의 공정에 속하도록 설정
    }));

    setProcessData(tempData);
    setDetailProcessData(tempDetailData);
    // 첫 로드 시 첫 번째 항목 자동 선택
    if (tempData.length > 0) {
      setSelectedProcess(tempData[0]);
      // 선택된 공정코드에 해당하는 첫 번째 상세공정코드 선택
      const firstDetailProcess = tempDetailData.find(
        (detail) => detail.processCode === tempData[0].code,
      );
      if (firstDetailProcess) {
        setSelectedDetailProcess(firstDetailProcess);
      }
    }
  }, []);

  // 공정코드 선택 시 해당하는 상세공정코드 필터링
  useEffect(() => {
    if (selectedProcess) {
      const filteredDetails = detailProcessData.filter(
        (detail) => detail.processCode === selectedProcess.code,
      );
      if (filteredDetails.length > 0) {
        setSelectedDetailProcess(filteredDetails[0]);
      } else {
        setSelectedDetailProcess(null);
      }
    }
  }, [selectedProcess, detailProcessData]);

  const handleAddProcess = () => {
    openDialog("ProcessForm7202", {
      state: "추가",
      type: "process",
      onSuccess: (newData) => {
        setProcessData([...processData, newData]);
      },
    });
  };

  const handleAddDetailProcess = () => {
    if (!selectedProcess) {
      alert("공정코드를 먼저 선택해주세요.");
      return;
    }
    openDialog("DetailProcessForm7202", {
      state: "추가",
      type: "detailProcess",
      processCode: selectedProcess.code,
      onSuccess: (newData) => {
        setDetailProcessData([...detailProcessData, newData]);
      },
    });
  };

  const handleEdit = (rowData, type) => {
    if (type === "process") {
      openDialog("ProcessForm7202", {
        state: "수정",
        type,
        data: rowData,
        onSuccess: (updatedData) => {
          setProcessData(
            processData.map((item) => (item.code === updatedData.code ? updatedData : item)),
          );
        },
      });
    } else {
      openDialog("DetailProcessForm7202", {
        state: "수정",
        type,
        data: rowData,
        processCode: selectedProcess.code,
        onSuccess: (updatedData) => {
          setDetailProcessData(
            detailProcessData.map((item) => (item.code === updatedData.code ? updatedData : item)),
          );
        },
      });
    }
  };

  const handleDelete = (rowData, type) => {
    const title = type === "process" ? "공정코드" : "상세공정코드";
    const accept = () => {
      if (type === "process") {
        setProcessData(processData.filter((item) => item.code !== rowData.code));
        // 공정코드 삭제 시 관련된 상세공정코드도 삭제
        setDetailProcessData(detailProcessData.filter((item) => item.processCode !== rowData.code));
      } else {
        setDetailProcessData(detailProcessData.filter((item) => item.code !== rowData.code));
      }

      showToast({
        severity: "info",
        summary: `${title} 삭제`,
        detail: `${rowData.code}이(가) 삭제되었습니다.`,
        life: 3000,
      });
    };
    confirmDialog({
      message: `${rowData.code}을(를) 정말로 삭제하시겠습니까?`,
      header: `${title} 삭제`,
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: accept,
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };

  const actionBodyTemplate = (rowData, type) => {
    return (
      <div className="buttonSet">
        <Button
          label="삭제"
          outlined
          size="small"
          severity="danger"
          onClick={() => handleDelete(rowData, type)}
        />
        <Button label="수정" outlined size="small" onClick={() => handleEdit(rowData, type)} />
      </div>
    );
  };

  // 선택된 공정코드에 해당하는 상세공정코드만 필터링
  const filteredDetailProcessData = detailProcessData.filter(
    (detail) => detail.processCode === selectedProcess?.code,
  );

  return (
    <div id="ProcessCodeEntry">
      <div className="ProcessCodeEntry-con flex gap-3">
        <section className="datatable width-50 flex gap-3">
          <div className="width-50">
            <div className="datatable__header">
              <h3>공정코드 목록</h3>
              <div className="datatable__btns">
                <Button label="추가" size="small" icon="pi pi-plus" onClick={handleAddProcess} />
              </div>
            </div>
            <div className="datatable__body">
              <DataTable
                emptyMessage="데이터가 없습니다."
                value={processData}
                selectionMode="single"
                selection={selectedProcess}
                onSelectionChange={(e) => setSelectedProcess(e.value)}
                metaKeySelection={true}
                dataKey="code"
                showGridlines
                scrollable
                scrollHeight="flex"
                // virtualScrollerOptions={{ itemSize: 43 }}
                resizableColumns
              >
                <Column field="code" header="코드"></Column>
                <Column field="name" header="공정명"></Column>
                <Column
                  body={(rowData) => actionBodyTemplate(rowData, "process")}
                  header="수정 / 삭제"
                  style={{ width: "150px" }}
                ></Column>
              </DataTable>
            </div>
          </div>
          <div className="width-50">
            <div className="datatable__header">
              <h3>상세 공정코드 목록</h3>
              <div className="datatable__btns">
                <Button
                  label="추가"
                  size="small"
                  icon="pi pi-plus"
                  onClick={handleAddDetailProcess}
                  disabled={!selectedProcess}
                />
              </div>
            </div>
            <div className="datatable__body">
              <DataTable
                emptyMessage="데이터가 없습니다."
                value={filteredDetailProcessData}
                selectionMode="single"
                selection={selectedDetailProcess}
                onSelectionChange={(e) => setSelectedDetailProcess(e.value)}
                metaKeySelection={true}
                dataKey="code"
                showGridlines
                scrollable
                scrollHeight="flex"
                resizableColumns
              >
                <Column field="code" header="코드"></Column>
                <Column field="name" header="상세공정명"></Column>
                <Column
                  body={(rowData) => actionBodyTemplate(rowData, "detailProcess")}
                  header="수정 / 삭제"
                  style={{ width: "150px" }}
                ></Column>
              </DataTable>
            </div>
          </div>
        </section>
        <ProcessCodeEntryDetail
          selectedProcess={selectedProcess}
          selectedDetailProcess={selectedDetailProcess}
        />
      </div>
    </div>
  );
};

export default ProcessCodeEntryPage;
