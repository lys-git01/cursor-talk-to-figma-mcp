/* 7.1.2.거래처등록 : H1001, BM-7102 */

import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { TabPanel, TabView } from "primereact/tabview";
import { Fragment } from "react";
// import useToastStore from "@/store/toastStore";
import useDialogStore from "@/store/dialogStore";
import DataDetailTab2 from "@/components/7-BM/CreditEntry/DataDetailTab2";
import DataDetailTab3 from "@/components/7-BM/CreditEntry/DataDetailTab3";
import { renderRow } from "@/utils/common";
import { useNavigate } from "react-router-dom";

const DataDetail = ({ selectedProduct }) => {
  const navigate = useNavigate();
  // const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);
  const basicInfoRows = [
    [
      { label: "거래처코드", value: "0001" },
      { label: "거래처담당자", value: "홍길동" },
    ],
    [
      { label: "거래처명", value: selectedProduct?.name || "거래처명" },
      { label: "업태", value: "업태" },
    ],
    [
      { label: "거래처약칭", value: "거래처약칭" },
      { label: "업종", value: "업종" },
    ],
    [
      { label: "대표자", value: "대표자" },
      { label: "색인", value: "색인" },
    ],
    [
      { label: "주민/법인번호", value: "주민번호" },
      { label: "사용여부", value: "사용" },
    ],
    [
      { label: "사업자번호", value: "사업자번호" },
      { label: "거래처담당자", value: "0001 홍길동" },
    ],
    [{ label: "거래처등급", value: "정상" }],
  ];

  const sections = [
    {
      title: "연락처 정보",
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
          { label: "전화번호", value: "010-1234-1234" },
          { label: "팩스번호", value: "032-1234-1234" },
        ],
        [
          { label: "메일주소", value: "메일주소" },
          { label: "홈페이지", value: "홈페이지" },
        ],
      ],
    },
    {
      title: "금융정보",
      rows: [
        [
          { label: "금융기관", value: "금융기관" },
          { label: "수금처코드", value: "0001" },
        ],
        [
          { label: "계좌번호", value: "계좌번호" },
          { label: "예금주", value: "홍길동" },
        ],
      ],
    },
    {
      title: "담당자 정보",
      rows: [
        [
          { label: "업체담당자", value: "업체담당자" },
          { label: "영업지역", value: "영업지역" },
        ],
        [
          { label: "핸드폰", value: "핸드폰" },
          { label: "전화번호", value: "010-1234-1234", isExtension: true },
          { label: "내선", value: "1234", isExtension: true },
        ],
        [{ label: "팩스", value: "123-1234-1213" }],
      ],
    },
    {
      title: "거래 정보",
      rows: [
        [
          { label: "최종매출일", value: "2025-01-01" },
          { label: "최초거래", value: "2025-01-01" },
        ],
        [
          { label: "계약기간", value: "2025-01-01" },
          { label: "거래종료", value: "2025-01-01" },
        ],
        [
          { label: "월용역비", value: "0" },
          { label: "주류코드", value: "주류코드" },
        ],
      ],
    },
  ];

  // TODO
  const editBtn = () => {
    navigate(`/creditEntry/${selectedProduct?.id}/edit`);
  };

  // TODO
  const assigneeHistoryBtn = () => {
    openDialog(
      "AssigneeHis7102", // 고유는 뒤에 숫자
      { company: selectedProduct?.name || "거래처명" },
    );
  };
  // TODO
  const businessLicenseBtn = () => {
    openDialog("DGImageViewer", {
      company: selectedProduct?.name || "거래처명",
      title: "사업자 등록증 확인",
      print: false,
    });
  };

  return (
    <section className="detail">
      <TabView>
        <TabPanel header="기본 등록사항">
          <div className="tab1">
            <div className="con-header">
              <h4 className="con-header__title">기본정보</h4>
              <div className="con-header__btns">
                <Button label="담당자변경 내역" onClick={assigneeHistoryBtn} />
                <Button label="사업자 등록증 보기" onClick={businessLicenseBtn} />
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
          </div>
        </TabPanel>

        <TabPanel header="추가사항">
          <DataDetailTab2 company={selectedProduct?.name} />
        </TabPanel>
        <TabPanel header="여신관리">
          <DataDetailTab3 />
        </TabPanel>
      </TabView>
    </section>
  );
};

export default DataDetail;
