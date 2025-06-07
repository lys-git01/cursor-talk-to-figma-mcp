/* 7.1.2.거래처등록 : H1001, BM-7102 */
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ComSearch from "@/components/ComSearch";
import { faker } from "@faker-js/faker";
import useToastStore from "@/store/toastStore";
import DataDetail from "@/components/7-BM/CreditEntry/DataDetail";
import { confirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";

const TYPES = ["Vendor", "Customer", "Partner", "Distributor"];
const GRADES = ["A", "B", "C", "D"];

const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    id: (1000 + index).toString(),
    code: faker.string.alphanumeric(10).toLowerCase(),
    name: `Sample Name ${index + 1}`,
    type: TYPES[Math.floor(Math.random() * TYPES.length)],
    grade: GRADES[Math.floor(Math.random() * GRADES.length)],
  }));
};

const sampleList = generateSampleList(30);

const CreditEntryPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saveObject, setSaveObject] = useState({}); // 검색용
  const showToast = useToastStore.getState().showToast;

  useEffect(() => {
    // TODO 백엔드 호출
    setProducts(sampleList);
  }, []);

  // TODO 백엔드 호출 상세 데이터 교체
  const onRowSelect = (event) => {
    showToast({
      severity: "info",
      summary: "Product Selected",
      detail: `Name: ${event.data.name}`,
      life: 3000,
    });
  };

  useEffect(() => {
    setSelectedProduct({
      id: "1000",
      code: "e0csasuq7",
      name: "Sample Name 1",
      type: "Vendor",
      grade: "C",
    });
  }, []);

  // TODO
  useEffect(() => {
    showToast({
      severity: "info",
      summary: "백엔드 api 데이터 호출",
      detail: `saveObject: ${JSON.stringify(saveObject)}`,
    });
  }, [saveObject]);

  const searchCategory = {
    pageCode: 7102,
    text: ["거래처명", "대표자명", "사업자번호", "업종", "색인"],
    select: ["select1"],
    callList: ["담당자"],
    detailedSearch: {
      isUse: false,
    },
  };

  // TODO
  const deleteBtn = () => {
    confirmDialog({
      message: `${selectedProduct.name}을(를) 정말로 삭제하시겠습니까?`,
      header: "거래처 삭제",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };

  const accept = () => {
    showToast({
      severity: "info",
      summary: "거래처 삭제",
      detail: "거래처가 삭제되었습니다.",
      life: 3000,
    });
  };

  // TODO
  const addBtn = () => {
    navigate("/creditEntry/new");
  };
  return (
    <div id="CreditEntry">
      {/* 공통 검색바 */}
      <ComSearch searchCategory={searchCategory} setSaveObject={setSaveObject} />
      <div className="CreditEntry-con content-box">
        {/* 테이블 */}
        <section className="datatable">
          <div className="datatable__header">
            <h3>거래처 목록</h3>
            <div className="datatable__btns">
              <Button
                label="삭제"
                size="small"
                severity="danger"
                icon="pi pi-times"
                onClick={deleteBtn}
              />
              <Button label="추가" size="small" icon="pi pi-plus" onClick={addBtn} />
            </div>
          </div>

          <DataTable
            emptyMessage="데이터가 없습니다."
            value={products}
            selectionMode="single"
            selection={selectedProduct}
            onSelectionChange={(e) => setSelectedProduct(e.value)}
            onRowSelect={onRowSelect}
            metaKeySelection={true}
            dataKey="id"
            showGridlines
            scrollable
            scrollHeight="flex"
            // virtualScrollerOptions={{ itemSize: 43 }}
            resizableColumns
          >
            <Column field="code" header="코드"></Column>
            <Column field="name" header="상호"></Column>
            <Column field="type" header="유형"></Column>
            <Column field="grade" header="등급"></Column>
          </DataTable>
        </section>

        {/* 상세내용 */}
        <DataDetail selectedProduct={selectedProduct} />
      </div>
    </div>
  );
};

export default CreditEntryPage;
