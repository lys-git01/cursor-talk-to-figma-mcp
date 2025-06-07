export const menuItems = [
  {
    label: "총무부", //GA (General Affairs)
    children: [
      {
        label: "작업사고", // 1.1.accident
        children: [
          { label: "사고등록(경위서)", path: "/incidentEntry" }, // C1004, GA-1101
          { label: "사고현황(개별)", path: "/incidentIndiv" }, // C1002, GA-1102
          { label: "사고현황(집계)", path: "/incidentSummary" }, // C1003, GA-1103
          { label: "도안폐기등록", path: "/designDiscard1" }, // C1005, GA-1104
          { label: "도안폐기현황", path: "/discardStatus" }, // C1007, GA-1105
        ],
      },
      {
        label: "근태관리", // 1.2.attendance
        children: [
          { label: "근태현황", path: "/attendance" }, // C2030, GA-1201
          { label: "근무시간(집계)", path: "/workSummary" }, // C2035, GA-1202
          { label: "근태신청현황", path: "/requestStatus" }, // C2040, GA-1203
          { label: "잔여연차현황", path: "/leaveRemain" }, // C2055, GA-1205
        ],
      },
      {
        label: "기타관리", // 1.3.misc
        children: [
          { label: "공지사항입력", path: "/noticeEntry" }, // C2012, GA-1302
          { label: "일일업무보고", path: "/dailyReport" }, // C2020, GA-1303
          { label: "일일업무보고(결제)", path: "/dailyApproval" }, // C2021, GA-1304
          { label: "일일업무보고(출력)", path: "/dailyPrint" }, // C2022, GA-1305
          { label: "매입대문제점", path: "/purchaseIssue1" }, // C2013, GA-1306
          { label: "매입대담당변경", path: "/buyerChange" }, // C2045, GA-1307
          { label: "차량운행관리", path: "/vehicleMgmt" }, // C2060, GA-1309
        ],
      },
    ],
  },
  {
    label: "영업부", // SA (Sales)
    children: [
      {
        label: "견적서", // 2.1.quotation
        children: [
          { label: "견적서입력", path: "/quoteEntry" }, // Y1002, SA-2101
          { label: "견적서현황", path: "/quoteStatus" }, // Y1003, SA-2102
        ],
      },
      {
        label: "수금관리", // 2.2.collection
        children: [
          { label: "수금처리", path: "/paymentProcess" }, // A6530, SA-2201
          { label: "수금현황", path: "/paymentStatus" }, // A6535, SA-2202
          { label: "채권현황", path: "/claimStatus" }, // Y1015, SA-2203
          { label: "구)채권현황(2020)", path: "/oldClaim2020" }, // Y1010, SA-2204
          { label: "악성채권전환등록", path: "/badClaimEntry" }, // C1020, SA-2205
          { label: "악성채권전환현황", path: "/badClaimStatus" }, // C1025, SA-2206
          { label: "받은어음관리", path: "/receivedNote" }, // A8560, SA-2207
          { label: "부도어음관리", path: "/bouncedNote" }, // A8550, SA-2208
          { label: "어음발행인관리", path: "/noteIssuer" }, // A9801, SA-2209
        ],
      },
      {
        label: "문구사업", // 2.3.stationery
        children: [
          { label: "문구등록", path: "/itemEntry" }, // F1510, SA-2301
          { label: "문구보유현황", path: "/itemStock" }, // F1514, SA-2302
          { label: "문구매출등록", path: "/itemSaleEntry" }, // F1511, SA-2303
          { label: "문구대여등록", path: "/itemRental" }, // F1513, SA-2304
          { label: "문구매출현황", path: "/itemSales" }, // F1512, SA-2305
        ],
      },
      {
        label: "매출관리", // 2.4.sales
        children: [
          { label: "일반매출등록", path: "/generalSales" }, // J3010, SA-2401
          { label: "매출마감", path: "/salesClose" }, // J3020, SA-2402
          { label: "매출마감일등록", path: "/salesCloseDate" }, // H1110, SA-2403
        ],
      },
    ],
  },
  {
    label: "생산관리부", // PR (Production)
    children: [
      {
        label: "수주서", // 3.1.orders
        children: [
          { label: "수주서등록", path: "/orderEntry" }, // F1001, PR-3101
          { label: "수주서조회", path: "/orderLookup" }, // F1003, PR-3102
          { label: "씨에프엔컴퍼니", path: "/cfCompany" }, // F1015, PR-3103
          { label: "신규매출현황", path: "/newSalesStatus" }, // F1013, PR-3105
          { label: "미생산수량", path: "/pendingQty" }, // F1005, PR-3106
          { label: "카렌다비축분", path: "/calendarReserve" }, // F1008, PR-3107
          { label: "절수계산(엑셀)", path: "/cuttingCalc" }, // F1026, PR-3108
          { label: "기계사양정보", path: "/machineSpecs" }, // F1027, PR-3109
          { label: "불량개선관리", path: "/defectMgmt" }, // F1009, PR-3110
          { label: "생산이동꼬리표", path: "/prodMoveLabel" }, // F1028, PR-3111
        ],
      },
      {
        label: "생산관리", // 3.2.production
        children: [
          { label: "스케쥴관리", path: "/scheduleMgmt" }, // F1046, PR-3201
          { label: "표지배정현황", path: "/coverAssignStatus" }, // F1048, PR-3202
          { label: "공정현황", path: "/processStatus" }, // F1057, PR-3203
          { label: "자재현황", path: "/materialStatus" }, // H1010, PR-3204
          { label: "비축자재관리", path: "/resvMatMgmt" }, // H1010, PR-3205
          { label: "포스신청목형", path: "/posDieRequest" }, // F1160, PR-3206
          { label: "잉여품목설정", path: "/surplusItemSet" }, // F1029, PR-3207
          { label: "잉여자재관리", path: "/surplusMaterial" }, // F1058, PR-3208
          { label: "잉여코드등록", path: "/surplusCodeEntry" }, // F1032, PR-3209
          { label: "잉여코드연결", path: "/surplusCodeLink" }, // F1034, PR-3210
          { label: "검수공정관리", path: "/inspectionMgmt" }, // F1059, PR-3211
          { label: "인쇄감리관리", path: "/printAuditMgmt" }, // F1040, PR-3212
          { label: "작업배치도등록", path: "/layoutEntry" }, // H2020, PR-3213
          { label: "고무판현황", path: "/rubberPlateStatus" }, // H2030, PR-3214
        ],
      },
      {
        label: "생산현황", // 3.3.prodStatus
        children: [
          { label: "작업일보조회", path: "/dailyWorkLog" }, // F1114, PR-3301
          { label: "작업일보(생산단가)", path: "/workCostLog" }, // F1130, PR-3302
          { label: "작업메모사항", path: "/workMemo" }, // F1120, PR-3303
          { label: "잉크사용현황", path: "/inkUsage" }, // F1125, PR-3304
          { label: "작업일보관리", path: "/workLogMgmt" }, // F1115, PR-3305
          { label: "담당일보체크", path: "/supervisorCheck" }, // F1135, PR-3306
          { label: "기계별일보조회", path: "/machineLog" }, // F1119, PR-3307
          { label: "작업일보분석", path: "/workAnalysis" }, // F1116, PR-3308
          { label: "작업일보분석(기간별)", path: "/workAnalysisPeriod" }, // F1118, PR-3309
          { label: "수작업비용(수주별)", path: "/manualCostOrder" }, // F1117, PR-3310
          { label: "현황판", path: "/dashboard" }, // F2012, PR-3311
          { label: "포스화면", path: "/posScreen" }, // F1150, PR-3312
        ],
      },
      {
        label: "수주서관리", // 3.4.orderMgmt
        children: [
          { label: "작업량조회", path: "/workloadView" }, // F1113, PR-3401
          { label: "계산서발행", path: "/invoiceIssue" }, // F1090, PR-3402
          { label: "수주서마감", path: "/orderClose" }, // F1091, PR-3403
          { label: "생산수익분석(개별)", path: "/profitAnalysisIndiv" }, // F1301, PR-3404
          { label: "생산수익분석(전체)", path: "/profitAnalysisAll" }, // F1052, PR-3405
          { label: "표준수익분석(개별)", path: "/stdProfitIndiv" }, // F1303, PR-3406
          { label: "표준수익분석(전체)", path: "/stdProfitAll" }, // F1053, PR-3407
          { label: "매출집계", path: "/salesSummary" }, // F1302, PR-3408
          { label: "폐기현황", path: "/discardOverview" }, // C1006, PR-3409
        ],
      },
    ],
  },
  {
    label: "자재입출고", // MT (Material)
    children: [
      {
        label: "발주관련", // 4.1.purchaseReq
        children: [
          { label: "발주서등록", path: "/orderSheetEntry" }, // J2002, MT-4101
          { label: "발주현황", path: "/orderStatus" }, // J2003, MT-4102
          { label: "미발주현황", path: "/pendingOrders" }, // J2004, MT-4103
        ],
      },
      {
        label: "입고관련", // 4.2.receipt
        children: [
          { label: "입고처리", path: "/receiptProcess" }, // J1005, MT-4201
          { label: "미확인입고", path: "/unconfirmedReceipt" }, // J1002, MT-4202
          { label: "입고현황", path: "/receiptStatus" }, // J1003, MT-4203
          { label: "외상매입현황", path: "/creditPurchases" }, // Y1025, MT-4204
          { label: "구)외상매입현황", path: "/oldCreditPurchases" }, // Y1020, MT-4205
          { label: "매입마감현황", path: "/purchaseCloseStatus" }, // Y1021, MT-4206
          { label: "입고 꼬리표", path: "/receiptLabel" }, // J1010, MT-4207
        ],
      },
      {
        label: "출고관련", // 4.3.shipment
        children: [
          { label: "출고등록", path: "/shipmentEntry" }, // F1060, MT-4301
          { label: "출고현황", path: "/shipmentStatus" }, // F1061, MT-4302
        ],
      },
      {
        label: "매입관리", // 4.4.purchase
        children: [
          { label: "일반매입등록", path: "/generalPurchase" }, // J2010, MT-4401
          { label: "매입마감", path: "/purchaseClose" }, // J2020, MT-4402
          { label: "매입회계처리", path: "/purchaseAccounting" }, // J2030, MT-4403
          { label: "매입마감일등록", path: "/purchaseCloseDate" }, // H1150, MT-4404
        ],
      },
      {
        label: "지급관리", // 4.5.payment
        children: [
          { label: "지급처리", path: "/paymentProcessOut" }, // A6540, MT-4501
          { label: "지급현황", path: "/paymentStatusOut" }, // A6545, MT-4502
        ],
      },
    ],
  },
  {
    label: "경리부", // AC (Accounting)
    children: [
      { label: "전표관리", path: "/voucherMgmt" }, // A1000, AC-5101
      { label: "일일자금현황", path: "/dailyCashStatus" }, // A6520, AC-5201,
    ],
  },
  {
    label: "통합", // CO (Common)
    children: [
      { label: "매출관리", path: "/salesMgmt" }, // J3030, CO-6201
    ],
  },
  {
    label: "기초정보관리", // BM (Basic Management)
    children: [
      {
        label: "공통코드", // 7.1.commonCode
        children: [
          { label: "사용권한등록", path: "/authEntry" }, // H1020, BM-7101
          { label: "거래처등록", path: "/creditEntry" }, // H1001, BM-7102
          { label: "단가표등록", path: "/costEntry" }, // H1017, BM-7103
          { label: "사용자등록", path: "/userEntry" }, // A9001, BM-7104
        ],
      },
      {
        label: "생산코드", // 7.2.prodCode
        children: [
          { label: "합지코드등록", path: "/laminateCode" }, // H1011, BM-7201
          { label: "공정코드등록", path: "/processCodeEntry" }, // H1013, BM-7202
          { label: "청구코드등록", path: "/billingCodeEntry" }, // H1014, BM-7203
          { label: "공통코드등록", path: "/commonCode" }, // H1024, BM-7204
          { label: "기기코드등록", path: "/deviceCode" }, // H1018, BM-7205
          { label: "절수이미지등록", path: "/cutImageEntry" }, // H2010, BM-7206
          { label: "작업종류등록", path: "/workTypeEntry" }, // H1016, BM-7207
          { label: "자동공정코드등록", path: "/autoProcessCode" }, // H2001, BM-7208
          { label: "제지류공시가등록", path: "/paperPriceEntry" }, // H1021, BM-7209
          { label: "합지청구가등록", path: "/laminateBilling" }, // H1023, BM-7211
          { label: "표준제품등록", path: "/standardProduct" }, // 신규, BM-7212
        ],
      },
      {
        label: "기초정보관리", // 7.3.masterData
        children: [
          { label: "금융거래처등록", path: "/financeClient" }, // A0110, BM-7302
          { label: "거래담당일괄변경", path: "/bulkClientMgr" }, // A0120, BM-7303
          { label: "자재그룹등록", path: "/materialGroup" }, // A0210, BM-7304
          { label: "자재등록", path: "/materialEntry" }, // A0200, BM-7305
          { label: "기계별담당지정", path: "/machineManager" }, // F1126, BM-7306
        ],
      },
      {
        label: "시스템관리", // 7.4.system
        children: [
          { label: "회사등록", path: "/companyEntry" }, // A0010, BM-7401
          { label: "사업장등록", path: "/siteEntry" }, // A0015, BM-7402
          { label: "부서등록", path: "/deptEntry" }, // A0020, BM-7403
          { label: "시스템환경설정", path: "/systemConfig" }, // A0025, BM-7404
          { label: "관리내역등록", path: "/mgmtHistory" }, // A0030, BM-7405
          { label: "계정과목등록", path: "/accountTitle" }, // A0035, BM-7406
          { label: "메뉴관리", path: "/menuMgmt" }, // A0040, BM-7407
          { label: "마감일등록", path: "/closingDate" }, // A0045, BM-7408
        ],
      },
    ],
  },
  {
    label: "기타", // OL (Old Program), EX (Extra)
    children: [
      { label: "구)사고입력", path: "/oldIncidentEntry" }, // C1001, OL-8101
      { label: "구)입고등록(발주없음)", path: "/manualReceipt" }, // J1006, OL-8201
      { label: "구)입고현황(2020년)", path: "/oldReceipt2020" }, // J1004, OL-8202
      { label: "디지털센서 연계", path: "/sensorIntegration" }, // EX-01
      { label: "로봇", path: "/robot" }, // EX-02
    ],
  },
];
