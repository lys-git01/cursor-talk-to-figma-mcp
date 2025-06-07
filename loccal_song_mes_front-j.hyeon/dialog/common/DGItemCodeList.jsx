// 품목(코드모음)	L1005	DG-itemCodeList	DG-02

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

export const DGItemCodeList = ({ onCloseFn, type = "품목" }) => {
  const showToast = useToastStore.getState().showToast;
  const [allData, setAllData] = useState([]); // 원본 데이터
  const [data, setData] = useState();
  const [selectedData, setSelectedData] = useState(null);
  const [form, setForm] = useState({ name: "", checkbox: "" });

  const onRowSelect = (event) => {
    showToast({
      severity: "info",
      summary: "Product Selected",
      detail: `Name: ${event.data.name}`,
      life: 3000,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clickSearchBtn = () => {
    // TODO
    const filtered = allData.filter((data) => {
      const nameMatch = data.name.toLowerCase().includes(form.name.toLowerCase());
      return nameMatch;
    });

    setData(filtered);

    showToast({
      severity: "info",
      summary: "검색 완료",
      detail: `${filtered.length}건 검색됨`,
    });
  };

  useEffect(() => {
    // TODO
    showToast({
      severity: "info",
      summary: "백엔드 api 호출",
      detail: "백엔드 api 호출",
    });
    setData(sampleList);
    setAllData(sampleList);
    setSelectedData(sampleList[0]);
  }, []);

  const selectedItemsBtn = () => {
    onCloseFn(selectedData);
  };
  return (
    <Dialog
      header={`${type} 선택`}
      visible
      modal={false}
      tyle={{ width: "50vw" }}
      onHide={() => onCloseFn([])}
      className="DGItemCodeList"
    >
      <div className="Dialog-container">
        <div className="DGItemCodeList-search pt-1">
          <div className="common-search__input">
            <InputText placeholder="입력해주세요." name="name" onChange={handleChange} />
          </div>
          <Button label="검색" onClick={clickSearchBtn}></Button>
        </div>

        <div className="DGItemCodeList-table mt-3">
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={data}
            selectionMode="single"
            selection={selectedData}
            onSelectionChange={(e) => setSelectedData(e.value)}
            onRowSelect={onRowSelect}
            metaKeySelection={true}
            dataKey="code"
            showGridlines
            scrollable
            size="small"
            scrollHeight="flex"
          >
            <Column field="code" header="코드"></Column>
            <Column field="name" header={`${type}`}></Column>
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

export default DGItemCodeList;
