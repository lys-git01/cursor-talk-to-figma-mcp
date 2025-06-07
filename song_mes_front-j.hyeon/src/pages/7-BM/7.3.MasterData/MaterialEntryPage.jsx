// 7.3.5.자재등록	A0200	materialEntry	BM-7305

import ComSearch from "@/components/ComSearch";
import useToastStore from "@/store/toastStore";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker/locale/ko";
import { formatNumberWithCommas, renderRow } from "@/utils/common";
import { confirmDialog } from "primereact/confirmdialog";
import useDialogStore from "@/store/dialogStore";

const generateMaterialData = () => {
  const materials = [];
  const metalTypes = [
    "스테인리스",
    "알루미늄",
    "구리",
    "황동",
    "티타늄",
    "강철",
    "철",
    "아연",
    "니켈",
    "몰리브덴",
  ];
  const units = ["장", "kg", "m", "롤", "박스"];
  const accounts = ["원자재", "부자재", "소모품"];
  const procurements = ["국내", "수입"];
  const usages = ["생산", "유지보수", "개발"];
  const materialGroups = ["금속", "플라스틱", "전자부품", "기계부품"];

  for (let i = 1; i <= 30; i++) {
    const thickness = faker.number.int({ min: 1, max: 10 });
    const width = faker.number.int({ min: 500, max: 2000 });
    const length = faker.number.int({ min: 1000, max: 3000 });
    const currentStock = faker.number.int({ min: 10, max: 200 });
    const safetyStock = faker.number.int({ min: 5, max: 20 });

    materials.push({
      id: i,
      materialCode: `M${String(i).padStart(3, "0")}`,
      materialName: `${faker.helpers.arrayElement(metalTypes)} ${faker.helpers.arrayElement(["판", "파이프", "봉", "와이어"])}`,
      specification: `${thickness}T x ${width} x ${length}`,
      unit: faker.helpers.arrayElement(units),
      supplier: `${faker.company.name()}${faker.helpers.arrayElement(["금속", "산업", "제조", "기술"])}`,
      price: faker.number.int({ min: 10000, max: 500000 }),
      currentStock: currentStock,
      availableStock: currentStock - safetyStock,
      stockManagement: faker.helpers.arrayElement(["Y", "N"]),
      account: faker.helpers.arrayElement(accounts),
      procurement: faker.helpers.arrayElement(procurements),
      usage: faker.helpers.arrayElement(usages),
      materialGroup: faker.helpers.arrayElement(materialGroups),
      remark: `안전재고 ${safetyStock}${faker.helpers.arrayElement(units)}`,
      usedMaterial: `사용중자재${i}`,
    });
  }
  return materials;
};

