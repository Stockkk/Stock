import React, { useState } from "react";
import Container from "../components/Container";
import { useNavigate } from "react-router-dom";
import styles from "./StockPage.module.css";

// DB 연결해야할 부분
const suggestions = ["애플", "구글", "테슬라", "삼성전자", "카카오", "삼성"];
const cardData = [
  { name: "A 기업", value: "407,000" },
  { name: "B 기업", value: "190,300" },
  { name: "C 기업", value: "169,300" },
  { name: "D 기업", value: "126,000" },
  { name: "E 기업", value: "38,000" },
  { name: "F 기업", value: "53,000" },
  { name: "G 기업", value: "407,000" },
  { name: "BD 기업", value: "190,300" },
  { name: "CS 기업", value: "169,300" },
  { name: "DD 기업", value: "126,000" },
  { name: "EE 기업", value: "38,000" },
  { name: "FD 기업", value: "53,000" },
  { name: "V 기업", value: "407,000" },
  { name: "BK 기업", value: "190,300" },
  { name: "CZ 기업", value: "169,300" },
  { name: "DS 기업", value: "126,000" },
  { name: "EY 기업", value: "38,000" },
  { name: "FI 기업", value: "53,000" },
];

function StockPage() {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const analyzebutton = () => {
    if (selectedCompany) {
      navigate("/result-page", { state: { company: selectedCompany } });
    }
  };
  const recbutton = () => {
    navigate("/filter-page");
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.includes(value)
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSelectedCompany(suggestion); // 선택된 기업 업데이트
    navigate("/result-page", { state: { company: suggestion } }); // 결과 페이지로 이동
  };

  const Card = ({ name, value }) => {
    const isSelected = selectedCompany === name;
    return (
      <div
        className={`${styles.card} ${isSelected ? styles.selectedCard : ""}`}
        onClick={() => setSelectedCompany(name)}
      >
        <div className={styles.cardContent}>
          <h3>{name}</h3>
          <p>{value}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.bg} />
      <Container>
        <div className={styles.searchContainer}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            className={styles.searchInput}
            placeholder="종목명 / 지수명 입력"
          />
          {filteredSuggestions.length > 0 && (
            <ul className={styles.suggestions}>
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)} // 클릭 시 함수 호출
                  className={styles.suggestionItem}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.set}>
          <div className={styles.stockRec}>
            <div className={styles.stockRecDes}>
              <p>필터에 따른 종목 추천 or 인기 종목</p>
              <button className={styles.recButton} onClick={recbutton}>
                필터설정
              </button>
            </div>

            <div className={styles.cardContainer}>
              {cardData.map((card, index) => (
                <Card key={index} {...card} />
              ))}
            </div>
          </div>
        </div>
        <div className={styles.button}>
          <button className={styles.analyzeButton} onClick={analyzebutton}>
            분석하기
          </button>
        </div>
      </Container>
    </>
  );
}

export default StockPage;
