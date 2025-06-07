/* 악성채권전환내역	L3067 DG-badClaimHistory DG-57 */

import { Dialog } from "primereact/dialog";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { formatNumberWithCommas, renderRow } from "@/utils/common";
import { Button } from "primereact/button";

const DGBadClaimHistory = ({ data, onCloseFn }) => {
  const toast = useRef(null);

  const valueEmptyCheck = (value) => {
    if (!value) return value;
    return formatNumberWithCommas(value);
  };

  const badClaimEntryDetails = [
    [{ label: "전환번호", value: data?.전환번호 }],
    [
      {
        label: "거래처",
        value: data?.거래처명,
      },
    ],
    [{ label: "전환일", value: data?.전환일 }],
    [{ label: "보고일", value: data?.보고일 }],
    [
      {
        label: "보고자",
        value: data?.보고자,
      },
    ],
    [{ label: "전환유형", value: data?.전환유형 }],
    [{ label: "간략사유", value: data?.간략사유 }],
    [{ label: "특이사항", value: data?.특이사항 || "특이사항 없음" }],
    [
      {
        label: "전 담당자",
        value: `1000 | ${data?.책임자}`,
      },
      {
        label: "현 담당자",
        value: `1000 | ${data?.책임자}`,
      },
    ],
    [
      {
        label: "총채권금액",
        value: valueEmptyCheck(data?.총채권금액),
        colorSet: true,
      },
    ],
    [
      {
        label: "전환금액",
        value: valueEmptyCheck(data?.전환금액),
        colorSet: true,
      },
    ],
    [
      {
        label: "책임사원1",
        value: `1000 | ${data?.책임자}`,
      },
      {
        label: "요율",
        value: `${data?.요율1}% | ${valueEmptyCheck(Math.floor((data?.요율1 / 100) * data?.총채권금액))}`,
      },
    ],
    [
      {
        label: "책임사원2",
        value: `1000 | ${data?.책임자}`,
      },
      {
        label: "요율",
        value: `${data?.요율2}% | ${valueEmptyCheck(Math.floor((data?.요율2 / 100) * data?.총채권금액))}`,
      },
    ],
  ];

  return (
    <Dialog
      header="악성채권전환내역"
      visible
      onHide={() => onCloseFn(null)}
      className="DGBadClaimHistory"
      style={{ width: "55vw" }}
    >
      <Toast ref={toast} />
      <div className="Dialog-container form-list">
        <div className="con-body flex justify-between">
          <div className="left-con" style={{ flex: "0.8" }}>
            {badClaimEntryDetails.map((row, idx) => {
              const hasSecondValue = row.length > 1;
              const isAmountLabel = row[0].label === "총채권금액" || row[0].label === "전환금액";

              // 요율 계산을 위한 기본값 설정
              if (row.length > 1 && row[1].label === "요율") {
                const rate = row[1].label === "요율" ? 50 : 0; // 임시 요율값 50%
                const amount = 1000000; // 임시 금액 100만원
                row[1].value = `${rate}% | ${formatNumberWithCommas(Math.floor((rate / 100) * amount))}`;
              }

              return (
                <div key={idx} className="form__input">
                  {hasSecondValue ? (
                    <div className="flex justify-between" style={{ width: "100%" }}>
                      <div className="flex-1">
                        <p>{row[0].label}</p>
                        <span>{row[0].value}</span>
                      </div>
                      <div className="flex-1 ml-4">
                        <p>{row[1].label}</p>
                        <span>{row[1].value}</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p
                        className="form__label"
                        style={isAmountLabel ? { color: "#ef4444", fontWeight: 500 } : {}}
                      >
                        {row[0].label}
                      </p>
                      <div className="flex items-center justify-between" style={{ width: "100%" }}>
                        <span>{row[0].value}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <div className="right-con flex-1">
            <Panel header="원인 및 내용">
              <p className="causeAndContent">{data?.원인및내용}</p>
            </Panel>
            <Panel header="재발 방지 대책" className="mt-3">
              <p className="preventiveMeasure">{data?.재발방지대책}</p>
            </Panel>
          </div>
        </div>
      </div>
      <div className="Dialog__btns">
        <Button label="닫기" severity="secondary" onClick={() => onCloseFn(null)} />
      </div>
    </Dialog>
  );
};

export default DGBadClaimHistory;