const MaterialEntryPage = () => {
  const [saveObject, setSaveObject] = useState({}); // 검색용
  const showToast = useToastStore.getState().showToast;
  const [tableData, setTableData] = useState(generateMaterialData());
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const { openDialog } = useDialogStore();
  const searchCategory = {
    pageCode: 7305,
    text: ["자재코드", "자재명"],
    select: ["select1"],
    callList: [],
    checkbox: [],
    detailedSearch: {
      isUse: true,
      detailList: {
        text: ["비고"],
        select: ["select2"],
        callList: ["최종 거래처", "자재그룹"],
        checkbox: ["미사용포함", "수량없음 포함"],
      },
    },
  };
  useEffect(() => {
    setSelectedRow(tableData[0]);
  }, []);
  const [columnVisibility, setColumnVisibility] = useState({
    supplier: true,
    purchasePrice: true,
    currentStock: true,
    availableStock: true,
  });

  const handleShowItemChange = (field) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    showToast({
      severity: "info",
      summary: "백엔드 api 데이터 호출",
      detail: `saveObject: ${JSON.stringify(saveObject)}`,
    });
  }, [saveObject]);

  const basicInfoRows1 = [
    {
      label: "최종거래처",
      value: selectedRow?.supplier || "-",
    },

    {
      label: "재고수량",
      value: selectedRow?.currentStock || "-",
    },
  ];

  const basicInfoRows2 = [
    {
      label: "최종단가",
      value: selectedRow?.price ? `${selectedRow.price}원` : "-",
    },

    {
      label: "사용중수량",
      value: selectedRow?.currentStock - selectedRow?.availableStock || "-",
    },
  ];
  const basicInfoRows3 = [
    {
      label: "가용재고",
      value: selectedRow?.availableStock || "-",
    },
  ];

  const handleCurrentStockEdit = () => {
    if (!selectedRow) {
      showToast({
        severity: "warn",
        summary: "알림",
        detail: "수정할 자재를 선택해주세요.",
      });
      return;
    }
    // 현재고 수정 로직
  };

  const handleEdit = () => {
    openDialog("MaterialEntryForm7305", {
      state: "수정",
      data: selectedRow,
    });
  };

  const handleRowCheckboxChange = (rowData, checked) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, rowData]);
    } else {
      setSelectedRows((prev) => prev.filter((row) => row.id !== rowData.id));
    }
  };

  const handleHeaderCheckboxChange = (e) => {
    if (e.checked) {
      setSelectedRows(tableData);
    } else {
      setSelectedRows([]);
    }
  };

  const isAllSelected = selectedRows.length === tableData.length;

  // 체크박스 상태를 포함한 테이블 데이터
  const tableDataWithSelection = tableData.map((row) => ({
    ...row,
    isSelected: selectedRows.some((selected) => selected.id === row.id),
  }));

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      showToast({
        severity: "warn",
        summary: "알림",
        detail: "삭제할 자재를 선택해주세요.",
      });
      return;
    }
    confirmDialog({
      header: "자재 삭제",
      message: `선택한 자재를 삭제하시겠습니까?`,
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => {
        // TODO 백엔드 호출
        console.log("삭제");
      },
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };

  const handleExport = () => {
    if (selectedRows.length === 0) {
      showToast({
        severity: "warn",
        summary: "알림",
        detail: "엑셀로 내보낼 자재를 선택해주세요.",
      });
      return;
    }
    // 엑스포트 로직
  };

  const handlePrint = () => {
    if (selectedRows.length === 0) {
      showToast({
        severity: "warn",
        summary: "알림",
        detail: "출력할 자재를 선택해주세요.",
      });
      return;
    }
    // 출력 로직
  };

  const handleAdd = () => {
    openDialog("MaterialEntryForm7305", {
      state: "추가",
    });
  };

  const addItemList = [
    { id: "supplier", label: "거래처" },
    { id: "purchasePrice", label: "구매단가" },
    { id: "currentStock", label: "현재고" },
    { id: "availableStock", label: "가용재고" },
  ];

  return (
    <div id="MaterialEntryPage" className="min-h-screen has-abs-btns">
      <div className="common-add-item-box">
        <ComSearch searchCategory={searchCategory} setSaveObject={setSaveObject} />
        <div className="common-add-item">
          <label>항목보기</label>
          <ul>
            {addItemList.map((item) => (
              <li key={item.id}>
                <Checkbox
                  inputId={item.id}
                  checked={columnVisibility[item.id]}
                  onChange={() => handleShowItemChange(item.id)}
                />
                <label htmlFor={item.id}>{item.label}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="datatable__header">
        <h3>자재 목록</h3>
        <div className="datatable__btns">
          <Button
            label="삭제"
            size="small"
            severity="danger"
            icon="pi pi-times"
            onClick={handleDelete}
          />
          <Button label="추가" size="small" icon="pi pi-plus" onClick={handleAdd} />
        </div>
      </div>
      <div className="datatable">
        <DataTable
          emptyMessage="데이터가 없습니다."
          value={tableDataWithSelection}
          selectionMode="single"
          selection={selectedRow}
          onSelectionChange={(e) => setSelectedRow(e.value)}
          metaKeySelection={true}
          dataKey="id"
          showGridlines
          scrollable
          scrollHeight="flex"
          resizableColumns
        >
          <Column
            headerStyle={{ width: "3rem" }}
            header={() => (
              <Checkbox
                onChange={handleHeaderCheckboxChange}
                checked={isAllSelected}
              />
            )}
            body={(rowData) => (
              <Checkbox
                onChange={(e) => handleRowCheckboxChange(rowData, e.checked)}
                checked={rowData.isSelected}
              />
            )}
          />
          <Column field="materialCode" header="자재코드" />
          <Column field="materialName" header="자재명" />
          <Column field="specification" header="규격" />
          <Column field="unit" header="단위" />
          {columnVisibility.supplier && <Column field="supplier" header="거래처" />}
          {columnVisibility.purchasePrice && (
            <Column
              field="price"
              header="단가"
              body={(rowData) => formatNumberWithCommas(rowData.price)}
            />
          )}
          {columnVisibility.currentStock && <Column field="currentStock" header="현재고" />}
          {columnVisibility.availableStock && <Column field="availableStock" header="가용재고" />}
          <Column field="stockManagement" header="재고관리" />
          <Column field="account" header="계정" />
          <Column field="procurement" header="조달" />
          <Column field="usage" header="사용" />
          <Column field="materialGroup" header="자재그룹" />
          <Column field="remark" header="비고" />
        </DataTable>
      </div>

      <div className="detail">
        <div className="con-header mt-3">
          <h4 className="con-header__title">기본정보</h4>
          <div className="con-header__btns">
            <Button size="small" label="현재고 수정" onClick={handleCurrentStockEdit} />
            <Button size="small" label="수정" severity="secondary" onClick={handleEdit} />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="con-body">{basicInfoRows1.map((row, idx) => renderRow([row], idx))}</div>
          <div className="con-body">{basicInfoRows2.map((row, idx) => renderRow([row], idx))}</div>
          <div className="con-body">{basicInfoRows3.map((row, idx) => renderRow([row], idx))}</div>
        </div>
      </div>

      <div className="abs_btns">
        <Button label="엑셀" icon="pi pi-download" onClick={handleExport} />
        <Button label="출력" icon="pi pi-print" onClick={handlePrint} />
      </div>
    </div>
  );
};

export default MaterialEntryPage;
