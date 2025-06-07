/**
 * 다음(카카오) 우편번호 검색 스크립트를 동적으로 로드합니다.
 */
export const loadDaumPostcodeScript = () => {
  const script = document.createElement("script");
  script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  script.async = true;
  document.body.appendChild(script);
  return script;
};

/**
 * 다음(카카오) 우편번호 검색 팝업을 열고 주소 정보를 반환하는 함수
 * @param {Function} onComplete - 주소 선택 완료 시 실행될 콜백 함수
 */
export const handleAddressSearch = (onComplete) => {
  new window.daum.Postcode({
    oncomplete: onComplete,
  }).open();
};
