/* 2.2.6.악성채권현황 : C1025, SA-2206 */

import { useEffect, useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TabPanel, TabView } from "primereact/tabview";
import ComSearch from "@/components/ComSearch";
import { faker } from "@faker-js/faker";
import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { formatNumberWithCommas } from "@/utils/common";

const BadClaimStatusPage = () => {
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);

  const [saveObject, setSaveObject] = useState({}); // 검색용
  const [sampleData, setSampleData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState({ 총채권금액: 0, 전환금액: 0 });
  const [personalData, setPersonalData] = useState([]);
  const [selectedPersonalItem, setSelectedPersonalItem] = useState(null);
  const [personalDetailData, setPersonalDetailData] = useState([]);
  const [filteredDetailData, setFilteredDetailData] = useState([]);

  // 항목보기 관련 상태 추가
  const [columnVisibility, setColumnVisibility] = useState({
    show_1: false,
    show_2: false,
    show_3: false,
    show_4: false,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  // 항목 목록 정의
  const addItemList = [
    { id: "show_1", label: "보고일", field: "보고일" },
    { id: "show_2", label: "보고자", field: "보고자" },
    { id: "show_3", label: "전담당", field: "전담당" },
    { id: "show_4", label: "확정일", field: "확정일" },
  ];

  const handleShowItemChange = (field) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleTabChange = (e) => {
    setActiveIndex(e.index);
    setColumnVisibility({
      show_1: false,
      show_2: false,
      show_3: false,
      show_4: false,
    });

    // 개인별 악성채권 전환 현황 탭으로 이동할 때 첫 번째 행 선택
    if (e.index === 1 && personalData.length > 0) {
      setSelectedPersonalItem(personalData[0]);
    } else {
      setSelectedPersonalItem(null);
    }
  };

  // 공통 항목보기 정의
  const commonAddItemList = () => {
    return (
      <div className="common-add-item-box">
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
                <label htmlFor={item.id} className={item.isRow ? "is-row" : ""}>
                  {item.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // 금액 포맷팅
  const formatAmount = (value) => {
    if (!value) return value;
    return formatNumberWithCommas(value);
  };

  const detailButtonTemplate = (rowData) => {
    if (rowData.isGrandTotal) return null;
    return (
      <Button
        label="상세내역"
        outlined
        size="small"
        onClick={() => handleBadClaimHistory(rowData)}
      />
    );
  };

  const handleDetailClick = (rowData) => {
    showToast({
      severity: "info",
      summary: "상세내역",
      detail: `상세내역 클릭: ${rowData.전환번호}`,
    });
  };

  // 기본 컬럼 정의
  const baseColumns = [
    {
      field: "상세내역",
      header: "상세내역",
      order: 1,
      body: detailButtonTemplate,
      width: "100px",
    },
    { field: "전환번호", header: "전환번호", order: 2 },
    { field: "거래처명", header: "거래처명", order: 3 },
    { field: "전환일", header: "전환일", order: 4 },
    {
      field: "총채권금액",
      header: "총채권금액",
      className: "text-right",
      body: (rowData) => formatAmount(rowData.총채권금액),
      order: 8,
    },
    { field: "책임자", header: "책임자", order: 9 },
    {
      field: "전환금액",
      header: "전환금액",
      className: "text-right",
      body: (rowData) => formatAmount(rowData.전환금액),
      order: 10,
    },
    { field: "전환유형", header: "전환유형", order: 11 },
    { field: "간략사유", header: "간략사유", order: 12 },
    { field: "현담당", header: "현담당", order: 13 },
  ];

  // 선택적으로 표시될 컬럼 정의
  const optionalColumns = [
    { field: "보고일", header: "보고일", visible: columnVisibility.show_1, order: 5 },
    { field: "보고자", header: "보고자", visible: columnVisibility.show_2, order: 6 },
    { field: "전담당", header: "전담당", visible: columnVisibility.show_3, order: 13 },
    { field: "확정일", header: "확정일", visible: columnVisibility.show_4, order: 15 },
  ];

  // 개인별 요약 컬럼 정의
  const personalSummaryColumns = [
    { field: "책임자", header: "책임자" },
    {
      field: "전환금액",
      header: "전환금액",
      className: "text-right",
      body: (rowData) => formatAmount(rowData.전환금액),
    },
  ];

  // 임시 데이터 생성
  useEffect(() => {
    // 책임자 목록 먼저 생성
    const managers = Array.from({ length: 5 }, () => faker.person.fullName());

    // 각 책임자별로 여러 건의 상세 데이터 생성
    const tempBadClaimStatus = [];
    managers.forEach((manager) => {
      // 각 책임자당 3~7건의 랜덤 데이터 생성
      const recordCount = faker.number.int({ min: 3, max: 7 });
      const managerRecords = Array.from({ length: recordCount }, () => ({
        상세내역: "상세내역",
        전환번호: "DE" + faker.number.int({ min: 0, max: 10000000 }),
        거래처명: faker.company.name(),
        전환일: faker.date.between({ from: "2024-01-01", to: "2024-12-31" }).toLocaleDateString(),
        보고일: faker.date.recent().toLocaleDateString(),
        보고자: faker.person.fullName(),
        총채권금액: faker.number.int({ min: 1000000, max: 100000000 }),
        책임자: manager,
        전환금액: faker.number.int({ min: 1000000, max: 50000000 }),
        전환유형: faker.helpers.arrayElement(["일반", "특별", "긴급", "기타"]),
        간략사유: faker.helpers.arrayElement(["거래처 폐업", "장기연체", "법적조치", "기타사유"]),
        전담당: faker.person.fullName(),
        현담당: faker.person.fullName(),
        전환명: faker.person.fullName(),
        확정일: faker.date.between({ from: "2024-01-01", to: "2024-12-31" }).toLocaleDateString(),
      }));
      tempBadClaimStatus.push(...managerRecords);
    });

    setSampleData(tempBadClaimStatus);

    // 개인별 데이터 생성 - 책임자별 합계 데이터
    const uniqueManagers = [...new Set(tempBadClaimStatus.map((item) => item.책임자))];
    const tempPersonalData = uniqueManagers.map((manager) => {
      const managerData = tempBadClaimStatus.filter((item) => item.책임자 === manager);
      return {
        책임자: manager,
        전환금액: managerData.reduce((sum, item) => sum + item.전환금액, 0),
      };
    });
    setPersonalData(tempPersonalData);
    setPersonalDetailData(tempBadClaimStatus);

    // 개인별 악성채권 전환 현황 탭일 경우 첫 번째 행 선택
    if (activeIndex === 1 && tempPersonalData.length > 0) {
      setSelectedPersonalItem(tempPersonalData[0]);
    }
  }, [activeIndex]);

  // 책임자 선택 시 상세 데이터 필터링
  useEffect(() => {
    if (selectedPersonalItem) {
      const filtered = personalDetailData.filter(
        (item) => item.책임자 === selectedPersonalItem.책임자,
      );
      setFilteredDetailData(filtered);
    } else {
      setFilteredDetailData([]);
    }
  }, [selectedPersonalItem, personalDetailData]);

  const searchCategory = {
    pageCode: 2206,
    dates: [
      {
        label: "조회기간",
        startDate: "1YearAgo",
        endDate: "today",
      },
    ],
    text: [],
    select: [],
    checkboxes: [
      { label: "보고일", checked: false },
      { label: "보고자", checked: false },
      { label: "전담당", checked: false },
      { label: "확정일", checked: false },
    ],
    detailedSearch: {
      isUse: true,
      detailList: {
        text: ["거래처"],
        callList: ["책임자"],
      },
    },
  };

  // 선택된 항목들의 합계 계산
  useEffect(() => {
    if (selectedItems.length > 0) {
      const total = selectedItems.reduce(
        (acc, item) => ({
          총채권금액: acc.총채권금액 + item.총채권금액,
          전환금액: acc.전환금액 + item.전환금액,
        }),
        { 총채권금액: 0, 전환금액: 0 },
      );
      setTotalAmount(total);
    } else {
      setTotalAmount({ 총채권금액: 0, 전환금액: 0 });
    }
  }, [selectedItems]);

  // 합계 데이터 생성 함수
  const addGrandTotal = (data) => {
    const grandTotal = data.reduce(
      (acc, row) => ({
        총채권금액: (acc.총채권금액 || 0) + row.총채권금액,
        전환금액: (acc.전환금액 || 0) + row.전환금액,
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
    return sampleData.map((row) => ({
      ...row,
      isSelected: selectedItems.some((selected) => selected.전환번호 === row.전환번호),
    }));
  }, [sampleData, selectedItems]);

  // 합계가 포함된 데이터
  const grandTotalRow = useMemo(() => {
    return addGrandTotal(sampleData);
  }, [sampleData]);

  const handleHeaderCheckboxChange = (e) => {
    if (e.checked) {
      setSelectedItems([...sampleData]);
    } else {
      setSelectedItems([]);
    }
  };

  const handleRowCheckboxChange = (rowData, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, rowData]);
    } else {
      setSelectedItems((prev) => prev.filter((row) => !(row.전환번호 === rowData.전환번호)));
    }
  };

  // Column 컴포넌트 렌더링 함수
  const renderColumns = (columns) => {
    if (columns === personalSummaryColumns) {
      return columns.map((col) => (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          className={col.className}
          body={col.body}
        />
      ));
    }

    // 기본 컬럼과 체크된 선택적 컬럼을 결합하고 order로 정렬
    const visibleColumns = [
      ...columns,
      ...optionalColumns.filter((col) => {
        const id = Object.keys(columnVisibility).find(
          (key) =>
            columnVisibility[key] &&
            addItemList.find((item) => item.id === key && item.field === col.field),
        );
        return id && columnVisibility[id];
      }),
    ].sort((a, b) => a.order - b.order);

    return visibleColumns.map((col) => (
      <Column
        key={col.field}
        field={col.field}
        header={col.header}
        className={col.className}
        body={col.body}
        style={{ width: `${col.width || "auto"}` }}
      />
    ));
  };

  const handleBadClaimHistory = (rowData) => {
    openDialog("DGBadClaimHistory", {
      data: rowData,
    });
  };

  const handleExcel = () => {
    showToast({
      severity: "info",
      summary: "엑셀",
      detail: "엑셀 다운로드",
    });
  };

  const handlePrint = () => {
    showToast({
      severity: "info",
      summary: "출력",
      detail: "출력",
    });
  };

  return (
    <div id="SAContainer" className="has-abs-btns">
      <ComSearch searchCategory={searchCategory} setSaveObject={setSaveObject} />
      <div className="mt-3">
        <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
          <TabPanel header="악성 채권 전환 유형">
            {commonAddItemList()}
            <div className="datatable-con">
              <section className="datatable width-100">
                <div className="datatable__body mt-3">
                  <DataTable
                    emptyMessage="데이터가 없습니다."
                    value={[...tableDataWithSelection, grandTotalRow]}
                    selectionMode="multiple"
                    selection={selectedItems}
                    onSelectionChange={(e) => setSelectedItems(e.value)}
                    dataKey="전환번호"
                    showGridlines
                    scrollable
                    scrollHeight="flex"
                    resizableColumns
                    rowClassName={(rowData) => {
                      if (rowData.isGrandTotal) return "pivot-table-grandtotal-row";
                      return "";
                    }}
                  >
                    <Column
                      headerStyle={{ width: "3rem" }}
                      header={() => (
                        <Checkbox
                          onChange={handleHeaderCheckboxChange}
                          checked={selectedItems.length === sampleData.length}
                        />
                      )}
                      body={(rowData) => {
                        if (rowData.isGrandTotal) return null;
                        return (
                          <Checkbox
                            onChange={(e) => handleRowCheckboxChange(rowData, e.checked)}
                            checked={selectedItems.some(
                              (item) => item.전환번호 === rowData.전환번호,
                            )}
                          />
                        );
                      }}
                    />
                    {renderColumns(baseColumns)}
                  </DataTable>
                </div>
              </section>
            </div>
          </TabPanel>
          <TabPanel header="개인별 악성채권 전환 현황">
            {commonAddItemList()}
            <div className="datatable-con">
              <div className="flex justify-between width-100">
                <section className="datatable" style={{ width: "20%" }}>
                  <div className="datatable__body" style={{ border: "1px solid #ddd" }}>
                    <DataTable
                      emptyMessage="데이터가 없습니다."
                      value={[...personalData, grandTotalRow]}
                      selection={selectedPersonalItem}
                      onSelectionChange={(e) => setSelectedPersonalItem(e.value)}
                      dataKey="책임자"
                      showGridlines
                      scrollable
                      resizableColumns
                      selectionMode="single"
                      rowClassName={(rowData) => {
                        if (rowData.isGrandTotal) return "pivot-table-grandtotal-row";
                        return "";
                      }}
                    >
                      {renderColumns(personalSummaryColumns)}
                    </DataTable>
                  </div>
                </section>
                <section className="datatable" style={{ width: "79%" }}>
                  <div className="datatable__body" style={{ border: "1px solid #ddd" }}>
                    <DataTable
                      value={[...filteredDetailData, grandTotalRow]}
                      showGridlines
                      scrollable
                      resizableColumns
                      rowClassName={(rowData) => {
                        if (rowData.isGrandTotal) return "pivot-table-grandtotal-row";
                        return "";
                      }}
                      emptyMessage="책임자를 선택해주세요."
                    >
                      {renderColumns(baseColumns)}
                    </DataTable>
                  </div>
                </section>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
      <div className="abs_btns">
        <Button label="엑셀" icon="pi pi-download" onClick={handleExcel} />
        <Button label="출력" icon="pi pi-print" onClick={handlePrint} />
      </div>
    </div>
  );
};

export default BadClaimStatusPage;
