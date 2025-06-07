// 7.4.4.시스템환경설정	A0025	systemConfig	BM-7404

import ComSearch from "@/components/ComSearch";
import useToastStore from "@/store/toastStore";
import { faker } from "@faker-js/faker";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";

const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    category: faker.helpers.arrayElement(["시스템", "사용자", "보안", "기타"]),
    code: `SYS${(1000 + index).toString().padStart(4, "0")}`,
    name: `환경설정 ${index + 1}`,
    typeCategory: faker.helpers.arrayElement(["텍스트", "숫자", "날짜", "선택"]),
    typeSetting: faker.helpers.arrayElement(["필수", "선택", "읽기전용"]),
    selectRange: faker.helpers.arrayElement(["전체", "부분", "단일"]),
  }));
};
const sampleList = generateSampleList(30);

const SystemConfigPage = () => {
  const [saveObject, setSaveObject] = useState({}); // 검색용
  const showToast = useToastStore.getState().showToast;
  const [data, setData] = useState();
  const searchCategory = {
    pageCode: 7404,
    text: ["환경요소명"],
    select: ["select1"],
    callList: [],
    detailedSearch: {
      isUse: false,
    },
  };

  useEffect(() => {
    showToast({
      severity: "info",
      summary: "백엔드 api 데이터 호출",
      detail: `saveObject: ${JSON.stringify(saveObject)}`,
    });
  }, [saveObject]);

  useEffect(() => {
    // TODO 백엔드 호출
    setData(sampleList);
  }, []);

  return (
    <div id="SystemConfigPage">
      {/* 공통 검색바 */}
      <ComSearch searchCategory={searchCategory} setSaveObject={setSaveObject} />
      <div className="content-box">
        <section className="datatable mt-3">
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={data}
            dataKey="code"
            showGridlines
            scrollable
            scrollHeight="flex"
            resizableColumns
          >
            <Column field="category" header="구분"></Column>
            <Column field="code" header="코드"></Column>
            <Column field="name" header="환경요소명"></Column>
            <Column field="typeCategory" header="유형구분"></Column>
            <Column field="typeSetting" header="유형설정"></Column>
            <Column field="selectRange" header="선택범위"></Column>
          </DataTable>
        </section>
      </div>
    </div>
  );
};

export default SystemConfigPage;
