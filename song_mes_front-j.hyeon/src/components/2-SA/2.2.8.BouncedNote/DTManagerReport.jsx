/**
 * 부도어음관리 - 담당자별 집계
 */

import { useEffect, useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TabPanel, TabView } from "primereact/tabview";
import { faker } from "@faker-js/faker";
import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { formatNumberWithCommas } from "@/utils/common";

const DTManagerReport = ({ selectedCustomerName = "B기업" }) => {
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);

  const [topTabIndex, setTopTabIndex] = useState(0);
  const [saveObject, setSaveObject] = useState({}); // 검색용
  const [sampleData, setSampleData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState({ 부도금액: 0, 회수금액: 0 });
  const [personalData, setPersonalData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
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
    { id: "show_1", label: "부도일자", field: "부도일" },
    { id: "show_2", label: "만기일자", field: "만기일" },
    { id: "show_3", label: "최종입금일", field: "최종입금일" },
    { id: "show_4", label: "약속일자", field: "약속일" },
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

  // 기본 컬럼 정의
  const baseColumns = [
    { field: "순번", header: "순번", order: 1 },
    {
      field: "담당자",
      header: "담당자",
      order: 2,
      hide: topTabIndex === 0, // 담당자 기준 탭에서는 숨김
    },
    {
      field: "거래처",
      header: "거래처",
      order: 2,
      hide: topTabIndex === 1, // 거래처 기준 탭에서는 숨김
    },
    { field: "종류", header: "종류", order: 4 },
    {
      field: "부도금액",
      header: "부도금액",
      order: 7,
      className: "text-right",
      body: (rowData) => formatAmount(rowData.부도금액),
    },
    {
      field: "회수금액",
      header: "회수금액",
      order: 8,
      className: "text-right",
      body: (rowData) => formatAmount(rowData.회수금액),
    },
    {
      field: "잔액",
      header: "잔액",
      order: 9,
      className: "text-right",
      body: (rowData) => formatAmount(rowData.잔액),
    },
    { field: "비고", header: "비고", order: 11 },
  ];

  // 선택적으로 표시될 컬럼 정의
  const optionalColumns = [
    { field: "부도일", header: "부도일", visible: columnVisibility.show_1, order: 3 },
    { field: "만기일", header: "만기일", visible: columnVisibility.show_2, order: 5 },
    { field: "최종입금일", header: "최종입금일", visible: columnVisibility.show_3, order: 6 },
    { field: "약속일", header: "약속일", visible: columnVisibility.show_4, order: 10 },
  ];

  // 개인별 요약 컬럼 정의
  const personalSummaryColumns = [
    { field: "담당자", header: "담당자" },
    {
      field: "잔액",
      header: "잔액",
      className: "text-right",
      body: (rowData) => formatAmount(rowData.잔액),
    },
  ];

  // 거래처별 요약 컬럼 정의
  const customerSummaryColumns = [
    { field: "거래처", header: "거래처" },
    {
      field: "잔액",
      header: "잔액",
      className: "text-right",
      body: (rowData) => formatAmount(rowData.잔액),
    },
  ];

  // Column 컴포넌트 렌더링 함수
  const renderColumns = (columns) => {
    // 개인별/거래처별 요약 테이블인 경우
    if (columns === personalSummaryColumns || columns === customerSummaryColumns) {
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

    // 상세 테이블인 경우
    const allColumns = [
      ...columns.filter((col) => !col.hide), // hide 속성이 true인 컬럼은 제외
      ...optionalColumns.filter((col) => {
        const matchingItem = addItemList.find((item) => item.field === col.field);
        return matchingItem && columnVisibility[matchingItem.id];
      }),
    ].sort((a, b) => a.order - b.order);

    return allColumns.map((col) => {
      if (col.field === "순번") {
        return (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            className="text-center"
            body={(rowData, options) => (!rowData.isGrandTotal ? options.rowIndex + 1 : "")}
          />
        );
      }
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          className={col.className}
          body={col.body}
          style={{ width: `${col.width || "auto"}` }}
        />
      );
    });
  };

  // 담당자/거래처 선택 시 상세 데이터 필터링
  useEffect(() => {
    if (selectedPersonalItem) {
      const filtered = personalDetailData.filter((item) =>
        topTabIndex === 0
          ? item.담당자 === selectedPersonalItem.담당자
          : item.거래처 === selectedPersonalItem.거래처,
      );
      setFilteredDetailData(
        filtered.map((item, index) => ({
          ...item,
          순번: index + 1,
        })),
      );
    } else {
      setFilteredDetailData([]);
    }
  }, [selectedPersonalItem, personalDetailData, topTabIndex]);

  // 임시 데이터 생성
  useEffect(() => {
    // 담당자 목록 먼저 생성
    const managers = Array.from({ length: 3 }, () => faker.person.fullName());
    const companies = ["A기업", "B기업", "C기업", "D기업", "E기업"];

    // 각 담당자별로 여러 건의 상세 데이터 생성
    const tempBadClaimStatus = [];
    let globalIndex = 1;
    managers.forEach((manager) => {
      // 각 담당자당 2~3건의 랜덤 데이터 생성
      const recordCount = faker.number.int({ min: 2, max: 3 });
      const managerRecords = Array.from({ length: recordCount }, () => ({
        순번: globalIndex++,
        담당자: manager,
        거래처: faker.helpers.arrayElement(companies),
        종류: faker.helpers.arrayElement(["부도", "회수"]),
        부도일: faker.date.between({ from: "2024-01-01", to: "2024-12-31" }).toLocaleDateString(),
        만기일: faker.date.between({ from: "2024-01-01", to: "2024-12-31" }).toLocaleDateString(),
        최종입금일: faker.date
          .between({ from: "2024-01-01", to: "2024-12-31" })
          .toLocaleDateString(),
        약속일: faker.date.between({ from: "2024-01-01", to: "2024-12-31" }).toLocaleDateString(),
        부도금액: faker.number.int({ min: 1000000, max: 100000000 }),
        회수금액: faker.number.int({ min: 1000000, max: 50000000 }),
        잔액: faker.number.int({ min: 1000000, max: 50000000 }),
        비고: "비고",
      }));
      tempBadClaimStatus.push(...managerRecords);
    });

    setSampleData(tempBadClaimStatus);

    // 개인별 데이터 생성 - 담당자별 합계 데이터
    const uniqueManagers = [...new Set(tempBadClaimStatus.map((item) => item.담당자))];
    const tempPersonalData = uniqueManagers.map((manager) => {
      const managerData = tempBadClaimStatus.filter((item) => item.담당자 === manager);
      return {
        담당자: manager,
        잔액: managerData.reduce((sum, item) => sum + item.잔액, 0),
      };
    });
    setPersonalData(tempPersonalData);

    // 거래처별 데이터 생성 - 거래처별 합계 데이터
    const uniqueCustomers = [...new Set(tempBadClaimStatus.map((item) => item.거래처))];
    const tempCustomerData = uniqueCustomers.map((customer) => {
      const customerData = tempBadClaimStatus.filter((item) => item.거래처 === customer);
      return {
        거래처: customer,
        잔액: customerData.reduce((sum, item) => sum + item.잔액, 0),
      };
    });
    setCustomerData(tempCustomerData);

    setPersonalDetailData(tempBadClaimStatus);
  }, [activeIndex]);

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
        callList: ["담당자"],
      },
    },
  };

  // 선택된 항목들의 합계 계산
  useEffect(() => {
    if (selectedItems.length > 0) {
      const total = selectedItems.reduce(
        (acc, item) => ({
          부도금액: acc.부도금액 + item.부도금액,
          회수금액: acc.회수금액 + item.회수금액,
        }),
        { 부도금액: 0, 회수금액: 0 },
      );
      setTotalAmount(total);
    } else {
      setTotalAmount({ 부도금액: 0, 회수금액: 0 });
    }
  }, [selectedItems]);

  // 합계 데이터 생성 함수
  const addGrandTotal = (data, selectedManager = null) => {
    if (!data || data.length === 0) return {};

    // 선택된 담당자의 총 잔액을 가져옴
    let targetBalance = 0;
    if (selectedManager) {
      const managerData = personalData.find((item) => item.담당자 === selectedManager);
      targetBalance = managerData ? managerData.잔액 : 0;
    }

    const grandTotal = data.reduce(
      (acc, row) => ({
        담당자: "합계",
        부도금액: (acc.부도금액 || 0) + (row.부도금액 || 0),
        회수금액: (acc.회수금액 || 0) + (row.회수금액 || 0),
        잔액: selectedManager ? targetBalance : (acc.잔액 || 0) + (row.잔액 || 0),
      }),
      {},
    );

    return {
      isGrandTotal: true,
      isSelected: false,
      ...grandTotal,
    };
  };

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

  return (
    <div id="SAContainer">
      <div className="flex">
        <TabView
          className="TabStyle2"
          activeIndex={topTabIndex}
          onTabChange={(e) => {
            setTopTabIndex(e.index);
            setSelectedPersonalItem(null);
            setFilteredDetailData([]);
          }}
        >
          <TabPanel header="담당자 기준" />
          <TabPanel header="거래처 기준" />
        </TabView>
        {commonAddItemList()}
      </div>
      <div className="datatable-con">
        <div className="flex justify-between width-100">
          <section className="datatable" style={{ width: "20%" }}>
            <div className="datatable__body" style={{ border: "1px solid #ddd" }}>
              <DataTable
                value={[
                  ...(topTabIndex === 0 ? personalData : customerData),
                  addGrandTotal(topTabIndex === 0 ? personalData : customerData),
                ]}
                selection={selectedPersonalItem}
                onSelectionChange={(e) => setSelectedPersonalItem(e.value)}
                dataKey={topTabIndex === 0 ? "담당자" : "거래처"}
                showGridlines
                scrollable
                resizableColumns
                selectionMode="single"
                rowClassName={(rowData) => {
                  if (rowData.isGrandTotal) return "pivot-table-grandtotal-row";
                  return "";
                }}
              >
                {topTabIndex === 0
                  ? renderColumns(personalSummaryColumns)
                  : renderColumns(customerSummaryColumns)}
              </DataTable>
            </div>
          </section>
          <section className="datatable" style={{ width: "79%" }}>
            <div className="datatable__body" style={{ border: "1px solid #ddd" }}>
              <DataTable
                value={
                  selectedPersonalItem
                    ? [
                        ...filteredDetailData,
                        addGrandTotal(
                          filteredDetailData,
                          topTabIndex === 0
                            ? selectedPersonalItem?.담당자
                            : selectedPersonalItem?.거래처,
                        ),
                      ]
                    : []
                }
                showGridlines
                scrollable
                resizableColumns
                rowClassName={(rowData) => {
                  if (rowData.isGrandTotal) return "pivot-table-grandtotal-row";
                  return "";
                }}
                emptyMessage={`${topTabIndex === 0 ? "담당자" : "거래처"}를 선택해주세요.`}
              >
                {renderColumns(baseColumns)}
              </DataTable>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export { DTManagerReport };
