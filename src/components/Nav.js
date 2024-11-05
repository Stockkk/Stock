import Container from "./Container";
import styles from "./Nav.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();
  const startbutton = () => {
    navigate("/stock-page");
  };
  return (
    <div className={styles.nav}>
      <Container className={styles.container}>
        <ul className={styles.menu}>
          <li>
            <p className={styles.title}>
              <Link to="/">주식프로그램 이름</Link>
            </p>
          </li>
          <li>
            <div className={styles.button}>
              <button className={styles.startButton} onClick={startbutton}>
                시작하기
              </button>
            </div>
          </li>
        </ul>
      </Container>
    </div>
  );
}

export default Nav;
