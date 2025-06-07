// 상세 호출시
import { Tooltip } from "primereact/tooltip";
import { Fragment } from "react";
import { InputTextarea } from "primereact/inputtextarea";

/**
 * 상세 호출
 * 상세 내역 보여줄 때 2개의 컬럼으로 나눠서
 */
export const renderRow = (row, idx) => {
  if (row.length === 1) {
    const item = row[0];

    // 상세 컬럼에 따른 태그 표시
    const showDetailValue = (item) => {
      if (item.isAddress) {
        return (
          <div>
            {item.value.map((v, i) => (
              <span key={i}>{v}</span>
            ))}
          </div>
        );
      } else if (item.memo) {
        return (
          <div className="mt-3" style={{ width: "61rem" }}>
            <InputTextarea
              value={item.value}
              // onChange={handleChange}
              name="비고"
              rows={5}
              placeholder="비고 내용"
              disabled
              className="width-100"
            />
          </div>
        );
      } else {
        return <span>{item.value}</span>;
      }
    };

    return (
      <Fragment key={idx}>
        <div className={`con-body__data ${item.info ? "info" : ""}`}>
          <p className={item.colorSet ? "text-red-500" : ""}>
            {item.label}
            {item.tooltip && (
              <>
                <Tooltip target=".tooltip-icon-01" />
                <i
                  className="pi pi-info-circle tooltip-icon-01 ml-1"
                  data-pr-tooltip={item.tooltip}
                  data-pr-position="right"
                  data-pr-at="right+5 top+5"
                  data-pr-my="left center-2"
                ></i>
              </>
            )}
          </p>
          {showDetailValue(item)}
        </div>
        {item.info && <span className="info-text">{item.info}</span>}
      </Fragment>
    );
  }

  // 전화번호/내선 처리
  const hasExtension = row.some((item) => item.isExtension);
  if (hasExtension) {
    return (
      <div key={idx} className="column2">
        <div className="con-body__data">
          <p>{row[0].label}</p>
          <span>{row[0].value}</span>
        </div>
        <div className="con-body__data">
          <div className="extension-num">
            <div>
              <p>{row[1].label}</p>
              <span>{row[1].value}</span>
            </div>
            <div>
              <p>{row[2].label}</p>
              <span>{row[2].value}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key={idx} className="column2">
      {row.map((item, i) => (
        <div key={i} className="con-body__data">
          <p>{item.label}</p>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
};

/**
 * 숫자에 천 단위마다 콤마로 표시하는 함수
 */
export const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * calendar 기간 조회 시 날짜 가져오는 함수
 */
export const formatDates = (type) => {
  const today = new Date();

  switch (type) {
    case "1YearAgo":
      return new Date(today.setFullYear(today.getFullYear() - 1));
    case "1MonthAgo":
      return new Date(today.setMonth(today.getMonth() - 1));
    case "firstDay":
      return new Date(today.getFullYear(), today.getMonth(), 1);
    case "today":
      return today;
    case "lastDay":
      return new Date(today.getFullYear(), today.getMonth() + 1, 0);
  }
};
