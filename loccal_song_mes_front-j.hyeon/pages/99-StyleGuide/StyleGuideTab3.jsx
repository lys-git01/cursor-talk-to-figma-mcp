import React, { useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Checkbox } from "primereact/checkbox";
import { faker } from "@faker-js/faker/locale/ko";
import { formatNumberWithCommas } from "@/utils/common";
import { TreeTable } from "primereact/treetable";

const StyleGuideTab3 = () => {
  // DataTable states
  const [selectedRow, setSelectedRow] = useState(null);
  const [tableData] = useState([
    { id: 1, name: "홍길동", age: 30, city: "서울" },
    { id: 2, name: "김철수", age: 25, city: "부산" },
    { id: 3, name: "이영희", age: 28, city: "인천" },
    { id: 4, name: "박영수", age: 35, city: "대구" },
    { id: 5, name: "최영희", age: 32, city: "광주" },
    { id: 6, name: "정준호", age: 29, city: "대전" },
    { id: 7, name: "홍길동", age: 30, city: "서울" },
    { id: 8, name: "김철수", age: 25, city: "부산" },
    { id: 9, name: "이영희", age: 28, city: "인천" },
    { id: 10, name: "박영수", age: 35, city: "대구" },
  ]);

  const [columnVisibility] = useState({
    supplier: true,
    purchasePrice: true,
    currentStock: true,
    availableStock: true,
  });

  // 자재 데이터 생성 함수
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

  const [materialData] = useState([
    {
      id: 1,
      materialCode: "M001",
      materialName: "스테인리스 판",
      specification: "2T x 1000 x 2000",
      unit: "장",
      supplier: "대한금속",
      price: 150000,
      currentStock: 15,
      availableStock: 20,
      stockManagement: "N",
      account: "원자재",
      procurement: "국내",
      usage: "생산",
      materialGroup: "금속",
      remark: "안전재고 5장",
    },
    {
      id: 2,
      materialCode: "M002",
      materialName: "알루미늄 파이프",
      specification: "3T x 500 x 1000",
      unit: "개",
      supplier: "한국알루미늄",
      price: 200000,
      currentStock: 30,
      availableStock: 20,
      stockManagement: "Y",
      account: "부자재",
      procurement: "국내",
      usage: "생산",
      materialGroup: "금속",
      remark: "안전재고 10개",
    },
    {
      id: 3,
      materialCode: "M003",
      materialName: "구리 와이어",
      specification: "1.5mm",
      unit: "m",
      supplier: "일본구리",
      price: 300000,
      currentStock: 25,
      availableStock: 25,
      stockManagement: "N",
      account: "원자재",
      procurement: "수입",
      usage: "생산",
      materialGroup: "금속",
      remark: "안전재고 5m",
    },
    {
      id: 4,
      materialCode: "M004",
      materialName: "황동 봉",
      specification: "5mm",
      unit: "개",
      supplier: "대한황동",
      price: 180000,
      currentStock: 25,
      availableStock: 25,
      stockManagement: "N",
      account: "원자재",
      procurement: "국내",
      usage: "생산",
      materialGroup: "금속",
      remark: "안전재고 5개",
    },
    {
      id: 5,
      materialCode: "M005",
      materialName: "티타늄 판",
      specification: "1T x 800 x 1500",
      unit: "장",
      supplier: "한국티타늄",
      price: 450000,
      currentStock: 25,
      availableStock: 25,
      stockManagement: "Y",
      account: "원자재",
      procurement: "국내",
      usage: "생산",
      materialGroup: "금속",
      remark: "안전재고 3장",
    },
  ]);

  const [materialSelectedRows, setMaterialSelectedRows] = useState([]);
  const isMaterialAllSelected = materialSelectedRows.length === materialData.length;

  const handleMaterialHeaderCheckboxChange = (e) => {
    if (e.checked) {
      setMaterialSelectedRows(materialData);
    } else {
      setMaterialSelectedRows([]);
    }
  };

  const handleMaterialRowCheckboxChange = (rowData, checked) => {
    if (checked) {
      setMaterialSelectedRows((prev) => [...prev, rowData]);
    } else {
      setMaterialSelectedRows((prev) => prev.filter((row) => row.id !== rowData.id));
    }
  };

  // 체크박스 상태를 포함한 테이블 데이터
  const materialDataWithSelection = materialData.map((row) => ({
    ...row,
    isSelected: materialSelectedRows.some((selected) => selected.id === row.id),
  }));

  // 이미지 테이블 상태
  const [imageData, setImageData] = useState([
    { id: 1, name: "image1.jpg", url: faker.image.url() },
    { id: 2, name: "image2.jpg", url: faker.image.url() },
    { id: 3, name: "image3.jpg", url: faker.image.url() },
    { id: 4, name: "image4.jpg", url: faker.image.url() },
    { id: 5, name: "image5.jpg", url: faker.image.url() },
  ]);
  const [selectedImages, setSelectedImages] = useState([]);

  // 소계 데이터 생성 함수
  const generateSubtotalData = (data) => {
    const result = [...data];

    // 1단계: 자재그룹별 소계
    const groupSubtotals = Object.entries(
      data.reduce((acc, item) => {
        if (!acc[item.materialGroup]) {
          acc[item.materialGroup] = {
            total: 0,
            count: 0,
          };
        }
        acc[item.materialGroup].total += item.price * item.currentStock;
        acc[item.materialGroup].count += 1;
        return acc;
      }, {}),
    ).map(([group, { total, count }]) => ({
      id: `group-${group}`,
      materialCode: "",
      materialName: "",
      specification: "",
      unit: "",
      supplier: "",
      price: 0,
      currentStock: 0,
      availableStock: 0,
      stockManagement: "",
      account: "",
      procurement: "",
      usage: "",
      materialGroup: group,
      remark: "",
      isSubtotal: true,
      subtotalAmount: total,
      rowCount: count,
    }));

    // 2단계: 계정별 소계
    const accountSubtotals = Object.entries(
      data.reduce((acc, item) => {
        if (!acc[item.account]) {
          acc[item.account] = {
            total: 0,
            count: 0,
          };
        }
        acc[item.account].total += item.price * item.currentStock;
        acc[item.account].count += 1;
        return acc;
      }, {}),
    ).map(([account, { total, count }]) => ({
      id: `account-${account}`,
      materialCode: "",
      materialName: "",
      specification: "",
      unit: "",
      supplier: "",
      price: 0,
      currentStock: 0,
      availableStock: 0,
      stockManagement: "",
      account: account,
      procurement: "",
      usage: "",
      materialGroup: "",
      remark: "",
      isSubtotal: true,
      subtotalAmount: total,
      rowCount: count,
    }));

    // 3단계: 조달별 소계
    const procurementSubtotals = Object.entries(
      data.reduce((acc, item) => {
        if (!acc[item.procurement]) {
          acc[item.procurement] = {
            total: 0,
            count: 0,
          };
        }
        acc[item.procurement].total += item.price * item.currentStock;
        acc[item.procurement].count += 1;
        return acc;
      }, {}),
    ).map(([procurement, { total, count }]) => ({
      id: `procurement-${procurement}`,
      materialCode: "",
      materialName: "",
      specification: "",
      unit: "",
      supplier: "",
      price: 0,
      currentStock: 0,
      availableStock: 0,
      stockManagement: "",
      account: "",
      procurement: procurement,
      usage: "",
      materialGroup: "",
      remark: "",
      isSubtotal: true,
      subtotalAmount: total,
      rowCount: count,
    }));

    return [...result, ...groupSubtotals, ...accountSubtotals, ...procurementSubtotals];
  };

  // 샘플 데이터
  const fruitData = [
    { date: "2/27/2018", fruit: "Apple", price: 7.1, amount: 165.3 },
    { date: "2/27/2018", fruit: "Apple", price: 8.4, amount: 148.2 },
    { date: "2/28/2018", fruit: "Apple", price: 5.9, amount: 554.8 },
    { date: "2/28/2018", fruit: "Apple", price: 8.3, amount: 270 },
    { date: "3/1/2018", fruit: "Apple", price: 5, amount: 176.8 },
    { date: "2/27/2018", fruit: "Longan", price: 4.9, amount: 539.6 },
    { date: "3/1/2018", fruit: "Longan", price: 7, amount: 660.3 },
    { date: "3/1/2018", fruit: "Longan", price: 9.7, amount: 32.4 },
    { date: "3/3/2018", fruit: "Longan", price: 7.6, amount: 598.5 },
    { date: "2/27/2018", fruit: "Lychee", price: 6.8, amount: 613.2 },
    { date: "2/28/2018", fruit: "Lychee", price: 4.1, amount: 359.9 },
    { date: "3/2/2018", fruit: "Lychee", price: 6.2, amount: 307.2 },
    { date: "3/2/2018", fruit: "Lychee", price: 6.7, amount: 492.9 },
    { date: "3/1/2018", fruit: "Orange", price: 6.9, amount: 656.6 },
    { date: "3/2/2018", fruit: "Orange", price: 3.4, amount: 492 },
    { date: "3/3/2018", fruit: "Orange", price: 2.5, amount: 542.8 },
    { date: "3/3/2018", fruit: "Orange", price: 4.6, amount: 655.7 },
    { date: "3/3/2018", fruit: "Orange", price: 2.5, amount: 161 },
    { date: "2/27/2018", fruit: "Plum", price: 4.8, amount: 734.7 },
    { date: "3/1/2018", fruit: "Plum", price: 3.2, amount: 465 },
    { date: "3/1/2018", fruit: "Plum", price: 9.1, amount: 279 },
    { date: "3/3/2018", fruit: "Plum", price: 9.2, amount: 434 },
    { date: "3/3/2018", fruit: "Plum", price: 8.3, amount: 341 },
  ];

  // 소계/합계 데이터 생성 함수
  function addSubtotalsAndGrandTotal(data) {
    const result = [];
    let subtotal = 0;
    let grandTotal = 0;

    data.forEach((row, idx) => {
      result.push(row);
      subtotal += row.amount;
      grandTotal += row.amount;
      const nextFruit = data[idx + 1]?.fruit;
      if (row.fruit !== nextFruit) {
        // 소계 행 추가
        result.push({
          isSubtotal: true,
          fruit: `${row.fruit} 소계`,
          amount: Number(subtotal.toFixed(2)),
        });
        subtotal = 0;
      }
    });
    // 합계 행 추가
    result.push({
      isGrandTotal: true,
      fruit: "총 합계",
      amount: Number(grandTotal.toFixed(2)),
    });
    return result;
  }

  const fruitDataWithTotals = addSubtotalsAndGrandTotal(fruitData);
  const grandTotalRow = fruitDataWithTotals.find((row) => row.isGrandTotal);
  const dataWithoutGrandTotal = fruitDataWithTotals.filter((row) => !row.isGrandTotal);

  // TreeTable 데이터
  const [treeTableData] = useState([
    {
      key: "0",
      data: { name: "Applications", size: "100kb", type: "Folder" },
      children: [
        {
          key: "0-0",
          data: { name: "React", size: "25kb", type: "Folder" },
          children: [
            {
              key: "0-0-0",
              data: { name: "react.app", size: "10kb", type: "Application" },
            },
            {
              key: "0-0-1",
              data: { name: "native.app", size: "10kb", type: "Application" },
            },
            {
              key: "0-0-2",
              data: { name: "mobile.app", size: "5kb", type: "Application" },
            },
          ],
        },
        {
          key: "0-1",
          data: { name: "editor.app", size: "25kb", type: "Application" },
        },
        {
          key: "0-2",
          data: { name: "settings.app", size: "50kb", type: "Application" },
        },
      ],
    },
    {
      key: "1",
      data: { name: "Cloud", size: "20kb", type: "Folder" },
      children: [
        {
          key: "1-0",
          data: { name: "backup-1.zip", size: "10kb", type: "Zip" },
        },
        {
          key: "1-1",
          data: { name: "backup-2.zip", size: "10kb", type: "Zip" },
        },
      ],
    },
    {
      key: "2",
      data: { name: "Desktop", size: "150kb", type: "Folder" },
      children: [
        {
          key: "2-0",
          data: { name: "note-meeting.txt", size: "50kb", type: "Text" },
        },
        {
          key: "2-1",
          data: { name: "note-todo.txt", size: "100kb", type: "Text" },
        },
      ],
    },
  ]);

  return (
    <div>
      <section className="style-guide__section">
        <h2 className="style-guide__title">📊 DataTable</h2>
        <Accordion>
          <AccordionTab header="DataTable 컴포넌트 사용법">
            <div className="p-4">
              <h4>1. 기본 구조</h4>
              <pre className="bg-gray-100 p-4 rounded mt-2">
                {`<DataTable
  value={tableData}
  selectionMode="single"
  selection={selectedRow}
  onSelectionChange={(e) => setSelectedRow(e.value)}
  metaKeySelection={true}
  dataKey="id"
  showGridlines
  scrollable
  scrollHeight="400px"
  resizableColumns
>
  <Column field="fieldName" header="컬럼명" />
</DataTable>`}
              </pre>

              <h4 className="mt-4">2. 주요 Props</h4>
              <ul className="list-disc pl-4">
                <li>
                  <code>value</code>: 테이블에 표시할 데이터 배열
                </li>
                <li>
                  <code>selectionMode</code>: 행 선택 모드 (&quot;single&quot; |
                  &quot;multiple&quot;)
                </li>
                <li>
                  <code>selection</code>: 선택된 행 데이터
                </li>
                <li>
                  <code>dataKey</code>: 각 행의 고유 식별자 필드명
                </li>
                <li>
                  <code>scrollable</code>: 스크롤 가능 여부
                </li>
                <li>
                  <code>scrollHeight</code>: 테이블 높이 (&quot;400px&quot; | &quot;flex&quot;)
                </li>
                <li>
                  <code>resizableColumns</code>: 컬럼 크기 조절 가능 여부
                </li>
              </ul>
            </div>
          </AccordionTab>
        </Accordion>

        <div className="style-guide__table-group">
          <div className="datatable__header">
            <h3>데이터 목록</h3>
            <div className="datatable__btns">
              <Button label="삭제" size="small" severity="danger" icon="pi pi-times" />
              <Button label="추가" size="small" icon="pi pi-plus" />
            </div>
          </div>
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={tableData}
            selectionMode="single"
            selection={selectedRow}
            onSelectionChange={(e) => setSelectedRow(e.value)}
            metaKeySelection={true}
            dataKey="id"
            showGridlines
            scrollable
            scrollHeight="400px"
            resizableColumns
          >
            <Column
              header="순번"
              body={(_, options) => options.rowIndex + 1}
              style={{ width: "3rem" }}
            />
            <Column field="id" header="ID" />
            <Column field="name" header="이름" />
            <Column field="age" header="오른쪽 정렬" className="text-right" />
            <Column field="city" header="도시" />
            <Column
              header="수정/삭제"
              body={() => (
                <div className="buttonSet">
                  <Button label="수정" outlined size="small" />
                  <Button label="삭제" outlined size="small" severity="danger" />
                </div>
              )}
              style={{ width: "150px" }}
            />
          </DataTable>
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__title">📊 DataTable (체크박스 & 컬럼 표시/숨김)</h2>
        <Accordion>
          <AccordionTab header="체크박스 & 컬럼 표시/숨김 기능 사용법">
            <div className="p-4">
              <h4>1. 체크박스 기능</h4>
              <ul className="list-disc pl-4">
                <li>헤더 체크박스: 전체 선택/해제</li>
                <li>행 체크박스: 개별 행 선택/해제</li>
              </ul>

              <h4 className="mt-4">2. 컬럼 표시/숨김 기능</h4>
              <ul className="list-disc pl-4">
                <li>columnVisibility 상태로 각 컬럼의 표시 여부 관리</li>
                <li>조건부 렌더링으로 컬럼 표시/숨김 처리</li>
                <li>체크박스로 사용자가 컬럼 표시 여부 제어</li>
              </ul>

              <h4 className="mt-4">3. 주요 코드</h4>
              <pre className="bg-gray-100 p-4 rounded mt-2">
                {`// 체크박스 상태 관리
const [selectedRows, setSelectedRows] = useState([]);
const isAllSelected = selectedRows.length === tableData.length;

// 컬럼 표시/숨김 상태 관리
const [columnVisibility] = useState({
  supplier: true,
  purchasePrice: true,
  currentStock: true,
  availableStock: true
});

// 체크박스 핸들러
const handleHeaderCheckboxChange = (e) => {
  if (e.checked) {
    setSelectedRows(tableData);
  } else {
    setSelectedRows([]);
  }
};

const handleRowCheckboxChange = (rowData, checked) => {
  if (checked) {
    setSelectedRows(prev => [...prev, rowData]);
  } else {
    setSelectedRows(prev => prev.filter(row => row.id !== rowData.id));
  }
};`}
              </pre>
            </div>
          </AccordionTab>
        </Accordion>

        <div className="style-guide__table-group">
          <div className="datatable__header">
            <h3>checkbox 선택과 행 선택을 따로 관리</h3>
            <div className="datatable__btns">
              <Button label="버튼" size="small" icon="pi pi-plus" />
            </div>
          </div>
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={materialDataWithSelection}
            selectionMode="single"
            selection={selectedRow}
            onSelectionChange={(e) => setSelectedRow(e.value)}
            metaKeySelection={true}
            dataKey="id"
            showGridlines
            scrollable
            scrollHeight="400px"
            resizableColumns
          >
            <Column
              headerStyle={{ width: "3rem" }}
              header={() => (
                <Checkbox
                  onChange={handleMaterialHeaderCheckboxChange}
                  checked={isMaterialAllSelected}
                />
              )}
              body={(rowData) => (
                <Checkbox
                  onChange={(e) => handleMaterialRowCheckboxChange(rowData, e.checked)}
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

        <div className="detail" style={{ maxHeight: "300px", overflow: "auto" }}>
          <div className="flex gap-3">
            <div className="con-body">
              <h4 className="font-bold mb-2">체크박스로 선택한 행</h4>
              {materialSelectedRows.length > 0 ? (
                materialSelectedRows.map((row, idx) => (
                  <div key={idx} className="mb-2 p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">자재코드:</span>
                      <span>{row.materialCode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">자재명:</span>
                      <span>{row.materialName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">규격:</span>
                      <span>{row.specification}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">단위:</span>
                      <span>{row.unit}</span>
                    </div>
                    {columnVisibility.supplier && (
                      <div className="flex items-center gap-2">
                        <span className="font-bold">거래처:</span>
                        <span>{row.supplier}</span>
                      </div>
                    )}
                    {columnVisibility.purchasePrice && (
                      <div className="flex items-center gap-2">
                        <span className="font-bold">단가:</span>
                        <span>{formatNumberWithCommas(row.price)}원</span>
                      </div>
                    )}
                    {columnVisibility.currentStock && (
                      <div className="flex items-center gap-2">
                        <span className="font-bold">현재고:</span>
                        <span>{row.currentStock}</span>
                      </div>
                    )}
                    {columnVisibility.availableStock && (
                      <div className="flex items-center gap-2">
                        <span className="font-bold">가용재고:</span>
                        <span>{row.availableStock}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">선택된 행이 없습니다.</div>
              )}
            </div>
            <div className="con-body">
              <div className="flex items-center gap-2">
                <span className="font-bold">최종거래처:</span>
                <span>{selectedRow?.supplier || "-"}</span>
              </div>
            </div>
            <div className="con-body">
              <div className="flex items-center gap-2">
                <span className="font-bold">재고수량:</span>
                <span>{selectedRow?.currentStock || "-"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__title">📊 DataTable (조건부 스타일링)</h2>
        <Accordion>
          <AccordionTab header="조건부 스타일링 사용법">
            <div className="p-4">
              <h4>1. 행 스타일링 조건</h4>
              <ul className="list-disc pl-4">
                <li>
                  글자색 조건:
                  <ul className="list-disc pl-4">
                    <li>현재고 {"<"} 가용재고: 빨간색</li>
                    <li>현재고 {">"} 가용재고: 초록색</li>
                    <li>재고관리 = 'Y': 파란색</li>
                    <li>조달 = '수입': 보라색</li>
                    <li>기본: 검정색</li>
                  </ul>
                </li>
                <li>
                  배경색 조건:
                  <ul className="list-disc pl-4">
                    <li>현재고 {"<"} 20: 노란색 배경</li>
                  </ul>
                </li>
              </ul>
            </div>
          </AccordionTab>
        </Accordion>

        <div className="style-guide__table-group">
          <div className="datatable__header">
            <h3>조건부 스타일링이 적용된 테이블</h3>
            <div className="datatable__btns">
              <Button label="추가" size="small" icon="pi pi-plus" />
            </div>
          </div>
          <DataTable
            value={materialData}
            showGridlines
            scrollable
            scrollHeight="400px"
            resizableColumns
            emptyMessage="데이터가 없습니다."
            rowClassName={(rowData) => {
              let textColor = "text-black"; // 기본 검정색

              // 글자색 조건
              if (rowData.currentStock < rowData.availableStock) {
                textColor = "text-red-500";
              } else if (rowData.currentStock > rowData.availableStock) {
                textColor = "text-green-500";
              } else if (rowData.stockManagement === "Y") {
                textColor = "text-blue-500";
              } else if (rowData.procurement === "수입") {
                textColor = "text-purple-500";
              }

              // 배경색 조건
              let bgColor = "";
              if (rowData.currentStock < 20) {
                bgColor = "bg-yellow-100";
              }

              return `${textColor} ${bgColor}`;
            }}
          >
            <Column field="materialCode" header="자재코드" />
            <Column field="materialName" header="자재명" />
            <Column field="specification" header="규격" />
            <Column field="unit" header="단위" />
            <Column field="supplier" header="거래처" />
            <Column
              field="price"
              header="단가"
              body={(rowData) => formatNumberWithCommas(rowData.price)}
            />
            <Column field="currentStock" header="현재고" />
            <Column field="availableStock" header="가용재고" />
            <Column field="stockManagement" header="재고관리" />
            <Column field="account" header="계정" />
            <Column field="procurement" header="조달" />
            <Column field="usage" header="사용" />
            <Column field="materialGroup" header="자재그룹" />
            <Column field="remark" header="비고" />
          </DataTable>
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__title">📊 DataTable (이미지 테이블 & DnD)</h2>
        <Accordion>
          <AccordionTab header="이미지 테이블 & DnD 기능 사용법">
            <div className="p-4">
              <h4>1. 주요 기능</h4>
              <ul className="list-disc pl-4">
                <li>이미지 파일 업로드 및 미리보기</li>
                <li>체크박스로 다중 선택</li>
                <li>DnD로 행 순서 변경</li>
                <li>컬럼 크기 조절</li>
              </ul>

              <h4 className="mt-4">2. 주요 Props</h4>
              <ul className="list-disc pl-4">
                <li>
                  <code>reorderableRows</code>: 행 순서 변경 가능
                </li>
                <li>
                  <code>reorderableColumns</code>: 컬럼 순서 변경 가능
                </li>
                <li>
                  <code>onRowReorder</code>: 행 순서 변경 이벤트 핸들러
                </li>
                <li>
                  <code>selectionMode=&quot;multiple&quot;</code>: 다중 선택 모드
                </li>
              </ul>
            </div>
          </AccordionTab>
        </Accordion>

        <div className="style-guide__table-group">
          <div className="datatable__header">
            <h3>이미지 테이블 (DnD 기능 포함)</h3>
            <div className="datatable__btns">
              <Button
                label="이미지 삭제"
                size="small"
                severity="danger"
                icon="pi pi-times"
                disabled={selectedImages.length === 0}
              />
              <Button label="이미지 추가" size="small" icon="pi pi-plus" />
            </div>
          </div>
          <DataTable
            emptyMessage="등록된 이미지가 없습니다."
            value={imageData}
            selection={selectedImages}
            onSelectionChange={(e) => setSelectedImages(e.value)}
            dataKey="id"
            showGridlines
            scrollable
            scrollHeight="300px"
            resizableColumns
            metaKeySelection={true}
            reorderableColumns
            reorderableRows
            onRowReorder={(e) => setImageData(e.value)}
            rowReorderIcon="pi pi-bars"
            rowReorderMode="swap"
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column header="DnD" rowReorder style={{ width: "3rem" }} />
            <Column
              header="썸네일"
              body={(rowData) => (
                <img
                  src={rowData.url}
                  alt={rowData.name}
                  style={{ width: 48, height: 48, objectFit: "cover" }}
                />
              )}
              style={{ width: "5rem" }}
            />
            <Column field="name" header="이미지명" />
          </DataTable>
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__title">📊 DataTable (소계 & 합계, 하단 고정)</h2>
        <Accordion>
          <AccordionTab header="엑셀 피벗테이블 스타일 소계/합계 & 하단 고정">
            <div className="p-4">
              <h4>1. 주요 기능</h4>
              <ul className="list-disc pl-4">
                <li>그룹별 소계는 해당 그룹 마지막에 표시</li>
                <li>합계(Grand Total)는 테이블 하단에 고정</li>
                <li>소계/합계 행은 연한 주황 배경, 파란 굵은 글씨</li>
              </ul>
            </div>
          </AccordionTab>
        </Accordion>
        <div className="pivot-table-wrapper">
          <DataTable
            value={[...dataWithoutGrandTotal, grandTotalRow]}
            scrollable
            scrollHeight="400px"
            showGridlines
            resizableColumns
            emptyMessage="데이터가 없습니다."
            rowClassName={(row) => {
              if (row.isSubtotal) return "pivot-table-subtotal-row";
              if (row.isGrandTotal) return "pivot-table-grandtotal-row";
              return "";
            }}
            className="pivot-table"
          >
            <Column field="date" header="Date" />
            <Column field="fruit" header="Fruit" />
            <Column field="price" header="Price" className="text-right" />
            <Column
              field="amount"
              header="Amount"
              body={(row) =>
                row.amount !== undefined
                  ? row.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : ""
              }
              className="text-right"
            />
          </DataTable>
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__title">📊 TreeTable</h2>
        <Accordion>
          <AccordionTab header="TreeTable 컴포넌트 사용법">
            <div className="p-4">
              <h4>1. 기본 구조</h4>
              <pre className="bg-gray-100 p-4 rounded mt-2">
                {`<TreeTable
  value={treeTableData}
  tableStyle={{ minWidth: '50rem' }}
>
  <Column field="name" header="Name" expander></Column>
  <Column field="size" header="Size"></Column>
  <Column field="type" header="Type"></Column>
</TreeTable>`}
              </pre>

              <h4 className="mt-4">2. 주요 Props</h4>
              <ul className="list-disc pl-4">
                <li>
                  <code>value</code>: 트리 구조의 데이터 배열
                </li>
                <li>
                  <code>expander</code>: 확장/축소 아이콘을 표시할 컬럼에 설정
                </li>
                <li>
                  <code>tableStyle</code>: 테이블 스타일 설정
                </li>
              </ul>
            </div>
          </AccordionTab>
        </Accordion>

        <div className="style-guide__table-group">
          <div className="datatable__header">
            <h3>트리 구조 테이블</h3>
          </div>
          <TreeTable
            value={treeTableData}
            tableStyle={{ minWidth: "50rem" }}
            showGridlines
            scrollable
            scrollHeight="400px"
            resizableColumns
          >
            <Column field="name" header="이름" expander></Column>
            <Column field="size" header="크기"></Column>
            <Column field="type" header="유형"></Column>
          </TreeTable>
        </div>
      </section>
    </div>
  );
};

export default StyleGuideTab3;
