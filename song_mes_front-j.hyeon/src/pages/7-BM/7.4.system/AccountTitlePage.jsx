// 7.4.6.계정과목등록	A0035	accountTitle	BM-7406
import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { renderRow } from "@/utils/common";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Tree } from "primereact/tree";
import React, { useState } from "react";

const getSelectedNode = (nodes, key) => {
  for (const node of nodes) {
    if (node.key === key) return node;
    if (node.children) {
      const found = getSelectedNode(node.children, key);
      if (found) return found;
    }
  }
  return null;
};

const AccountTitlePage = () => {
  const [selectedKey, setSelectedKey] = useState(null);
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);
  // PanelMenu
  const data = [
    {
      key: "0",
      label: "Documents",
      data: "Documents Folder",
      icon: "pi pi-fw pi-folder",
      children: [
        {
          key: "0-0",
          label: "Work",
          data: "Work Folder",
          icon: "pi pi-fw pi-folder",
          children: [
            {
              key: "0-0-0",
              label: "Expenses.doc",
              icon: "pi pi-fw pi-file",
              data: "Expenses Document",
            },
            {
              key: "0-0-1",
              label: "Resume.doc",
              icon: "pi pi-fw pi-file",
              data: "Resume Document",
            },
          ],
        },
        {
          key: "0-1",
          label: "Home",
          data: "Home Folder",
          icon: "pi pi-fw pi-folder",
          children: [
            {
              key: "0-1-0",
              label: "Invoices.txt",
              icon: "pi pi-fw pi-file",
              data: "Invoices for this month",
            },
          ],
        },
      ],
    },
  ];

  const basicInfoRows = [
    [
      { label: "계정과목", value: "1001" },
      { label: "계정과목명", value: "현금" },
    ],
    [
      { label: "그룹코드", value: "자산" },
      { label: "정렬순서", value: "1" },
    ],
    [
      { label: "계정구분", value: "재무상태표" },
      { label: "차대구분", value: "차변" },
    ],
    [{ label: "관련계정", value: "보통예금" }],
    [{ label: "입력구분", value: "자동" }],
    [{ label: "증빙필수 입력여부", value: "필수" }],
    [{ label: "연동항목", value: "현금" }],
    [{ label: "현금흐름표과목", value: "영업활동" }],
    [{ label: "예산통제", value: "통제" }],
    [{ label: "과목명(부)", value: "현금및현금성자산" }],
    [{ label: "출력", value: "출력" }],
    [{ label: "출력(부)", value: "출력" }],
    [{ label: "IFRS", value: "현금및현금성자산" }],
    [{ label: "IFRS(부)", value: "현금및현금성자산" }],
  ];

  const editBtn = () => {
    openDialog("AccountTitleForm7406", {
      data: selectedNode,
    });
  };
  const deleteBtn = (selectedNode) => {
    console.log("deleteBtn", selectedNode);
    confirmDialog({
      message: `계정과목을 정말로 삭제하시겠습니까?`,
      header: "계정과목 삭제",
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
      summary: "계정과목 삭제",
      detail: "계정과목이 삭제되었습니다.",
      life: 3000,
    });
  };

  const selectedNode = getSelectedNode(data, selectedKey);

  return (
    <div id="AccountTitlePage">
      <div className="AccountTitle-con content-box">
        <div className="form-con">
          <div className="form-con__header">
            <p>선택양식</p>
            <span>2007 NEW 회계기준 적용</span>
          </div>
          <Tree
            value={data}
            selectionMode="single"
            selectionKeys={selectedKey}
            onSelectionChange={(e) => setSelectedKey(e.value)}
          />
        </div>

        {/* 상세내용 */}
        <section className="detail">
          <div className="con-header">
            <h4 className="con-header__title">기본정보</h4>
            <div className="con-header__btns">
              <Button
                label="수정"
                severity="secondary"
                onClick={editBtn}
                disabled={!selectedNode || selectedNode.children}
              />
              <Button
                label="삭제"
                severity="danger"
                onClick={() => deleteBtn(selectedNode)}
                disabled={!selectedNode || selectedNode.children}
              />
            </div>
          </div>

          <div className="con-body">
            {selectedNode && !selectedNode.children ? (
              basicInfoRows.map((row, idx) => renderRow(row, idx))
            ) : (
              <div>문서를 선택하세요.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AccountTitlePage;
