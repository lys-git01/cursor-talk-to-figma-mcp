import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { renderRow } from "@/utils/common";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TabPanel, TabView } from "primereact/tabview";
import React, { useEffect, useState } from "react";

const USESTATUS = ["사용", "미사용"];

const generateSampleList1 = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    ID: (1000 + index).toString(),
    name: `Name${index + 1}`,
    부서코드: `부서코드${index + 1}`,
    운영관리: USESTATUS[Math.floor(Math.random() * USESTATUS.length)],
    사무실: USESTATUS[Math.floor(Math.random() * USESTATUS.length)],
    포스검색: USESTATUS[Math.floor(Math.random() * USESTATUS.length)],
    현장검색: USESTATUS[Math.floor(Math.random() * USESTATUS.length)],
  }));
};
const generateSampleList2 = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    ID: (1000 + index).toString(),
    name: `Name${index + 1}`,
    입사일: `2025-01-01`,
    퇴사일: `2025-01-01`,
    부서코드: `부서코드${index + 1}`,
  }));
};
const sampleList1 = generateSampleList1(30);
const sampleList2 = generateSampleList2(30);

const UserEntryDetail = ({ selectedRow }) => {
  const openDialog = useDialogStore((s) => s.openDialog);
  const showToast = useToastStore.getState().showToast;
  const [newUsers, setNewUsers] = useState([]);
  const [selectedNewUsers, setSelectedNewUsers] = useState([]);
  const [quitUsers, setQuitUsers] = useState([]);
  const [selectedQuitUsers, setSelectedQuitUsers] = useState([]);
  const onRowSelect = (event) => {
    showToast({
      severity: "info",
      summary: "Product Selected",
      detail: `Name: ${event.data.name}`,
      life: 3000,
    });
  };
  useEffect(() => {
    // TODO 백엔드 호출
    setNewUsers(sampleList1);
    setQuitUsers(sampleList2);
  }, []);
  const basicInfoRows = [
    [{ label: "사원코드", value: "0001" }],
    [{ label: "사원이름", value: selectedRow?.name ?? "홍길동" }],
    [{ label: "비밀번호", value: "1234" }],
    [{ label: "내선번호", value: "사용" }],
    [{ label: "운영관리", value: "사용", info: "*운영관리 프로그램 사용여부" }],
    [{ label: "사무실 검색", value: "사용", info: "*사무실 관련 검색여부" }],
    [{ label: "포스검색", value: "사용", info: "*포스에서 검색여부" }],
    [{ label: "현장검색", value: "사용", info: "*현장관련 검색여부" }],
    [{ label: "입사일", value: "2025-01-01" }],
    [{ label: "퇴사일", value: "2025-01-01" }],
    [{ label: "부서", value: "부서" }],
  ];
  const editBtn = () => {
    openDialog("AddUserEntry7104", {
      state: "수정",
      data: selectedRow,
    });
  };
  const addBtn = () => {
    if (selectedNewUsers.length === 0) {
      showToast({
        severity: "error",
        summary: "오류",
        detail: "사원을 선택해주세요.",
      });
      return;
    }
    // TODO 백엔드 호출
    selectedNewUsers.forEach((user) => {
      console.log(user);
    });
  };
  const quitBtn = () => {
    if (selectedQuitUsers.length === 0) {
      showToast({
        severity: "error",
        summary: "오류",
        detail: "사원을 선택해주세요.",
      });
      return;
    }
    // TODO 백엔드 호출
    selectedQuitUsers.forEach((user) => {
      console.log(user);
    });
  };
  return (
    <section className="detail">
      <TabView>
        <TabPanel header="기본사항">
          <div className="tab1">
            <div className="con-header">
              <h4 className="con-header__title">기본정보</h4>
              <div className="con-header__btns">
                <Button label="수정" severity="secondary" onClick={editBtn} />
              </div>
            </div>
            <div className="con-body">{basicInfoRows.map((row, idx) => renderRow(row, idx))}</div>
          </div>
        </TabPanel>
        <TabPanel header="Icube에서 추가">
          <TabView className="TabStyle2 li-w-100">
            <TabPanel header="Icube 신규입사자 불러오기">
              <div className="tab1-1">
                <DataTable
                  emptyMessage="데이터가 없습니다."
                  value={newUsers}
                  selectionMode="checkbox"
                  selection={selectedNewUsers}
                  onSelectionChange={(e) => setSelectedNewUsers(e.value)}
                  onRowSelect={onRowSelect}
                  metaKeySelection={true}
                  dataKey="ID"
                  showGridlines
                  scrollable
                  size="small"
                  scrollHeight="300px"
                  // virtualScrollerOptions={{ itemSize: 43 }}
                  // resizableColumns
                >
                  <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                  <Column field="ID" header="ID"></Column>
                  <Column field="name" header="성명"></Column>
                  <Column field="부서코드" header="부서코드"></Column>
                  <Column field="운영관리" header="운영관리"></Column>
                  <Column field="사무실" header="사무실"></Column>
                  <Column field="포스검색" header="포스검색"></Column>
                  <Column field="현장검색" header="현장검색"></Column>
                </DataTable>
                <div className="tab1-1__btn">
                  <Button label="사원추가" onClick={addBtn} />
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Icube 신규퇴사자 불러오기">
              <div className="tab1-2">
                <DataTable
                  emptyMessage="데이터가 없습니다."
                  value={quitUsers}
                  selectionMode="checkbox"
                  selection={selectedQuitUsers}
                  onSelectionChange={(e) => setSelectedQuitUsers(e.value)}
                  onRowSelect={onRowSelect}
                  metaKeySelection={true}
                  dataKey="ID"
                  showGridlines
                  scrollable
                  size="small"
                  scrollHeight="300px"
                  // virtualScrollerOptions={{ itemSize: 43 }}
                  // resizableColumns
                >
                  <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                  <Column field="ID" header="ID"></Column>
                  <Column field="name" header="성명"></Column>
                  <Column field="입사일" header="입사일"></Column>
                  <Column field="퇴사일" header="퇴사일"></Column>
                  <Column field="부서코드" header="부서코드"></Column>
                </DataTable>
                <div className="tab1-1__btn">
                  <Button label="퇴사일 변경" onClick={quitBtn} />
                </div>
              </div>
            </TabPanel>
          </TabView>
        </TabPanel>
      </TabView>
    </section>
  );
};

export default UserEntryDetail;
