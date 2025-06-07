import { Combo_Comm_Setting } from "@/utils/comboSetting";

export const customMultiSelectOptions = [
  {
    code: 9999, // StyleGuide 페이지 코드
    selectlist: [
      {
        name: "거래처구분",
        label: "거래처구분",
        placeholder: "거래처구분을 선택하세요",
        EgName: "customerType",
        data: [
          { value: "1", label: "매입처", default: true },
          { value: "2", label: "매출처", default: false },
          { value: "3", label: "금융기관", default: true },
          { value: "4", label: "기타", default: false },
        ],
      },
      {
        name: "거래처유형",
        label: "거래처유형",
        placeholder: "거래처유형을 선택하세요",
        EgName: "customerCategory",
        data: [
          { value: "1", label: "법인" },
          { value: "2", label: "개인" },
          { value: "3", label: "기관" },
        ],
      },
    ],
  },
  {
    code: 2203,
    selectlist: [
      {
        name: "여신등급",
        label: "여신등급",
        placeholder: "여신등급을 선택하세요",
        EgName: "creditGrade",
        data: [
          { value: "1", label: "등급없음", default: true },
          { value: "2", label: "우수", default: true },
          { value: "3", label: "정상", default: true },
          { value: "4", label: "경계", default: true },
          { value: "5", label: "불량", default: true },
          { value: "6", label: "거래중지", default: true },
          { value: "7", label: "악성", default: false },
          { value: "8", label: "악성채권", default: false },
        ],
      },
    ],
  },
];
