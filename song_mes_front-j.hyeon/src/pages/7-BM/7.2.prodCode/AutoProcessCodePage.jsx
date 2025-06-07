/* 7.2.8.자동공정코드등록 H2001, BM-7208 */
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import React, { useState, useEffect } from "react";
import { confirmDialog } from "primereact/confirmdialog";
import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";

const AutoProcessCodePage = () => {
  const openDialog = useDialogStore((s) => s.openDialog);
  const showToast = useToastStore.getState().showToast;
  const [filterType, setFilterType] = useState("일반공정");
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailData, setDetailData] = useState([]);
  const [selectedDetailRow, setSelectedDetailRow] = useState(null);

  // 임시 데이터 로드
  useEffect(() => {
    // TODO: API 연동
    const tempData = Array.from({ length: 30 }, (_, index) => ({
      order: String(index + 1).padStart(3, "0"),
      code: `AP${String(index + 1).padStart(3, "0")}`,
      name: `자동공정${index + 1}`, //공정명
      type: index % 2 === 0 ? "일반공정" : "상자공정", // 일반공정 또는 상자공정
      detailData: [
        {
          processCode: `AP${String(index + 1).padStart(3, "0")}`,
          order: String(index + 1).padStart(3, "0"),
          code: `DP${String(index + 1).padStart(3, "0")}`,
          name: `자동공정${index + 1} 상세공정${index + 1}`,
          processName: `자동공정${index + 1}`,
          alias: `별칭${index + 1}`,
        },
      ],
    }));

    // filterType에 따라 데이터 필터링
    const filteredData = tempData.filter((item) => item.type === filterType);
    setData(filteredData);
    setAllData(tempData);
    setSelectedRow(filteredData[0]);
  }, []);

  // 선택된 공정에 따른 상세공정 데이터 로드
  useEffect(() => {
    if (selectedRow) {
      setDetailData(selectedRow.detailData);
    } else {
      setDetailData([]);
    }
  }, [selectedRow]);

  const handleAdd = () => {
    openDialog("AutoProcessForm7208", {
      state: "추가",
      onSuccess: (newData) => {
        setData([...data, newData]);
        showToast({
          severity: "success",
          summary: "자동공정코드 추가",
          detail: "자동공정코드가 추가되었습니다.",
          life: 3000,
        });
      },
    });
  };

  const handleEdit = (rowData) => {
    console.log("현재 선택된 공정:", rowData);
    const currentDetailData = rowData.detailData;

    console.log("수정할 데이터:", {
      rowData,
      currentDetailData,
    });

    openDialog("AutoProcessForm7208", {
      state: "수정",
      data: {
        code: rowData.code,
        name: rowData.name,
        type: rowData.type,
        detailData: currentDetailData,
      },
      onSuccess: (updatedData) => {
        setData(data.map((item) => (item.code === updatedData.code ? updatedData : item)));
        showToast({
          severity: "success",
          summary: "자동공정코드 수정",
          detail: "자동공정코드가 수정되었습니다.",
          life: 3000,
        });
      },
    });
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `${rowData.code}을(를) 정말로 삭제하시겠습니까?`,
      header: "자동공정코드 삭제",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => {
        setData(data.filter((item) => item.code !== rowData.code));
        showToast({
          severity: "info",
          summary: "자동공정코드 삭제",
          detail: `${rowData.code}이(가) 삭제되었습니다.`,
          life: 3000,
        });
      },
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };

  const handleDetailEdit = (rowData) => {
    openDialog("AutoProcessDetailForm", {
      state: "수정",
      data: rowData,
      processCode: selectedRow.code,
      onSuccess: (updatedData) => {
        setDetailData(
          detailData.map((item) => (item.code === updatedData.code ? updatedData : item)),
        );
        showToast({
          severity: "success",
          summary: "상세공정 수정",
          detail: "상세공정이 수정되었습니다.",
          life: 3000,
        });
      },
    });
  };

  const handleDetailDelete = (rowData) => {
    confirmDialog({
      message: `${rowData.code}을(를) 정말로 삭제하시겠습니까?`,
      header: "상세공정 삭제",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => {
        setDetailData(detailData.filter((item) => item.code !== rowData.code));
        showToast({
          severity: "info",
          summary: "상세공정 삭제",
          detail: `${rowData.code}이(가) 삭제되었습니다.`,
          life: 3000,
        });
      },
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };

  const actionBodyTemplate = (rowData, isDetail = false) => {
    return (
      <div className="buttonSet">
        <Button
          label="삭제"
          outlined
          size="small"
          severity="danger"
          onClick={() => (isDetail ? handleDetailDelete(rowData) : handleDelete(rowData))}
        />
        <Button
          label="수정"
          outlined
          size="small"
          onClick={() => (isDetail ? handleDetailEdit(rowData) : handleEdit(rowData))}
        />
      </div>
    );
  };

  const onRowSelect = (event) => {
    setSelectedRow(event.data);
    setSelectedDetailRow(null);
  };

  const onDetailRowSelect = (event) => {
    setSelectedDetailRow(event.data);
  };

  const onChangeFilterType = (e) => {
    setFilterType(e.value);
    setData(allData.filter((item) => item.type === e.value));
  };

  return (
    <div id="AutoProcessCode">
      <div className="common-search">
        <div className="common-search__input">
          <label htmlFor="filterType">조회구분</label>
          <Dropdown
            value={filterType}
            options={["일반공정", "상자공정"]}
            onChange={onChangeFilterType}
            placeholder="선택"
          />
        </div>
      </div>

      <div className="AutoProcessCode-con content-box flex gap-3">
        <section className="datatable width-50">
          <div className="datatable__header">
            <h3>자동 공정 목록</h3>
            <div className="datatable__btns">
              <Button label="추가" size="small" icon="pi pi-plus" onClick={handleAdd} />
            </div>
          </div>
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={data}
            selectionMode="single"
            selection={selectedRow}
            onSelectionChange={(e) => setSelectedRow(e.value)}
            onRowSelect={onRowSelect}
            metaKeySelection={true}
            dataKey="code"
            showGridlines
            scrollable
            resizableColumns
            scrollHeight="flex"
          >
            <Column header="순번" body={(_, options) => options.rowIndex + 1} />
            <Column field="code" header="코드"></Column>
            <Column field="name" header="공정명"></Column>
            <Column
              body={(rowData) => actionBodyTemplate(rowData)}
              header="수정 / 삭제"
              style={{ width: "150px" }}
            ></Column>
          </DataTable>
        </section>
        <section className="datatable width-50">
          <div className="datatable__header">
            <h3>상세공정 순서</h3>
          </div>
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={detailData}
            selectionMode="single"
            selection={selectedDetailRow}
            onSelectionChange={(e) => setSelectedDetailRow(e.value)}
            onRowSelect={onDetailRowSelect}
            metaKeySelection={true}
            dataKey="code"
            showGridlines
            scrollable
            resizableColumns
            scrollHeight="flex"
          >
            <Column header="순번" body={(_, options) => options.rowIndex + 1} />
            <Column field="processName" header="공정명"></Column>
            <Column field="name" header="상세공정명"></Column>
            <Column field="alias" header="예명"></Column>
          </DataTable>
        </section>
      </div>
    </div>
  );
};

export default AutoProcessCodePage;
