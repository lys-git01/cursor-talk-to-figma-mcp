// 7.3.2.금융거래처등록	A0110	financeClient	BM-7302

import ComSearch from "@/components/ComSearch";
import useToastStore from "@/store/toastStore";
import { renderRow } from "@/utils/common";
import { faker } from "@faker-js/faker";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TYPES = ["금융기관", "정기예금", "정기적금", "카드사", "신용카드"];

const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    id: (1000 + index).toString(),
    code: faker.string.alphanumeric(10).toLowerCase(),
    name: `Sample Name ${index + 1}`,
    type: TYPES[Math.floor(Math.random() * TYPES.length)],
  }));
};

const sampleList = generateSampleList(30);

const FinanceClientPage = () => {
  const navigate = useNavigate();
  const [saveObject, setSaveObject] = useState({}); // 검색용
  const showToast = useToastStore.getState().showToast;
  const [data, setData] = useState();
  const [selectedRow, setSelectedRow] = useState(null);

  const basicInfoRows = [
    [
      { label: "거래처코드", value: "0001" },
      { label: "사용여부", value: "사용" },
    ],
    [
      { label: "거래처명", value: selectedRow?.name || "거래처명" },
      { label: "구분", value: "금융기관" },
    ],
    [{ label: "거래처약칭", value: "거래처약칭" }],
    [
      { label: "사업자번호", value: "사업자번호" },
      selectedRow?.type === "신용카드" && { label: "주민번호", value: "주민번호" },
    ].filter(Boolean),
  ];

  let sections = [
    {
      title: "연락처정보",
      rows: [
        [{ label: "우편번호", value: "123-123" }],
        [
          {
            label: "회사주소",
            value: ["상세주소", " 회사상세주소"],
            isAddress: true,
          },
        ],
        [
          { label: "전화번호", value: "전화번호" },
          { label: "팩스번호", value: "팩스번호" },
        ],
        [{ label: "홈페이지", value: "홈페이지" }],
      ],
    },
  ];
  switch (selectedRow?.type) {
    case "금융기관":
      sections = [
        {
          title: "금융 정보",
          rows: [
            [
              { label: "금융기관", value: "금융기관" },
              { label: "월 불입액", value: "0" },
            ],
            [
              { label: "계좌번호", value: "계좌번호" },
              { label: "결제일", value: "결제일" },
            ],
            [
              { label: "예금명", value: "예금명" },
              { label: "해지일", value: "해지일" },
            ],
            [
              { label: "계좌계설점", value: "계좌계설점" },
              { label: "계좌계설일", value: "계좌계설일" },
            ],
            [{ label: "당좌한도액", value: "당좌한도액" }],
            [{ label: "예금종류", value: "예금종류" }],
            [{ label: "이자율", value: "이자율" }],
          ],
        },
        ...sections,
      ];
      break;
    case "정기예금":
      sections = [
        {
          title: "금융 정보",
          rows: [
            [
              { label: "금융기관", value: "금융기관" },
              { label: "월이자수입", value: "0" },
            ],
            [
              { label: "계좌번호", value: "계좌번호" },
              { label: "이자이체일", value: "이자이체일" },
            ],
            [
              { label: "예금명", value: "예금명" },
              { label: "계약기간", value: "계약기간" },
            ],
            [
              { label: "계좌계설점", value: "계좌계설점" },
              { label: "만기지급일", value: "만기지급일" },
            ],
            [{ label: "금액", value: "금액" }],
            [{ label: "예금종류", value: "예금종류" }],
            [{ label: "이자율", value: "이자율" }],
          ],
        },
        ...sections,
      ];
      break;
    case "정기적금":
      sections = [
        {
          title: "금융 정보",
          rows: [
            [
              { label: "금융기관", value: "금융기관" },
              { label: "매회불입액", value: "0" },
            ],
            [
              { label: "계좌번호", value: "계좌번호" },
              { label: "매회납입일", value: "매회납입일" },
            ],
            [
              { label: "적금명", value: "적금명" },
              { label: "계약기간", value: "계약기간" },
            ],
            [
              { label: "계좌계설점", value: "계좌계설점" },
              { label: "만기지급일", value: "만기지급일" },
            ],
            [{ label: "계약금액", value: "계약금액" }],
            [{ label: "적금종류", value: "적금종류" }],
            [{ label: "이자율", value: "이자율" }],
          ],
        },
        ...sections,
      ];
      break;
    case "카드사":
      sections = [
        {
          title: "금융 정보",
          rows: [
            [
              { label: "금융기관", value: "금융기관" },
              { label: "월 불입액", value: "0" },
            ],
            [{ label: "결제일", value: "결제일" }],
            [
              { label: "입금계좌", value: "입금계좌" },
              { label: "계약기간", value: "계약기간" },
            ],
            [
              { label: "계좌계설점", value: "계좌계설점" },
              { label: "만기지급일", value: "만기지급일" },
            ],
            [{ label: "계약금액", value: "계약금액" }],
            [{ label: "가맹점번호", value: "가맹점번호" }],
            [{ label: "수수료율", value: "수수료율" }],
          ],
        },
        ...sections,
      ];
      break;
    case "신용카드":
      sections = [
        {
          title: "금융 정보",
          rows: [
            [
              { label: "신용카드사", value: "신용카드사" },
              { label: "월 불입액", value: "0" },
            ],
            [
              { label: "카드번호", value: "카드번호" },
              { label: "결제일", value: "0" },
            ],
            [
              { label: "결제계좌", value: "결제계좌" },
              { label: "월 한도액", value: "월 한도액" },
            ],
            [
              { label: "계좌계설점", value: "계좌계설점" },
              { label: "만기지급일", value: "만기지급일" },
            ],
            [
              { label: "카드구분", value: "카드구분" },
              { label: "카드회원명", value: "카드회원명" },
            ],
            [
              { label: "수수료율", value: "수수료율" },
              { label: "유효기간", value: "유효기간" },
            ],
          ],
        },
        ...sections,
      ];
      break;

    default:
      break;
  }
  const searchCategory = {
    pageCode: 7302,
    text: ["거래처명", "카드회원명"],
    select: ["select1", "select2"],
    callList: [],
    detailedSearch: {
      isUse: false,
    },
  };

  useEffect(() => {
    // TODO 백엔드 호출
    setData(sampleList);
    setSelectedRow(sampleList[0]);
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
    showToast({
      severity: "info",
      summary: "백엔드 api 데이터 호출",
      detail: `saveObject: ${JSON.stringify(saveObject)}`,
    });
  }, [saveObject]);

  // TODO
  const deleteBtn = () => {
    confirmDialog({
      message: `${selectedRow.name}을(를) 정말로 삭제하시겠습니까?`,
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
    navigate("/FinanceClient/new");
  };
  // TODO
  const editBtn = () => {
    navigate(`/FinanceClient/${selectedRow?.id}/edit`);
  };
  return (
    <div id="FinanceClientPage">
      <ComSearch searchCategory={searchCategory} setSaveObject={setSaveObject} />
      <div className="FinanceClient-con content-box">
        <section className="datatable">
          <div className="datatable__header">
            <h3>금융거래처 목록</h3>
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
            value={data}
            selectionMode="single"
            selection={selectedRow}
            onSelectionChange={(e) => setSelectedRow(e.value)}
            onRowSelect={onRowSelect}
            metaKeySelection={true}
            dataKey="code"
            showGridlines
            scrollable
            scrollHeight="flex"
            resizableColumns
          >
            <Column field="code" header="코드"></Column>
            <Column field="name" header="금융거래처"></Column>
            <Column field="type" header="유형"></Column>
          </DataTable>
        </section>
        {/* 상세내용 */}
        <section className="detail">
          <div className="con-header">
            <h4 className="con-header__title">기본정보</h4>
            <div className="con-header__btns">
              <Button label="수정" severity="secondary" onClick={editBtn} />
            </div>
          </div>

          <div className="con-body">{basicInfoRows.map((row, idx) => renderRow(row, idx))}</div>

          {sections.map((sec, sidx) => (
            <Fragment key={sidx}>
              <Divider align="left">
                <b>{sec.title}</b>
              </Divider>
              <div className="con-body">{sec.rows.map((row, ridx) => renderRow(row, ridx))}</div>
            </Fragment>
          ))}
        </section>
      </div>
    </div>
  );
};

export default FinanceClientPage;
