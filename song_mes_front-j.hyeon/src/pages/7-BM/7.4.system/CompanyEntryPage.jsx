// 7.4.1.회사등록	A0010	companyEntry	BM-7401

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

const CompanyEntryPage = () => {
  const navigate = useNavigate();
  const showToast = useToastStore.getState().showToast;
  const [data, setData] = useState();
  const [selectedRow, setSelectedRow] = useState(null);

  const basicInfoRows = [
    [
      { label: "회사코드", value: "0001" },
      { label: "더존전송 회사ID", value: "ID" },
    ],
    [
      { label: "회사명", value: selectedRow?.name || "회사명" },
      { label: "사용여부", value: "사용" },
    ],
    [
      { label: "관리 회사명", value: "관리 회사명" },
      { label: "구분", value: "일반" },
    ],
    [{ label: "대표자", value: "홍길동" }],
    [{ label: "주민번호", value: "123456-1234567" }],
    [
      { label: "사업자번호", value: "123-45-67890" },
      { label: "법인번호", value: "123456-1234567" },
    ],
    [{ label: "우편번호", value: "123-123" }],

    [
      {
        label: "본사주소",
        value: ["서울특별시 강남구 테헤란로 123", " 삼성빌딩 15층"],
        isAddress: true,
      },
    ],
    [
      { label: "전화번호", value: "02-1234-5678" },
      { label: "팩스번호", value: "02-1234-5679" },
    ],
    [
      { label: "업종", value: "소프트웨어 개발" },
      { label: "업태", value: "서비스업" },
    ],
    [{ label: "홈페이지", value: "www.company.co.kr" }],
  ];

  let sections = [
    {
      title: "대표자 관련 사항",
      rows: [
        [{ label: "우편번호", value: "123-123" }],
        [
          {
            label: "회사주소",
            value: ["상세주소", " 회사상세주소"],
            isAddress: true,
          },
        ],
        [{ label: "전화번호", value: "전화번호" }],
      ],
    },
    {
      title: "회계 관련 사항",
      rows: [
        [
          { label: "개업일자", value: "2025-01-01" },
          { label: "폐업일자", value: "없음" },
        ],

        [
          { label: "회계마감", value: "12월" },
          { label: "회계년도", value: "2025" },
        ],
      ],
    },
    {
      title: "영문 회사명 사항",
      rows: [
        [
          { label: "영문 회사명", value: "COMPANY CO., LTD." },
          { label: "영문 대표자", value: "KIM YOUNG HO" },
        ],

        [
          {
            label: "영문주소",
            value: ["15F, SAMSUNG BLDG., 123 TEHERAN-RO, GANGNAM-GU, SEOUL, KOREA"],
            isAddress: true,
          },
        ],
      ],
    },
  ];

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
    navigate("/CompanyEntry/new");
  };
  // TODO
  const editBtn = () => {
    navigate(`/CompanyEntry/${selectedRow?.id}/edit`);
  };
  return (
    <div id="CompanyEntryPage">
      <div className="CompanyEntry-con content-box">
        <section className="datatable">
          <div className="datatable__header">
            <h3>회사 목록</h3>
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
            <Column field="name" header="회사명"></Column>
            <Column field="type" header="구분"></Column>
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

export default CompanyEntryPage;
