// 공통코드	L4002 DG-68

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

const DGCommonCode1 = ({ state, onCloseFn }) => {
  const showToast = useToastStore.getState().showToast;
  const [selectedRow, setSelectedRow] = useState(null);
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [word, setWord] = useState("");

  let title = "";
  switch (state) {
    case "acct":
      title = "계정과목 코드";
      break;
    case "sd":
      title = "연동항목 코드";
      break;
    case "group":
      title = "계정그룹 코드";
      break;
    case "cf":
      title = "현금 흐름표 코드";
      break;
    case "itemgrp":
      title = "자재그룹 코드";
      break;
    case "taxo":
      title = "세무소 코드";
      break;
    case "corp":
      title = "법인 형태 코드";
      break;
    case "div":
      title = "사업장 코드";
      break;
    case "sect":
      title = "부문 코드";
      break;
    case "dept":
      title = "부서 코드";
      break;
    case "bank":
      title = "금융 기관 코드";
      break;
    case "ctd":
      title = "공통 코드";
      break;
    case "pjt":
      title = "프로젝트 코드";
      break;
    case "emp":
      title = "사원 코드";
      break;
    case "cash":
      title = "자금 과목 코드";
      break;
    case "car":
      title = "차량 코드";
      break;
    case "securities":
      title = "증권 종류";
      break;
    case "salearea":
      title = "영업 지역";
      break;
    case "taxkind":
      title = "세무 구분";
      break;
    case "exchcd":
      title = "환종 코드";
      break;
    case "mgmtitem":
      title = "관리항목코드";
      break;
    default:
      break;
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
  }, []);
  const clickSearchBtn = () => {
    // 검색어로 필터링
    const filtered = allData.filter((item) => {
      return item.name.toLowerCase().includes(word.toLowerCase());
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
          <div>
            <div className="common-search__input">
              <InputText
                placeholder="단어입력"
                name="word"
                value={word}
                onChange={(e) => setWord(e.target.value)}
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
          // onRowSelect={onRowSelect}
          metaKeySelection={true}
          dataKey="code"
          showGridlines
          scrollable
          size="small"
          scrollHeight="calc(60vh - 240px)"
          // virtualScrollerOptions={{ itemSize: 43 }}
          // resizableColumns
          rowClassName={(rowData) => (rowData.quit ? "allRed" : "")}
        >
          <Column field="code" header="코드"></Column>
          <Column field="name" header="이름"></Column>
        </DataTable>
      </div>
      <div className="Dialog__btns">
        <Button label="닫기" severity="secondary" onClick={onCloseFn}></Button>
        {print && <Button label="선택" onClick={() => onCloseFn(selectedRow)}></Button>}
      </div>
    </Dialog>
  );
};

export default DGCommonCode1;
