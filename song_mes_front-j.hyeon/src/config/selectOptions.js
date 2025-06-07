import { Combo_Comm_Setting } from "@/utils/comboSetting";

// Combo_Comm_Setting 함수의 반환값을 가공하는 헬퍼 함수

export const customSelectOptions = [
  {
    code: 2201,
    selectlist: [
      {
        name: "select1",
        label: "전표처리",
        placeholder: "전표처리",
        data: Combo_Comm_Setting(6, 0), // 처리상태
        default: "전체",
      },
    ],
  },
  {
    code: 2202,
    selectlist: [
      {
        name: "select1",
        label: "수금구분",
        placeholder: "수금구분",
        data: Combo_Comm_Setting(10, 0), // 수금구분
        default: "전체",
      },
    ],
  },
  {
    code: 2207,
    selectlist: [
      {
        name: "select1",
        label: "종류",
        placeholder: "종류",
        data: Combo_Comm_Setting(11, 0), // 어음종류
        default: "A",
      },
      {
        name: "select2",
        label: "현황",
        placeholder: "현황",
        data: Combo_Comm_Setting(12, 0), // 어음현황
        default: "A",
      },
    ],
  },
  {
    code: 2208,
    selectlist: [
      {
        name: "select1",
        label: "상태",
        placeholder: "상태",
        data: Combo_Comm_Setting(13, 0), // 어음상태
        default: "A",
      },
      {
        name: "select2",
        label: "종류",
        placeholder: "종류",
        data: Combo_Comm_Setting(11, 0), // 어음종류
        default: "A",
      },
    ],
  },
  {
    code: 7102,
    selectlist: [
      {
        name: "select1",
        label: "구분",
        placeholder: "구분",
        data: [
          { value: "항목1", label: "항목1" },
          { value: "항목2", label: "항목2" },
          { value: "항목3", label: "항목3" },
        ],
      },
    ],
  },
  {
    code: 7104,
    selectlist: [
      {
        name: "select1",
        label: "재직자여부",
        placeholder: "재직자여부",
        data: Combo_Comm_Setting(9, 0), // 재직상태
      },
      {
        name: "select2",
        label: "운영관리사용",
        placeholder: "운영관리사용",
        data: Combo_Comm_Setting(0, 0), // 사용여부
      },
      {
        name: "select3",
        label: "사무실검색",
        placeholder: "사무실검색",
        data: Combo_Comm_Setting(0, 0), // 사용여부
        default: "전체",
      },
      {
        name: "select4",
        label: "포스검색",
        placeholder: "포스검색",
        data: Combo_Comm_Setting(0, 0), // 사용여부
      },
      {
        name: "select5",
        label: "현장검색",
        placeholder: "현장검색",
        data: Combo_Comm_Setting(0, 0), // 사용여부
      },
    ],
  },
  {
    code: 7101,
    selectlist: [
      {
        name: "select1",
        label: "구분",
        placeholder: "구분",
        data: Combo_Comm_Setting(0, 0), // 사용여부
      },
    ],
  },
  {
    code: 7302,
    selectlist: [
      {
        name: "select1",
        label: "금융처구분",
        placeholder: "금융처구분",
        data: [
          { value: "전체", label: "전체" },
          { value: "금융기관", label: "금융기관" },
          { value: "정기예금", label: "정기예금" },
          { value: "정기적금", label: "정기적금" },
          { value: "카드사", label: "카드사" },
          { value: "신용카드", label: "신용카드" },
        ],
      },
      {
        name: "select2",
        label: "사용여부",
        placeholder: "사용여부",
        data: Combo_Comm_Setting(0, 0), // 사용여부
      },
    ],
  },
  {
    code: 7304,
    selectlist: [
      {
        name: "select1",
        label: "사용여부",
        placeholder: "사용여부",
        data: Combo_Comm_Setting(0, 0), // 사용여부
        default: "사용",
      },
    ],
  },
  {
    code: 7305,
    selectlist: [
      {
        name: "select1",
        label: "사용여부",
        placeholder: "사용여부",
        data: Combo_Comm_Setting(0, 0), // 사용여부
      },
      {
        name: "select2",
        label: "계정구분",
        placeholder: "계정구분",
        data: [
          { value: "원재료", label: "원재료" },
          { value: "부재료", label: "부재료" },
          { value: "제품", label: "제품" },
          { value: "반제품", label: "반제품" },
          { value: "상품", label: "상품" },
          { value: "저장품", label: "저장품" },
          { value: "비용", label: "비용" },
          { value: "수익", label: "수익" },
        ],
      },
    ],
  },
  {
    code: 9999, // 샘플
    selectlist: [
      {
        name: "select1",
        label: "사용여부",
        placeholder: "사용여부",
        data: Combo_Comm_Setting(0, 0), // 사용여부
      },
      {
        name: "select2",
        label: "거래처상태",
        placeholder: "거래처상태",
        data: [
          { value: "전체", label: "전체" },
          { value: "매입처", label: "매입처" },
          { value: "매출처", label: "매출처" },
          { value: "금융기관", label: "금융기관" },
        ],
      },
    ],
  },
  {
    code: 7404,
    selectlist: [
      {
        name: "select1",
        label: "구분",
        placeholder: "구분",
        data: [
          { value: "0", label: "전체" },
          { value: "1", label: "공통" },
          { value: "2", label: "회계" },
          { value: "3", label: "인사" },
          { value: "4", label: "물류" },
          { value: "5", label: "원가" },
          { value: "6", label: "EIS" },
          { value: "7", label: "예산" },
          { value: "8", label: "자산" },
          { value: "9", label: "IFRS" },
          { value: "10", label: "후원자" },
        ],
        default: "0",
      },
    ],
  },
];
