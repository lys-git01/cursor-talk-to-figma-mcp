// 공통코드	L4003	DG-commonCode2	DG-69

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import useToastStore from "@/store/toastStore";
import { RadioButton } from "primereact/radiobutton";

const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    code: (1000 + index).toString(),
    name: `Name${index + 1}`,
    detail: `Detail${index + 1}`,
  }));
};
const sampleList = generateSampleList(30);

const DGCommonCode2 = ({ state, onCloseFn }) => {
  const showToast = useToastStore.getState().showToast;
  const [selectedRow, setSelectedRow] = useState(null);
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);

  const [form, setForm] = useState({
    searchField: "code",
    keyword: "",
  });

  let title = "";
  if (state === "Sbusiness") {
    title = "세무 업종 코드";
  } else if (state === "Sbebgong") {
    title = "신고지 코드";
  } else if (state === "Asset") {
    title = "자산 코드";
  } else if (state === "Aloan") {
    title = "차입금 코드";
  } else if (state === "Alend") {
    title = "대여금 코드";
  }

  useEffect(() => {
    // TODO 백엔드 데이터 호출
    showToast({
      severity: "info",
      summary: "백엔드 api 호출",
      detail: "백엔드 api 호출",
    });
    setAllData(sampleList);
    setData(sampleList);
    setSelectedRow(sampleList[0]);
  }, []);
  const handleChange = (e) => {
    const { type, name, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const clickSearchBtn = () => {
    // 검색어로 필터링
    const filtered = allData.filter((item) => {
      return item[form.searchField].toLowerCase().includes(form.keyword.toLowerCase());
    });
    setData(filtered);

    showToast({
      severity: "info",
      summary: "검색 완료",
      detail: `${filtered.length}건 검색됨`,
    });
  };
  return (
    <Dialog
      header={title}
      visible
      modal={false}
      tyle={{ width: "50vw" }}
      onHide={onCloseFn}
      className="imageViewer"
    >
      <div className="Dialog-container">
        <div className="DialogUsers-search">
          <span className="search-label">검색기준</span>
          {["code", "name"].map((field) => (
            <div key={field} className="flex items-center">
              <RadioButton
                inputId={field}
                name="searchField"
                value={field}
                onChange={handleChange}
                checked={form.searchField === field}
              />
              <label htmlFor={field} className="ml-2">
                {field === "code" ? "코드" : "검색어"}
              </label>
            </div>
          ))}
          <div>
            <div className="common-search__input">
              <InputText
                placeholder="단어입력"
                name="word"
                value={form.keyword}
                onChange={(e) => setForm({ ...form, keyword: e.target.value })}
              />
            </div>
          </div>
          <Button label="검색" onClick={clickSearchBtn}></Button>
        </div>

        <DataTable
          emptyMessage="데이터가 없습니다."
          className="mt-2"
          value={data}
          selectionMode="single"
          selection={selectedRow}
          onSelectionChange={(e) => setSelectedRow(e.value)}
          metaKeySelection={true}
          dataKey="code"
          showGridlines
          scrollable
          size="small"
          scrollHeight="calc(60vh - 240px)"
        >
          <Column field="code" header="코드"></Column>
          <Column field="name" header="이름"></Column>
        </DataTable>
      </div>
      <div className="Dialog__btns">
        <Button label="닫기" severity="secondary" onClick={onCloseFn}></Button>
        <Button label="선택" onClick={() => onCloseFn(selectedRow)}></Button>
      </div>
    </Dialog>
  );
};

export default DGCommonCode2;
