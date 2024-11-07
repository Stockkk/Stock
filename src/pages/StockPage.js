import React, { useState, useEffect } from "react";
import Container from "../components/Container";
import { useNavigate } from "react-router-dom";
import styles from "./StockPage.module.css";

const suggestions = [
  "애플",
  "구글",
  "테슬라",
  "삼성전자",
  "카카오",
  "삼성",
  "한화오션",
  "더본코리아",
  "삼성중공업",
  "삼성SDI",
];

function StockPage() {
  const navigate = useNavigate();
  const [selectedCompanies, setSelectedCompanies] = useState(() => {
    const savedCompanies = sessionStorage.getItem("selectedCompanies");
    return savedCompanies ? JSON.parse(savedCompanies) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  useEffect(() => {
    sessionStorage.setItem(
      "selectedCompanies",
      JSON.stringify(selectedCompanies)
    );
  }, [selectedCompanies]);

  const analyzebutton = () => {
    if (selectedCompanies.length > 0) {
      navigate("/result-page", { state: { companies: selectedCompanies } });
    } else {
      alert("분석할 기업을 선택해 주세요.");
    }
  };

  const recbutton = () => {
    navigate("/filter-page");
  };

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
    if (selectedCompanies.length >= 5) {
      alert("5개까지만 선택할 수 있습니다.");
      return;
    }
    if (!selectedCompanies.includes(suggestion)) {
      setSelectedCompanies([...selectedCompanies, suggestion]);
    }
    setSearchTerm("");
    setFilteredSuggestions([]);
  };

  const handleRemoveCompany = (company) => {
    setSelectedCompanies(selectedCompanies.filter((item) => item !== company));
  };

  const Card = ({ name }) => (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3>{name}</h3>
      </div>
      <button
        onClick={() => handleRemoveCompany(name)}
        className={styles.removeButton}
      >
        삭제
      </button>
    </div>
  );

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
            placeholder="추가하고 싶은 관심 종목명 / 지수명을 입력해주세요"
          />
          {filteredSuggestions.length > 0 && (
            <ul className={styles.suggestions}>
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
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
              <p>관심 기업 / 종목</p>
              <button className={styles.recButton} onClick={recbutton}>
                필터설정
              </button>
            </div>

            <div className={styles.cardContainer}>
              {selectedCompanies.length === 0 ? (
                <p className={styles.placeholder}>
                  관심 기업/종목을 추가해주세요
                </p>
              ) : (
                selectedCompanies.map((company, index) => (
                  <Card key={index} name={company} />
                ))
              )}
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
