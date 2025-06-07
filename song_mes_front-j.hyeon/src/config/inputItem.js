export const inputName = [
  { koName: "거래처명", EgName: "customerName" },
  { koName: "대표자명", EgName: "ceoName" },
  { koName: "사업자번호", EgName: "businessNumber" },
  { koName: "업종", EgName: "businessType" },
  { koName: "색인", EgName: "indexCode" },
  { koName: "사원이름", EgName: "userName" },
  { koName: "이름", EgName: "name" },
  { koName: "명칭", EgName: "name" },
  { koName: "가로 / 세로", EgName: "widthHeight" },
  { koName: "중량", EgName: "weight" },
  { koName: "사이즈", EgName: "size" },
  { koName: "카드회원명", EgName: "cardMemberName" },
  { koName: "그룹코드", EgName: "groupCode" },
  { koName: "그룹명", EgName: "groupName" },
  { koName: "자재코드", EgName: "materialCode" },
  { koName: "자재명", EgName: "materialName" },
  { koName: "비고", EgName: "note" },
  { koName: "거래처", EgName: "clientName" },
  { koName: "환경요소명", EgName: "elementName" },
  { koName: "간략사유", EgName: "briefReason" },
];

export const selectName = [{ koName: "사용여부", EgName: "useStatus" }];

export const checkboxName = [
  { koName: "미사용포함", EgName: "useStatus" },
  { koName: "수량없음 포함", EgName: "quantity" },
  { koName: "잔액없음 포함", EgName: "balance" },
];

export const callList = [
  { koName: "담당자", EgName: "DGManager", props: { isMultiple: true } },
  { koName: "책임자", EgName: "DGManager", props: { isMultiple: true } },
  { koName: "최종 거래처", EgName: "DGClientSelect1" },
  { koName: "자재그룹", EgName: "DGCommonCode1", props: { state: "itemgrp" } },
];

export const dateName = [
  { koName: "조회기간", EgName: "searchPeriod" },
  { koName: "거래일자", EgName: "transactionDate" },
  { koName: "입금번호", EgName: "depositNumber" },
  { koName: "전표일자", EgName: "voucherDate" },
  { koName: "수금일자", EgName: "collectionDate" },
  { koName: "매입일자", EgName: "purchaseDate" },
  { koName: "매출일자", EgName: "salesDate" },
  { koName: "등록일자", EgName: "registrationDate" },
  { koName: "수정일자", EgName: "modificationDate" },
  { koName: "전환번호", EgName: "conversionNumber" },
  { koName: "부도일자", EgName: "bouncedDate" },
];
