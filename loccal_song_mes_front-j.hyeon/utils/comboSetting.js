/**
 * 콤보박스 설정을 위한 공통 함수
 * @param {number} setKey - 콤보박스 타입 설정 (0-9)
 * @param {number} setSebu - 전체 옵션 표시 여부 (0: 표시, 1: 미표시)
 * @returns {Array} 콤보박스 옵션 배열
 */
export const Combo_Comm_Setting = (setKey, setSebu = 0) => {
  const comboLists = [];

  switch (setKey) {
    case 0: // 사용여부
      if (setSebu === 0) {
        comboLists.push({ value: "A", label: "전  체" });
      }
      comboLists.push({ value: "0", label: "미사용" });
      comboLists.push({ value: "1", label: "사  용" });
      break;

    case 1: // 거래처상태
      if (setSebu === 0) {
        comboLists.push({ value: "0", label: "전    체" });
      }
      comboLists.push({ value: "1", label: "우수" });
      comboLists.push({ value: "2", label: "정상" });
      comboLists.push({ value: "3", label: "경계" });
      comboLists.push({ value: "4", label: "불량" });
      comboLists.push({ value: "5", label: "악성" });
      comboLists.push({ value: "6", label: "악성채권" });
      comboLists.push({ value: "9", label: "거래중지" });
      break;

    case 2: // 수주서상태
      comboLists.push({ value: "A", label: "전    체" });
      comboLists.push({ value: "1", label: "확    정" });
      comboLists.push({ value: "2", label: "공정시작" });
      comboLists.push({ value: "3", label: "공정중지" });
      comboLists.push({ value: "4", label: "오더취소" });
      comboLists.push({ value: "5", label: "마    감" });
      break;

    case 3: // 매입구분
      if (setSebu === 0) {
        comboLists.push({ value: "A", label: "전    체" });
      }
      comboLists.push({ value: "0", label: "매입과세" });
      comboLists.push({ value: "1", label: "수입영세" });
      comboLists.push({ value: "2", label: "매입면세" });
      comboLists.push({ value: "3", label: "매입기타" });
      break;

    case 4: // 출고상태
      comboLists.push({ value: "A", label: "전    체" });
      comboLists.push({ value: "1", label: "미 출 고" });
      comboLists.push({ value: "2", label: "출고완료" });
      comboLists.push({ value: "3", label: "마감자료" });
      break;

    case 5: // 발주구분
      if (setSebu === 0) {
        comboLists.push({ value: "A", label: "전    체" });
      }
      comboLists.push({ value: "1", label: "구매발주" });
      comboLists.push({ value: "2", label: "외주발주" });
      break;

    case 6: // 처리상태
      if (setSebu === 0) {
        comboLists.push({ value: "0", label: "전  체" });
      }
      comboLists.push({ value: "1", label: "처  리" });
      comboLists.push({ value: "2", label: "미처리" });
      break;

    case 7: // 관리상태
      comboLists.push({ value: "0", label: "미관리" });
      comboLists.push({ value: "1", label: "관  리" });
      break;

    case 8: // 구매/생산 구분
      comboLists.push({ value: "0", label: "구  매" });
      comboLists.push({ value: "1", label: "생  산" });
      break;

    case 9: // 재직상태
      if (setSebu === 0) {
        comboLists.push({ value: "A", label: "전  체" });
      }
      comboLists.push({ value: "0", label: "퇴사자" });
      comboLists.push({ value: "1", label: "재직자" });
      break;

    case 10: // 수금구분
      comboLists.push({ value: "0", label: "현금" });
      comboLists.push({ value: "1", label: "카드" });
      break;

    case 11: // 어음종류
      if (setSebu === 0) {
        comboLists.push({ value: "A", label: "전   체" });
      }
      comboLists.push({ value: "0", label: "약속어음" });
      comboLists.push({ value: "1", label: "당좌수표" });
      comboLists.push({ value: "2", label: "문방어음" });
      comboLists.push({ value: "3", label: "전자어음" });
      break;

    case 12: // 어음현황
      if (setSebu === 0) {
        comboLists.push({ value: "A", label: "전  체" });
      }
      comboLists.push({ value: "0", label: "보  유" });
      break;

    case 13: // 어음상태
      if (setSebu === 0) {
        comboLists.push({ value: "A", label: "전   체" });
      }
      comboLists.push({ value: "0", label: "진 행 중" });
      comboLists.push({ value: "0", label: "대손처리" });
      comboLists.push({ value: "0", label: "회수완료" });
      break;
  }

  return comboLists;
};
