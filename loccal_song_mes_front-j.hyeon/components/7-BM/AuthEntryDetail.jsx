import useDialogStore from "@/store/dialogStore";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";

const sampleMenuList = [
  {
    id: 1,
    mainMenu: "총무부",
    depth2: {
      depth2Name: "작업사고",
      depth2List: {
        activeList: [
          {
            title: "사고등록(경위서)",
            path: "incidentEntry",
            view: true,
            input: true,
            edit: true,
            delete: false,
            output: true,
            special: 1,
            remarks: "사고 관련 경위서 등록 권한",
          },
          {
            title: "사고현황(개별)",
            path: "incidentIndiv",
            view: true,
            input: false,
            edit: false,
            delete: false,
            output: true,
            special: 0,
            remarks: "개별 사고 현황 조회",
          },
        ],
        depth3: {
          depth3Name: "근태관리",
          activeList: [
            {
              title: "근태현황",
              path: "attendance",
              view: true,
              input: false,
              edit: false,
              delete: false,
              output: true,
              special: 0,
              remarks: "근태 현황 조회",
            },
            {
              title: "근무시간(집계)",
              path: "workSummary",
              view: true,
              input: false,
              edit: false,
              delete: false,
              output: true,
              special: 1,
              remarks: "근무시간 집계 조회",
            },
          ],
        },
      },
    },
  },
  {
    id: 2,
    mainMenu: "영업부",
    depth2: {
      depth2Name: "견적서",
      depth2List: {
        activeList: [
          {
            title: "견적서입력",
            path: "quoteEntry",
            view: true,
            input: true,
            edit: true,
            delete: true,
            output: true,
            special: 2,
            remarks: "견적서 작성 권한",
          },
          {
            title: "견적서현황",
            path: "quoteStatus",
            view: true,
            input: false,
            edit: false,
            delete: false,
            output: true,
            special: 0,
            remarks: "견적서 조회",
          },
        ],
        depth3: {
          depth3Name: "수금관리",
          activeList: [
            {
              title: "수금처리",
              path: "paymentProcess",
              view: true,
              input: true,
              edit: true,
              delete: false,
              output: true,
              special: 2,
              remarks: "수금 처리 권한",
            },
            {
              title: "채권현황",
              path: "claimStatus",
              view: true,
              input: false,
              edit: false,
              delete: false,
              output: true,
              special: 1,
              remarks: "채권 현황 조회",
            },
          ],
        },
      },
    },
  },
  {
    id: 3,
    mainMenu: "생산관리부",
    depth2: {
      depth2Name: "수주서",
      depth2List: {
        activeList: [
          {
            title: "수주서등록",
            path: "orderEntry",
            view: true,
            input: true,
            edit: true,
            delete: false,
            output: true,
            special: 2,
            remarks: "수주서 등록 권한",
          },
          {
            title: "수주서조회",
            path: "orderLookup",
            view: true,
            input: false,
            edit: false,
            delete: false,
            output: true,
            special: 0,
            remarks: "수주서 조회",
          },
        ],
        depth3: {
          depth3Name: "생산관리",
          activeList: [
            {
              title: "스케쥴관리",
              path: "scheduleMgmt",
              view: true,
              input: true,
              edit: true,
              delete: false,
              output: true,
              special: 2,
              remarks: "생산 스케줄 관리",
            },
            {
              title: "공정현황",
              path: "processStatus",
              view: true,
              input: false,
              edit: false,
              delete: false,
              output: true,
              special: 1,
              remarks: "공정 현황 조회",
            },
          ],
        },
      },
    },
  },
  {
    id: 4,
    mainMenu: "자재입출고",
    depth2: {
      depth2Name: "발주관련",
      depth2List: {
        activeList: [
          {
            title: "발주서등록",
            path: "orderSheetEntry",
            view: true,
            input: true,
            edit: true,
            delete: false,
            output: true,
            special: 2,
            remarks: "발주서 등록 권한",
          },
          {
            title: "발주현황",
            path: "orderStatus",
            view: true,
            input: false,
            edit: false,
            delete: false,
            output: true,
            special: 0,
            remarks: "발주 현황 조회",
          },
        ],
        depth3: {
          depth3Name: "입고관련",
          activeList: [
            {
              title: "입고처리",
              path: "receiptProcess",
              view: true,
              input: true,
              edit: true,
              delete: false,
              output: true,
              special: 2,
              remarks: "입고 처리 권한",
            },
            {
              title: "입고현황",
              path: "receiptStatus",
              view: true,
              input: false,
              edit: false,
              delete: false,
              output: true,
              special: 1,
              remarks: "입고 현황 조회",
            },
          ],
        },
      },
    },
  },
  {
    id: 5,
    mainMenu: "경리부",
    depth2: {
      depth2Name: "회계관리",
      depth2List: {
        activeList: [
          {
            title: "전표관리",
            path: "voucherMgmt",
            view: true,
            input: true,
            edit: true,
            delete: false,
            output: true,
            special: 2,
            remarks: "회계 전표 관리",
          },
          {
            title: "일일자금현황",
            path: "dailyCashStatus",
            view: true,
            input: false,
            edit: false,
            delete: false,
            output: true,
            special: 1,
            remarks: "자금 현황 조회",
          },
        ],
      },
    },
  },
  {
    id: 6,
    mainMenu: "기초정보관리",
    depth2: {
      depth2Name: "공통코드",
      depth2List: {
        activeList: [
          {
            title: "사용권한등록",
            path: "authEntry",
            view: true,
            input: true,
            edit: true,
            delete: true,
            output: true,
            special: 2,
            remarks: "시스템 권한 관리",
          },
          {
            title: "사용자등록",
            path: "userEntry",
            view: true,
            input: true,
            edit: true,
            delete: true,
            output: true,
            special: 2,
            remarks: "사용자 계정 관리",
          },
        ],
        depth3: {
          depth3Name: "시스템관리",
          activeList: [
            {
              title: "회사등록",
              path: "companyEntry",
              view: true,
              input: true,
              edit: true,
              delete: false,
              output: true,
              special: 2,
              remarks: "회사 정보 관리",
            },
            {
              title: "메뉴관리",
              path: "menuMgmt",
              view: true,
              input: true,
              edit: true,
              delete: true,
              output: true,
              special: 2,
              remarks: "시스템 메뉴 관리",
            },
          ],
        },
      },
    },
  },
];

