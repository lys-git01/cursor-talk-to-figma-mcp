// 0.로그인 : LG-0101

import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import LOGO_IMG from "@/assets/LOGO_728 x 90_color.png";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { getUserNames } from "@/api/userAPI";

const sampleData = [
  {
    userId: "1001",
    userName: "홍길동",
  },
  {
    userId: "1002",
    userName: "김철수",
  },
  {
    userId: "1003",
    userName: "이영희",
  },
  {
    userId: "1004",
    userName: "박민수",
  },
  {
    userId: "1005",
    userName: "최지우",
  },
  {
    userId: "1006",
    userName: "강호동",
  },
  {
    userId: "1007",
    userName: "장보고",
  },
  {
    userId: "1008",
    userName: "유재석",
  },
  {
    userId: "1009",
    userName: "하하",
  },
  {
    userId: "1010",
    userName: "이수근",
  },
];

const LoginPage = () => {
  const [form, setForm] = useState({ userId: "", userName: "", password: "" });
  const [isError, setIsError] = useState({ userId: false, password: false });
  const toast = useRef(null);
  const navigate = useNavigate();
  const { setUserInfo } = useAuthStore();
  // 로컬저장 상태 저장
  const [userNames, setUserNames] = useState([]);

  useEffect(() => {
    // 테스트 데이터 사용
    setUserNames(sampleData);
    // return;
    // const fetchUser = async () => {
    //   try {
    //     const response = await getUserNames(); // axios 응답 객체
    //     setUserNames(response.data); // 응답 데이터만 저장
    //   } catch (error) {
    //     toast.current.show({
    //       severity: "error",
    //       summary: "사용자 정보를 가져오는 데 실패했습니다",
    //       detail: error.message,
    //     });
    //   }
    // };
    // fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const errors = {
      userId: !form.userName,
      password: !form.password,
    };

    setIsError((prev) => ({
      ...prev,
      ...errors,
    }));

    return !errors.userId && !errors.password;
  };

  const onChangeUserId = (e) => {
    const { value } = e.target;
    const user = userNames.find((item) => item.userId === value);

    if (user) {
      setForm((prev) => ({
        ...prev,
        userId: value,
        userName: user.userName,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        userId: value,
        userName: "",
      }));
    }
  };

  const clickLoginBtn = () => {
    if (!validate()) {
      toast.current.show({
        severity: "error",
        summary: "로그인 실패",
        detail: "사번과 암호를 확인해주세요.",
      });
      return;
    }
    if (form.userId === "1001" && form.password === "1234") {
      // api 호출
      const user = {
        id: form.userId,
        name: form.userName,
        token: "abc123token",
      };

      setUserInfo(user);

      toast.current.show({
        severity: "success",
        summary: "로그인 성공",
        detail: "성공",
      });

      navigate("/");
    } else {
      // 백엔드나 네트워크 에러
      toast.current.show({
        severity: "error",
        summary: "로그인 실패",
        detail: "네트워크를 확인해주세요",
      });
    }
  };
  const clickChangePWBtn = () => {
    if (form.userId === "1001" && form.password === "1234") {
      // api 호출
      navigate("/changePW");
    } else {
      toast.current.show({
        severity: "error",
        summary: "비밀번호 변경 불가",
        detail: "사번과 암호를 확인해주세요.",
      });
    }
  };

  return (
    <div id="Login">
      <Toast ref={toast} />
      <div className="Login__loc">
        <img src={LOGO_IMG} alt="회사로고" className="mb-6" />
        <div className="Login__sec">
          <h2 className="text-h3 mb-1">로그인</h2>

          <p className="gray-500 mb-6">사용자의 사번과 암호를 입력해주세요.</p>
          <div>
            <div className="input-text ">
              <label htmlFor="0101-userId">사용자 사번</label>
              <div className="userId__loc">
                <InputText
                  name="userId"
                  id="0101-userId"
                  placeholder="사용자 사번"
                  keyfilter="int"
                  onChange={onChangeUserId}
                />
                <p>{form.userName}</p>
              </div>
            </div>
          </div>
          {isError.userId && <span className="input-err-info">*사번을 확인해주세요.</span>}

          <div className="input-text Login-input-w mt-6">
            <label htmlFor="0101-userpw">사용자 암호</label>
            <Password
              name="password"
              id="0101-userpw"
              toggleMask="toggleMask"
              feedback={false}
              placeholder="사용자 암호"
              onChange={handleChange}
            />
          </div>

          <div className="btns__sec mt-5">
            <Button label="로그인" onClick={clickLoginBtn} />
            <Button label="비밀번호 변경" severity="secondary" onClick={clickChangePWBtn} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
