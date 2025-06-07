// 0.로그인 : LG-0102

import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

const ChangePWPage = () => {
  const [form, setForm] = useState({
    currentPW: "",
    changePW: "",
    chackedPW: "",
  });
  const [isError, setIsError] = useState({
    currentPW: false,
    changePW: false,
    chackedPW: false,
  });
  const toast = useRef(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const validate = () => {
    const errors = {
      currentPW: !form.currentPW,
      changePW: !form.changePW,
      chackedPW: !form.chackedPW,
    };

    setIsError((prev) => ({
      ...prev,
      ...errors,
    }));

    return !errors.currentPW && !errors.changePW && !errors.chackedPW;
  };
  const clickChangePWBtn = () => {
    if (!validate()) {
      toast.current.show({
        severity: "error",
        summary: "비밀번호 변경 실패",
        detail: "암호를 입력해주세요.",
      });
      return;
    }
    // api 호출
    if (form.currentPW === "1234") {
      toast.current.show({
        severity: "success",
        summary: "비밀번호 변경 성공",
        detail: "비밀번호 변경 성공",
      });
    } else {
      setIsError((prev) => ({
        ...prev,
        currentPW: true,
      }));

      toast.current.show({
        severity: "error",
        summary: "비밀번호 변경 실패",
        detail: "암호를 확인해주세요.",
      });
    }
    if (form.changePW !== form.chackedPW) {
      setIsError((prev) => ({
        ...prev,
        chackedPW: true,
      }));
    }
  };

  return (
    <div id="ChangePW">
      <Toast ref={toast} />
      <div className="ChangePW__loc">
        <div className="ChangePW__sec">
          <h2 className="text-h3">비밀번호 변경</h2>
          <div className="input-text mt-6">
            <label htmlFor="0102-currentPW">현재 암호</label>
            <div className="PW__loc">
              <InputText
                name="currentPW"
                id="0102-currentPW"
                placeholder="현재 암호"
                onChange={handleChange}
              />
            </div>
          </div>
          {isError.currentPW && <span className="input-err-info">*암호를 확인해주세요</span>}

          <div className="input-text mt-6">
            <label htmlFor="0102-changePW">변경 암호</label>
            <div className="PW__loc">
              <InputText
                name="changePW"
                id="0102-changePW"
                placeholder="변경 암호"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-text mt-6">
            <label htmlFor="0102-chackedPW">확인 암호</label>
            <div className="PW__loc">
              <InputText
                name="chackedPW"
                id="0102-chackedPW"
                placeholder="변경 암호"
                onChange={handleChange}
              />
            </div>
          </div>
          {isError.chackedPW && <span className="input-err-info">*변경암호와 값이 다릅니다</span>}
          <div className="btns__sec mt-5">
            <Button label="취소" severity="secondary" outlined onClick={() => navigate("/login")} />
            <Button label="비밀번호 변경" onClick={clickChangePWBtn} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePWPage;
