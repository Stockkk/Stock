import React from "react";
import Container from "../components/Container";
import { useNavigate } from "react-router-dom";
import styles from "./ResultPage.module.css";

function ResultPage() {
  const navigate = useNavigate();
  const backbutton = () => {
    navigate("/stock-page");
  };

  return (
    <>
      <div className={styles.bg} />
      <Container>
        <div className={styles.set}>
          <div className={styles.filterSet}>
            <div className={styles.filterSetHeader}>
              <div className={styles.filterSetTitle}>
                <p className={styles.companyName}>A 기업</p>
                <p className={styles.stockPrice}>407,000</p>
                <div className={styles.change}>
                  <p className={styles.change1}>전일 대비</p>
                  <p className={styles.change2}>+3,450(10%)</p>
                </div>
              </div>
              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <p className={styles.metricType}>PER</p>
                  <p className={styles.metricDetail}>12.34</p>
                </div>
                <div className={styles.metric}>
                  <p className={styles.metricType}>PBR</p>
                  <p className={styles.metricDetail}>1.84</p>
                </div>
                <div className={styles.metric}>
                  <p className={styles.metricType}>ROE</p>
                  <p className={styles.metricDetail}>15%</p>
                </div>
                <div className={styles.metric}>
                  <p className={styles.metricType}>RSI</p>
                  <p className={styles.metricDetail}>60</p>
                </div>
                <div className={styles.metric}>
                  <p className={styles.metricType}>기타정보</p>
                </div>
              </div>
            </div>
            <div className={styles.chart}>
              {/* 차트 추가할 부분 */}
              <p>차트 영역</p>
            </div>
          </div>
        </div>

        <div className={styles.set}>
          <div className={styles.filterSet}>
            <div className={styles.CompanyTitle}>
              <p>A 기업에 대한 평가</p>
            </div>
            <div className={styles.CompanyRec}>
              {/* 추천인지 비추천인지에 대한 기준에 맞춰 코드를 다시 수정해야함 */}
              <p>추천합니다 OR 비추천합니다</p>
            </div>
            <div className={styles.companyDetail}>
              {/* (비)추천에 대한 이유 추가할 부분 */}
              <p>(비)추천에 대한 이유 설명</p>
            </div>
          </div>
        </div>

        <div className={styles.button}>
          <button className={styles.backButton} onClick={backbutton}>
            돌아가기
          </button>
        </div>
      </Container>
    </>
  );
}

export default ResultPage;
