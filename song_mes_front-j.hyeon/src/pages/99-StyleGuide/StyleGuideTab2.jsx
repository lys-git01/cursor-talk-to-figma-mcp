import React from "react";

import { useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Accordion, AccordionTab } from "primereact/accordion";
import ComSearch from "@/components/ComSearch";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";
import { renderRow } from "@/utils/common";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

const StyleGuideTab2 = () => {
  // SearchBar 예제용 상태 추가
  const [searchResult, setSearchResult] = useState({});

  // FormList 관련 상태 추가
  const [form, setForm] = useState({
    그룹용도: "",
    사용여부: null,
  });

  // 사용여부 옵션
  const USE_STATUS_OPTIONS = [
    { label: "사용", value: "Y" },
    { label: "미사용", value: "N" },
  ];

  // onChange 핸들러
  const onChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // SearchBar 예제용 설정
  const searchCategory = {
    pageCode: 9999,
    text: ["거래처명", "사업자번호"],
    dates: [
      {
        label: "조회기간",
        startDate: "1MonthAgo",
        endDate: "today",
      },
      {
        label: "거래일자",
        startDate: "today",
        endDate: "today",
        labelOptions: ["거래일자", "입금번호", "전표일자"],
      },
    ],
    dateText: ["입금번호"],
    select: ["select1"],
    multiSelect: ["거래처구분"],
    callList: ["담당자"],
    checkbox: ["미사용포함"],
    detailedSearch: {
      isUse: true,
      detailList: {
        text: ["사원이름", "대표자명"],
        select: ["select2"],
        multiSelect: ["거래처유형"],
        callList: ["자재그룹"],
        dateText: ["거래일자"],
      },
    },
  };

  // 항목보기 관련 상태 추가
  const [columnVisibility, setColumnVisibility] = useState({
    show_1: false,
    show_2: false,
    show_3: false,
    show_4: false,
  });

  // 항목 목록 정의
  const addItemList = [
    { id: "show_1", label: "수금번호" },
    { id: "show_2", label: "전표번호" },
    { id: "show_3", label: "거래처" },
    { id: "show_4", label: "담당자" },
    { id: "show_5", label: "행추가", isRow: true },
  ];

  // 토글 핸들러
  const handleShowItemChange = (field) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  // Dialog state
  const [visible, setVisible] = useState(false);

  // Detail 컴포넌트 관련 상태 추가
  const basicInfoRows = [
    [
      { label: "거래처코드", value: "0001" },
      { label: "사용여부", value: "사용" },
    ],
    [
      { label: "거래처명", value: "거래처명" },
      { label: "구분", value: "금융기관" },
    ],
    [{ label: "거래처약칭", value: "거래처약칭" }],
    [{ label: "사업자번호", value: "사업자번호" }],
  ];

  return (
    <div>
      <section className="style-guide__section">
        <h2 className="style-guide__title">🔍 검색바</h2>
        <div className="style-guide__search-group">
          <Accordion>
            <AccordionTab header="ComSearch 컴포넌트 사용법">
              <div className="p-4">
                <h4>1. 필수 Props</h4>
                <ul className="list-disc pl-4">
                  <li>
                    <code>searchCategory</code>: 검색 필드 설정 객체
                  </li>
                  <li>
                    <code>setSaveObject</code>: 검색 결과를 받을 콜백 함수
                  </li>
                </ul>

                <h4 className="mt-4">2. searchCategory 객체 구조</h4>
                <pre className="bg-gray-100 p-4 rounded mt-2">
                  {`{
pageCode: number,        // 페이지 고유 코드
text: string[],         // 텍스트 입력 필드 목록
dates: [{              // 날짜 선택 필드
  label: string,       // 필드 라벨
  startDate: string,   // 시작일 (예: "1MonthAgo")
  endDate: string,     // 종료일 (예: "today")
  labelOptions?: string[] // 라벨을 드롭다운으로 선택할 수 있는 옵션 목록
}],
dateText: string[],    // 날짜+텍스트 입력 필드
select: string[],      // 드롭다운 선택 필드
multiSelect: string[], // MultiSelect 필드 (여러 항목 선택 가능)
callList: string[],    // 검색 버튼이 있는 필드
checkbox: string[],    // 체크박스 필드
detailedSearch: {      // 상세검색 설정
  isUse: boolean,      // 상세검색 사용 여부
  detailList: {        // 상세검색 필드 목록
    text: string[],
    select: string[],
    multiSelect: string[], // 상세검색의 MultiSelect 필드
    callList: string[],
    dateText: string[]
  }
}
}`}
                </pre>

                <h4 className="mt-4">3. dates의 labelOptions 사용법</h4>
                <p>
                  날짜 필드의 라벨을 드롭다운으로 선택할 수 있게 하려면 labelOptions를 추가합니다:
                </p>
                <pre className="bg-gray-100 p-4 rounded mt-2">
                  {`// dates 설정 예시
dates: [
  {
    label: "조회기간",
    startDate: "1MonthAgo",
    endDate: "today"
  },
  {
    label: "거래일자",
    startDate: "today",
    endDate: "today",
    labelOptions: ["거래일자", "입금번호", "전표일자"] // dateName에 정의된 koName 목록
  }
]`}
                </pre>
                <ul className="list-disc pl-4 mt-2">
                  <li>labelOptions는 dateName에 정의된 koName 목록을 사용합니다.</li>
                  <li>첫 번째 항목이 기본값으로 선택됩니다.</li>
                  <li>선택된 라벨에 해당하는 EgName이 saveObject에 저장됩니다.</li>
                </ul>

                <h4 className="mt-4">4. MultiSelect 설정</h4>
                <p>MultiSelect 필드는 customMultiSelectOptions.js 파일에서 설정합니다:</p>
                <pre className="bg-gray-100 p-4 rounded mt-2">
                  {`// customMultiSelectOptions.js
export const customMultiSelectOptions = [
  {
    code: 9999,  // 페이지 코드
    selectlist: [
      {
        name: "거래처구분",    // searchCategory.multiSelect에 사용할 이름
        label: "거래처구분",   // 화면에 표시될 라벨
        placeholder: "거래처구분을 선택하세요",
        EgName: "customerType", // 실제 데이터 필드명
        data: [               // 선택 옵션 목록
          { value: "1", label: "매입처" },
          { value: "2", label: "매출처" },
          { value: "3", label: "금융기관" },
          { value: "4", label: "기타" },
        ],
      },
      // ... 다른 MultiSelect 필드 설정
    ],
  },
];`}
                </pre>

                <h4 className="mt-4">4. 주의사항</h4>
                <ul className="list-disc pl-4">
                  <li>MultiSelect 필드는 여러 항목을 동시에 선택할 수 있습니다.</li>
                  <li>
                    searchCategory.multiSelect 배열의 항목명은 customMultiSelectOptions의 name과
                    일치해야 합니다.
                  </li>
                  <li>
                    상세검색에서도 MultiSelect를 사용할 수 있으며, 동일한 방식으로 설정합니다.
                  </li>
                  <li>선택된 값은 배열 형태로 저장됩니다.</li>
                </ul>
              </div>
            </AccordionTab>
          </Accordion>

          <h3 className="mt-4">기본 검색바</h3>
          <ComSearch searchCategory={searchCategory} setSaveObject={setSearchResult} />
          <div className="mt-4">
            <h4>검색 결과:</h4>
            <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(searchResult, null, 2)}</pre>
          </div>
        </div>
      </section>
      <section className="style-guide__section">
        <h2 className="style-guide__title">💬 항목보기</h2>
        <div className="style-guide__section">
          <Accordion>
            <AccordionTab header="항목보기 컴포넌트 사용법">
              <div className="p-4">
                <h4>1. 필수 상태값</h4>
                <ul className="list-disc pl-4">
                  <li>
                    <code>columnVisibility</code>: 각 항목의 표시 여부를 관리하는 상태 객체
                    <pre className="bg-gray-100 p-2 rounded mt-1">
                      {`const [columnVisibility, setColumnVisibility] = useState({
  show_1: false,
  show_2: false,
  ...
});`}
                    </pre>
                  </li>
                  <li>
                    <code>addItemList</code>: 표시할 항목 목록 배열
                    <pre className="bg-gray-100 p-2 rounded mt-1">
                      {`const addItemList = [
  { id: "show_1", label: "수금번호" },
  { id: "show_2", label: "전표번호" },
  ...
];`}
                    </pre>
                  </li>
                </ul>

                <h4 className="mt-4">2. 토글 핸들러</h4>
                <pre className="bg-gray-100 p-2 rounded mt-1">
                  {`const handleShowItemChange = (field) => {
  setColumnVisibility((prev) => ({
    ...prev, 
    [field]: !prev[field]
  }));
};`}
                </pre>
                <h4 className="mt-4">3. 검색바 하단에 표시할 경우</h4>
                <pre className="bg-gray-100 p-2 rounded mt-1">
                  {`<div class="common-add-item-box">
    <ComSearch searchCategory={searchCategory} setSaveObject={setSaveObject} />
    <div className="common-add-item">...</div>
</div>`}
                </pre>
              </div>
            </AccordionTab>
          </Accordion>
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
        </div>
      </section>
      <section className="style-guide__section">
        <h2 className="style-guide__title">💬 Dialog</h2>
        <Accordion>
          <AccordionTab header="Dialog 컴포넌트 사용법">
            <div className="p-4">
              <h4>1. Dialog 기본 구조</h4>
              <ul className="list-disc pl-4">
                <li>최상위 태그에 페이지명을 className으로 지정</li>
                <li>내용을 Dialog-container로 감싸기</li>
                <li>하단 버튼은 Dialog__btns 클래스 안에 배치</li>
              </ul>

              <h4 className="mt-4">2. 기본 코드 구조</h4>
              <pre className="bg-gray-100 p-4 rounded mt-2">
                {`<Dialog header="다이얼로그 제목" visible={visible} onHide={onCloseFn}>
  <div className="페이지명 Dialog-container">
    {/* 다이얼로그 내용 */}
    <div className="Dialog__btns">
      <Button label="취소" severity="secondary" onClick={onCloseFn} />
      <Button label="저장" onClick={saveData} />
    </div>
  </div>
</Dialog>`}
              </pre>
            </div>
          </AccordionTab>
        </Accordion>
        <div className="style-guide__dialog-group">
          <Button label="다이얼로그 열기" onClick={() => setVisible(true)} />
          <Dialog
            header="다이얼로그 제목"
            visible={visible}
            style={{ width: "50vw" }}
            onHide={() => setVisible(false)}
          >
            <div className="페이지명 Dialog-container">
              <div style={{ padding: "20px", height: "800px", background: "#eee" }}>
                샘플 컨텐츠
              </div>
              <div className="Dialog__btns">
                <Button label="취소" severity="secondary"></Button>
                <Button label="저장"></Button>
              </div>
            </div>
          </Dialog>
        </div>
      </section>
      <section className="style-guide__section">
        <h2 className="style-guide__title">🔘 절대 위치 버튼</h2>
        <Accordion>
          <AccordionTab header="절대 위치 버튼 사용법">
            <div className="p-4">
              <h4>1. 필수 클래스</h4>
              <ul className="list-disc pl-4">
                <li>
                  <code>has-abs-btns</code>: 페이지 최상위 컨테이너에 추가
                </li>
                <li>
                  <code>abs_btns</code>: 버튼들을 감싸는 컨테이너에 추가
                </li>
              </ul>

              <h4 className="mt-4">2. 기본 구조</h4>
              <pre className="bg-gray-100 p-4 rounded mt-2">
                {`<div className="페이지명 has-abs-btns">
  {/* 페이지 컨텐츠 */}
  
  <div className="abs_btns">
    <Button label="엑셀" icon="pi pi-download" />
    <Button label="출력" icon="pi pi-print" />
  </div>
</div>`}
              </pre>

              <h4 className="mt-4">3. 주의사항</h4>
              <ul className="list-disc pl-4">
                <li>페이지 최상위 컨테이너에 반드시 has-abs-btns 클래스를 추가해야 합니다.</li>
                <li>버튼들은 abs_btns 클래스로 감싸야 합니다.</li>
                <li>버튼들은 기본적으로 우측 하단에 고정됩니다.</li>
              </ul>
            </div>
          </AccordionTab>
        </Accordion>

        <div className="style-guide__section">
          <div
            className="has-abs-btns"
            style={{ height: "300px", position: "relative", border: "1px solid #ddd" }}
          >
            <div style={{ padding: "20px" }}>
              <p>페이지 컨텐츠가 들어가는 영역입니다.</p>
              <p>스크롤이 생길 경우에도 버튼은 항상 우측 하단에 고정됩니다.</p>
            </div>
            <div className="abs_btns" style={{ position: "absolute", bottom: "0", right: "0" }}>
              <Button label="엑셀" icon="pi pi-download" />
              <Button label="출력" icon="pi pi-print" />
            </div>
          </div>
        </div>
      </section>
      <section className="style-guide__section">
        <h2 className="style-guide__title">📑 Tab</h2>
        <div className="style-guide__tab-group">
          <h3 className="mt-4">기본 탭</h3>
          <TabView>
            <TabPanel header="탭 1">
              <div className="p-4">
                <h3>첫 번째 탭 내용</h3>
                <p>여기에 탭 1의 내용이 들어갑니다.</p>
              </div>
            </TabPanel>
            <TabPanel header="탭 2">
              <div className="p-4">
                <h3>두 번째 탭 내용</h3>
                <p>여기에 탭 2의 내용이 들어갑니다.</p>
              </div>
            </TabPanel>
            <TabPanel header="탭 3">
              <div className="p-4">
                <h3>세 번째 탭 내용</h3>
                <p>여기에 탭 3의 내용이 들어갑니다.</p>
              </div>
            </TabPanel>
          </TabView>
        </div>
        <h3 className="mt-4">탭 스타일 2</h3>
        <div className="style-guide__tab-group TabStyle2">
          <TabView>
            <TabPanel header="탭 1">
              <div className="p-4">
                <h3>첫 번째 탭 내용</h3>
                <p>여기에 탭 1의 내용이 들어갑니다.</p>
              </div>
            </TabPanel>
            <TabPanel header="탭 2">
              <div className="p-4">
                <h3>두 번째 탭 내용</h3>
                <p>여기에 탭 2의 내용이 들어갑니다.</p>
              </div>
            </TabPanel>
            <TabPanel header="탭 3">
              <div className="p-4">
                <h3>세 번째 탭 내용</h3>
                <p>여기에 탭 3의 내용이 들어갑니다.</p>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </section>
      <section className="style-guide__section">
        <h2 className="style-guide__title">📋 Detail</h2>
        <Accordion>
          <AccordionTab header="Detail 컴포넌트 사용법">
            <div className="p-4">
              <h4 className="mt-4">1. 주의사항</h4>
              <ul className="list-disc pl-4">
                <li>기본정보는 con-header와 함께 첫 번째 con-body에 표시됩니다.</li>
                <li>추가 섹션은 Divider로 구분되며, 각각의 con-body를 가집니다.</li>
                <li>각 행은 detail-row 클래스를 사용하며, label과 value로 구성됩니다.</li>
                <li>renderRow 함수를 통해 일관된 행 렌더링을 보장합니다.</li>
                <li>버튼은 con-header__btns 클래스 안에 배치합니다.</li>
              </ul>
            </div>
          </AccordionTab>
        </Accordion>

        <div className="style-guide__detail-group">
          <section className="detail">
            <div className="con-header">
              <h4 className="con-header__title">기본정보</h4>
              <div className="con-header__btns">
                <Button label="수정" severity="secondary" />
              </div>
            </div>
            <div className="con-body">{basicInfoRows.map((row, idx) => renderRow(row, idx))}</div>
          </section>
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__title">📋 FormList</h2>
        <Accordion>
          <AccordionTab header="FormList 컴포넌트 사용법">
            <div className="p-4">
              <h4 className="mt-4">1. 주의사항</h4>
              <ul className="list-disc pl-4">
                <li>form-list 클래스는 폼 컨테이너로 사용됩니다.</li>
                <li>form__input 클래스는 각 입력 필드의 컨테이너입니다.</li>
                <li>label과 input은 form__input 안에 배치합니다.</li>
                <li>필수 입력 필드는 label에 * 표시를 추가합니다.</li>
                <li>onChange 핸들러는 필드명을 인자로 받아 해당 필드만 업데이트합니다.</li>
              </ul>
            </div>
          </AccordionTab>
        </Accordion>

        <div className="style-guide__detail-group">
          <div className="form-list">
            <div className="form__input">
              <label htmlFor="groupPurpose">그룹용도</label>
              <InputText
                id="groupPurpose"
                value={form.그룹용도}
                onChange={onChange("그룹용도")}
                placeholder="그룹용도"
              />
            </div>
            <div className="form__input">
              <label htmlFor="useYn">사용여부*</label>
              <Dropdown
                id="useYn"
                value={form.사용여부}
                options={USE_STATUS_OPTIONS}
                onChange={onChange("사용여부")}
                placeholder="사용여부 선택"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StyleGuideTab2;
