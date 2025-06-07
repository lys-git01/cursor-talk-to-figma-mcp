import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";

const AutoProcessForm7208 = ({ onCloseFn, state = "추가", data = {} }) => {
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);
  const [detailData, setDetailData] = useState([]);
  const [process, setProcess] = useState({
    code: data?.code ?? "",
    name: data?.name ?? "",
  });

  const baseData = [
    {
      id: Date.now().toString(),
      code: "",
      name: "",
      alias: "",
      processName: "",
    },
  ];

  useEffect(() => {
    if (state === "추가") {
      setDetailData(baseData);
    } else if (state === "수정" && data.detailData) {
      // 수정 시 전달받은 상세 공정순서 목록에 id 추가
      const detailDataWithId = data.detailData.map((item) => ({
        ...item,
        id: item.id || Date.now().toString(),
      }));
      setDetailData(detailDataWithId);
    }
  }, [state, data]);

  // 저장
  const saveData = () => {
    const filteredDetailData = detailData.filter((row) => row.processName && row.name && row.alias);
    console.log("저장할 데이터:", {
      process,
      detailData: filteredDetailData,
    });
    onCloseFn();
    showToast({
      severity: "success",
      summary: "저장 완료",
      detail: "저장되었습니다.",
      life: 3000,
    });
  };

  // 공정코드 검색
  const handleProcessCodeSearch = (rowData) => {
    openDialog("DGProcessCode", {
      onClose: (value) => {
        if (value) {
          setDetailData((prevData) =>
            prevData.map((item) => {
              if (item.id === rowData.id) {
                return {
                  ...item,
                  processName: value.process.name,
                  name: value.detail.name,
                };
              }
              return item;
            }),
          );
        }
      },
    });
  };

  // 행 추가
  const handleAddRow = (rowData) => {
    const newRow = {
      id: Date.now().toString(),
      code: "",
      name: "",
      alias: "",
      processName: "",
    };
    setDetailData((prevData) => {
      const index = prevData.findIndex((item) => item.id === rowData.id);
      const newData = [...prevData];
      newData.splice(index + 1, 0, newRow);
      return newData;
    });
  };

  // 행 삭제
  const handleDeleteRow = (rowData) => {
    setDetailData((prevData) => prevData.filter((item) => item.id !== rowData.id));
  };

  // 예명 수정
  const handleAliasChange = (rowData, value) => {
    setDetailData((prevData) =>
      prevData.map((item) => (item.id === rowData.id ? { ...item, alias: value } : item)),
    );
  };

  const aliasBodyTemplate = (rowData) => {
    return (
      <InputText
        value={rowData.alias || ""}
        onChange={(e) => handleAliasChange(rowData, e.target.value)}
        style={{ width: "100%" }}
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    const isFirstRow = detailData.findIndex((item) => item.id === rowData.id) === 0;
    return (
      <div className="buttonSet">
        <Button label="추가" outlined size="small" onClick={() => handleAddRow(rowData)} />
        <Button
          label="삭제"
          outlined
          size="small"
          severity="danger"
          onClick={() => handleDeleteRow(rowData)}
          disabled={isFirstRow}
        />
        <Button
          label="호출"
          outlined
          size="small"
          severity="secondary"
          onClick={() => handleProcessCodeSearch(rowData)}
        />
      </div>
    );
  };

  const handleAutoProcessCode = () => {
    const processNames = detailData
      .map((row) => row.processName)
      .filter((name) => name && name.trim() !== "");

    if (processNames.length === 0) {
      showToast({
        severity: "warn",
        summary: "경고",
        detail: "공정명이 입력된 행이 없습니다.",
        life: 3000,
      });
      return;
    }

    const generatedCode = processNames.join("-");
    setProcess({
      code: generatedCode,
      name: generatedCode,
    });
  };

  return (
    <Dialog header={`자동공정코드 ${state}`} visible onHide={onCloseFn}>
      <div className="Dialog-container form-list">
        {state !== "추가" && (
          <div className="form__input">
            <p>코드</p>
            <span>{process.code}</span>
          </div>
        )}

        <div className="form__input">
          <label htmlFor="processCode">공정명</label>
          <div className="p-inputgroup">
            <InputText
              id="processName"
              value={process.name}
              onChange={(e) => setProcess({ ...process, name: e.target.value })}
              placeholder="공정명을 입력하세요."
            />
            <Button label="공정명 자동생성" onClick={handleAutoProcessCode} />
          </div>
        </div>
        <DataTable
          emptyMessage="데이터가 없습니다."
          value={detailData}
          selectionMode="single"
          metaKeySelection={true}
          dataKey="id"
          showGridlines
          scrollable
          resizableColumns
          scrollHeight="400px"
          style={{ minHeight: "400px" }}
        >
          <Column header="순번" body={(_, options) => options.rowIndex + 1} />
          <Column field="processName" header="공정명" />
          <Column field="name" header="상세공정명" />
          <Column field="alias" header="예명" body={aliasBodyTemplate} />
          <Column
            body={actionBodyTemplate}
            header="추가 / 삭제 / 호출"
            style={{ width: "150px" }}
          />
        </DataTable>
      </div>
      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={onCloseFn}></Button>
        <Button label="저장" onClick={saveData}></Button>
      </div>
    </Dialog>
  );
};

export default AutoProcessForm7208;