const AuthEntryDetail = ({ selectedRow, onEditingChange }) => {
  const [menuList, setMenuList] = useState(sampleMenuList);
  const [selectedMenu, setSelectedMenu] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState([]);
  const openDialog = useDialogStore((s) => s.openDialog);

  // isEditing 상태가 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    onEditingChange?.(isEditing);
  }, [isEditing, onEditingChange]);

  // 데이터 수정 핸들러
  const handleDataChange = (rowData, field, value) => {
    const newData = [...editedData];
    const index = newData.findIndex((item) => item.title === rowData.title);
    if (index !== -1) {
      newData[index] = { ...newData[index], [field]: value };
      setEditedData(newData);
    }
  };

  // 체크박스 컬럼 생성 함수
  const createCheckboxColumn = (field, header) => ({
    field,
    header,
    body: (rowData) =>
      isEditing ? (
        <div>
          <Checkbox
            checked={rowData[field]}
            onChange={(e) => handleDataChange(rowData, field, e.target.checked)}
          />
        </div>
      ) : rowData[field] ? (
        <i className="pi pi-check"></i>
      ) : (
        ""
      ),
  });

  // 메뉴 데이터 평탄화 함수
  const flattenMenuList = (menuData) => {
    return menuData.flatMap((menu) => {
      const depth2List = menu.depth2?.depth2List?.activeList || [];
      const depth3List = menu.depth2?.depth2List?.depth3?.activeList || [];

      return [
        ...depth2List.map((item) => ({
          mainMenu: menu.mainMenu,
          depth2Name: menu.depth2.depth2Name,
          depth3Name: "",
          ...item,
        })),
        ...depth3List.map((item) => ({
          mainMenu: menu.mainMenu,
          depth2Name: menu.depth2.depth2Name,
          depth3Name: menu.depth2.depth2List.depth3.depth3Name,
          ...item,
        })),
      ];
    });
  };

  useEffect(() => {
    // TODO 백엔드 호출
    setMenuList(sampleMenuList);
    const flattened = flattenMenuList(sampleMenuList);
    setEditedData(flattened);
    if (flattened.length > 0) {
      setSelectedMenu(flattened[0]);
    }
  }, []);

  const onUpdateAuth = () => {
    setIsEditing(true);
  };

  const onSave = () => {
    // editedData를 원본 구조로 변환하여 저장
    const newMenuList = [...menuList];

    editedData.forEach((editedItem) => {
      const menuIndex = newMenuList.findIndex((m) => m.mainMenu === editedItem.mainMenu);
      if (menuIndex === -1) return;

      const menu = newMenuList[menuIndex];
      const depth2 = menu.depth2;
      if (!depth2) return;

      if (editedItem.depth3Name) {
        // depth3 항목 수정
        const depth3List = depth2.depth2List.depth3?.activeList;
        if (!depth3List) return;

        const itemIndex = depth3List.findIndex((item) => item.title === editedItem.title);
        if (itemIndex !== -1) {
          depth3List[itemIndex] = {
            title: editedItem.title,
            path: editedItem.path,
            view: editedItem.view,
            input: editedItem.input,
            edit: editedItem.edit,
            delete: editedItem.delete,
            output: editedItem.output,
            special: editedItem.special,
            remarks: editedItem.remarks,
          };
        }
      } else {
        // depth2 항목 수정
        const depth2List = depth2.depth2List.activeList;
        const itemIndex = depth2List.findIndex((item) => item.title === editedItem.title);
        if (itemIndex !== -1) {
          depth2List[itemIndex] = {
            title: editedItem.title,
            path: editedItem.path,
            view: editedItem.view,
            input: editedItem.input,
            edit: editedItem.edit,
            delete: editedItem.delete,
            output: editedItem.output,
            special: editedItem.special,
            remarks: editedItem.remarks,
          };
        }
      }
    });

    setMenuList(newMenuList);
    setIsEditing(false);
  };

  const onCancel = () => {
    // 편집 취소 시 원본 데이터로 복구
    setEditedData(flattenMenuList(menuList));
    setIsEditing(false);
  };

  const onRowEditComplete = (e) => {
    let { newData, index } = e;
    let _editedData = [...editedData];
    _editedData[index] = newData;
    setEditedData(_editedData);
  };

  // 체크박스 컬럼 정의
  const checkboxColumns = [
    { field: "view", header: "조회" },
    { field: "input", header: "입력" },
    { field: "edit", header: "수정" },
    { field: "delete", header: "삭제" },
    { field: "output", header: "출력" },
  ];
  const onDelete = () => {
    confirmDialog({
      message: `${selectedRow?.name}님의 모든 권한을 삭제하시겠습니까?`,
      header: "메뉴권한 삭제",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => {
        // TODO 백엔드 호출
        console.log("삭제");
      },
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };
  const onCopyMenu = () => {
    openDialog("CopyMenu7101", {
      user: selectedRow,
    });
  };
  const onUpdateRemark = () => {
    // 모든 메뉴의 remarks 목록 생성
    const getAllRemarks = (menuData) => {
      const remarksList = [];
      menuData.forEach((menu) => {
        const depth2List = menu.depth2?.depth2List?.activeList || [];
        const depth3List = menu.depth2?.depth2List?.depth3?.activeList || [];

        [...depth2List, ...depth3List].forEach((item) => {
          remarksList.push({
            path: item.path,
            remark: item.remarks,
          });
        });
      });
      return remarksList;
    };

    openDialog("UpdateRemark7101", {
      userName: selectedRow?.name,
      remarkList: getAllRemarks(menuList),
      selectedMenu: {
        path: selectedMenu.path,
        remark: selectedMenu.remarks,
      },
    });
  };
  return (
    <section className="detail">
      <div className="con-header">
        <h4 className="con-header__title">{selectedRow?.name} 메뉴</h4>
        <div className="con-header__btns">
          {!isEditing ? (
            <>
              <Button label="권한수정" severity="secondary" onClick={onUpdateAuth} />
              <Button label="비고수정" severity="secondary" onClick={onUpdateRemark} />
              <Button label="권한복사" severity="secondary" onClick={onCopyMenu} />
              <Button label="삭제" severity="danger" onClick={onDelete} />
            </>
          ) : (
            <>
              <Button label="저장" severity="success" onClick={onSave} />
              <Button label="취소" severity="secondary" onClick={onCancel} />
            </>
          )}
        </div>
      </div>
      <DataTable
        emptyMessage="데이터가 없습니다."
        value={editedData}
        selectionMode={isEditing ? null : "single"}
        selection={selectedMenu}
        onSelectionChange={(e) => setSelectedMenu(e.value)}
        showGridlines
        scrollable
        scrollHeight="calc(100vh - 300px)"
        size="small"
        metaKeySelection={true}
        editMode={isEditing ? "cell" : null}
        dataKey="title"
        onRowEditComplete={onRowEditComplete}
      >
        <Column field="mainMenu" header="메인메뉴" className="column-menu" />
        <Column field="depth2Name" header="서브메뉴1" className="column-menu" />
        <Column field="depth3Name" header="서브메뉴2" className="column-menu" />
        <Column field="title" header="실행메뉴" className="column-menu" />

        {/* 체크박스 컬럼들 */}
        {checkboxColumns
          .map((col) => ({
            ...createCheckboxColumn(col.field, col.header),
            className: "column-checkbox",
          }))
          .map((columnProps) => (
            <Column key={columnProps.field} {...columnProps} />
          ))}

        {/* 특수 컬럼 */}
        <Column
          field="special"
          header="특수"
          className="column-special"
          body={(rowData) =>
            isEditing ? (
              <div className="special__input">
                <InputNumber
                  type="number"
                  min="0"
                  max="9"
                  value={rowData.special || 0}
                  onChange={(e) => handleDataChange(rowData, "special", parseInt(e.value) || 0)}
                />
              </div>
            ) : (
              rowData.special
            )
          }
        />

        {/* 비고 컬럼 */}
        <Column
          field="remarks"
          header="비고"
          className="column-remarks"
          body={(rowData) =>
            isEditing ? (
              <InputText
                value={rowData.remarks || ""}
                onChange={(e) => handleDataChange(rowData, "remarks", e.target.value)}
              />
            ) : (
              rowData.remarks
            )
          }
        />
      </DataTable>
      {selectedMenu?.remarks && (
        <div className="con-footer">
          <p>{selectedMenu?.title} 비고</p>
          <div>{selectedMenu?.remarks}</div>
        </div>
      )}
    </section>
  );
};

export default AuthEntryDetail;
