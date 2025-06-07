/*  2.2.2.수금현황 : A6535, SA-2202 */

import ComSearch from "@/components/ComSearch";
import useToastStore from "@/store/toastStore";
import { faker } from "@faker-js/faker";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";

const PaymentStatusPage = () => {
  const showToast = useToastStore.getState().showToast;
  const [saveObject, setSaveObject] = useState({}); // 검색용
  const [sampleData, setSampleData] = useState([]);

  // 기본 컬럼 정의
  const [columns, setColumns] = useState([
    { field: "paymentDate", header: "수금일자" },
    { field: "customerName", header: "거래처명" },
    { field: "status", header: "수금구분" },
    { field: "payment", header: "수금" },
    { field: "adPayment", header: "선수금" },
    { field: "manageNum", header: "관리번호" },
    { field: "financialInst", header: "금융기관" },
    { field: "expirationDt", header: "만기일" },
    { field: "memo", header: "비고" },
  ]);

  const [columnVisibility, setColumnVisibility] = useState({
    paymentNum: false,
    docuDt: false,
  });

  // 임시 데이터 생성
  useEffect(() => {
    const tempPaymentStatus = Array.from({ length: 20 }, (_, i) => ({
      paymentDate: "2025-05-26",
      customerName: faker.helpers.arrayElement(["A기업", "B기업", "C기업"]),
      status: faker.helpers.arrayElement(["현금", "카드"]),
      payment: faker.number.int({ min: 1, max: 100 }),
      adPayment: faker.number.int({ min: 1, max: 100 }),
      manageNum: `${i + 1}`,
      financialInst: faker.helpers.arrayElement(["A기업", "B기업", "C기업"]),
      expirationDt: "2025-05-26",
      paymentNum: "RC25" + faker.number.int({ min: 0, max: 10000000 }),
      docuDt: "2025-05-26",
      docuSq: `${i + 1}`,
      memo: `test ${i + 1}`,
    }));
    setSampleData(tempPaymentStatus);
  }, []);

  const searchCategory = {
    pageCode: 2202,
    text: [],
    dates: [
      {
        label: "조회기간",
        startDate: "firstDay",
        endDate: "today",
      },
    ],
    select: ["select1"],
    callList: [],
    detailedSearch: {
      isUse: true,
      detailList: {
        text: ["거래처"],
        callList: ["담당자"],
      },
    },
  };

  useEffect(() => {
    showToast({
      severity: "info",
      summary: "백엔드 api 데이터 호출",
      detail: `saveObject: ${JSON.stringify(saveObject)}`,
    });

    let dynamicCols = [...columns];

    setColumns(dynamicCols);
  }, [saveObject]); // saveObject가 바뀔 때마다 다시 적용

  const paymentStatusDataTable = (type) => {
    // 기본 컬럼 정의
    const baseColumns = [
      { field: "paymentDate", header: "수금일자" },
      { field: "customerName", header: "거래처명" },
      { field: "status", header: "수금구분" },
      { field: "payment", header: "수금", className: "text-right" },
      { field: "adPayment", header: "선수금", className: "text-right" },
      { field: "manageNum", header: "관리번호" },
      { field: "financialInst", header: "금융기관" },
      { field: "expirationDt", header: "만기일" },
      { field: "memo", header: "비고" },
    ];

    // 동적 컬럼 추가
    let columns = [...baseColumns];

    // 수금번호 컬럼 추가
    if (columnVisibility?.paymentNum) {
      columns.splice(8, 0, { field: "paymentNum", header: "수금번호" });
    }

    // 전표번호 관련 컬럼 추가
    if (columnVisibility?.docuDt) {
      columns.splice(
        columnVisibility?.paymentNum ? 9 : 8,
        0,
        { field: "docuDt", header: "전표일자" },
        { field: "docuSq", header: "번호" },
      );
    }

    // type에 따라 컬럼 순서 재정렬
    if (type === "name") {
      // 거래처명 기준일 경우: 거래처명, 수금일자 순으로 변경
      const [paymentDate, customerName, ...rest] = columns;
      columns = [customerName, paymentDate, ...rest];
    }
    // 수금일자 기준일 경우 기본 순서 유지 (수금일자, 거래처명 순)

    return (
      <div className="payment-status-con datatable-con flex gap-3">
        <section className="datatable width-100">
          <div className="datatable__body">
            <DataTable
              emptyMessage="데이터가 없습니다."
              value={sampleData}
              metaKeySelection={true}
              dataKey="docuSq"
              showGridlines
              scrollable
              scrollHeight="calc(100vh - 290px)"
              resizableColumns
            >
              {columns.map((col) => (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  className={col.className}
                />
              ))}
            </DataTable>
          </div>
        </section>
      </div>
    );
  };

  const handleShowItemChange = (field) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const addItemList = [
    { id: "paymentNum", label: "수금번호" },
    { id: "docuDt", label: "전표번호" },
  ];

  return (
    <div id="SAContainer" className="PaymentStatusPage">
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
      <TabView className="mt-3">
        <TabPanel header="수금일자 기준">{paymentStatusDataTable("date")}</TabPanel>
        <TabPanel header="거래처명 기준">{paymentStatusDataTable("name")}</TabPanel>
      </TabView>
    </div>
  );
};

export default PaymentStatusPage;
