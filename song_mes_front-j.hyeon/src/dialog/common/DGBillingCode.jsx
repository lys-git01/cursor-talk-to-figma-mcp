// 청구코드	L1028	DG-billingCode	DG-14

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
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

const DGBillingCode = ({ onCloseFn }) => {
  const showToast = useToastStore.getState().showToast;
  const [allBillingCode, setAllBillingCode] = useState([]); // 원본 데이터
  const [billingCode, setBillingCode] = useState([]); // 빈 배열로 초기화
  const [selectedBillingCode, setSelectedBillingCode] = useState(null);
  const [filter, setFilter] = useState("");

  const onRowSelect = (event) => {
    showToast({
      severity: "info",
      summary: "선택 완료",
      detail: `청구명: ${event.data.name}`,
      life: 3000,
    });
  };

  const handleChange = (e) => {
    setFilter(e.target.value);
  };

  const clickSearchBtn = () => {
    if (!filter.trim()) {
      setBillingCode(allBillingCode);
      showToast({
        severity: "info",
        summary: "검색어를 입력해주세요",
        detail: "검색어를 입력해주세요",
        life: 3000,
      });
      return;
    }

    const filtered = allBillingCode.filter((billingCode) => {
      return billingCode.name.toLowerCase().includes(filter.toLowerCase());
    });

    setBillingCode(filtered);

    if (filtered.length === 0) {
      showToast({
        severity: "warn",
        summary: "검색 결과 없음",
        detail: "검색 결과가 없습니다.",
        life: 3000,
      });
    } else {
      showToast({
        severity: "info",
        summary: "검색 완료",
        detail: `${filtered.length}건 검색됨`,
        life: 3000,
      });
    }
  };

  useEffect(() => {
    // TODO
    showToast({
      severity: "info",
      summary: "백엔드 api 호출",
      detail: "백엔드 api 호출",
    });
    setAllBillingCode(sampleList);
    setBillingCode(sampleList);
  }, []);

  const selectedItemsBtn = () => {
    onCloseFn(selectedBillingCode);
  };
  return (
    <Dialog
      header="청구코드 선택"
      visible
      modal={false}
      onHide={() => onCloseFn([])}
      className="DGBillingCode"
    >
      <div className="Dialog-container">
        <div className="DGBillingCode-search">
          <div className="common-search__input">
            <label htmlFor="DialogBillingCode1">청구명</label>
            <InputText
              placeholder="청구명"
              name="name"
              id="DialogBillingCode1"
              onChange={handleChange}
            />
          </div>
          <Button label="검색" onClick={clickSearchBtn}></Button>
        </div>

        <div className="DGBillingCode-table">
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={billingCode}
            selectionMode={"single"}
            selection={selectedBillingCode}
            onSelectionChange={(e) => setSelectedBillingCode(e.value)}
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
            <Column field="code" header="청구코드"></Column>
            <Column field="name" header="청구명"></Column>
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

export default DGBillingCode;
