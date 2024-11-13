from fastapi import APIRouter
from typing import Optional
from pydantic import BaseModel
from fastapi import HTTPException
import matplotlib.pyplot as plt
import io
import pandas as pd

router = APIRouter()

# rsi구하는 공식
def calculate_rsi(data):
    # 가격 변화 계산
    delta = data['Close'].diff(1)  # Close 컬럼에 종가가 있다고 가정

    window=14

    # 상승과 하락 분리
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)

    # 평균 상승 및 하락 계산 (초기값은 14일 이동 평균 사용)
    avg_gain = gain.rolling(window=window, min_periods=1).mean()
    avg_loss = loss.rolling(window=window, min_periods=1).mean()

    # RS 및 RSI 계산
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    return rsi

#페이지별 데이터 모델

class Stock(BaseModel):
    stock_id : str
    stock_name : str
    price : str

#/stock-page에 넘겨주는 모델 : 필터링해서 전송 get
class StockPage(BaseModel):
    stock : List[Stock]

#filter에서 데이터 받아오는 모델 post
class Metrics(BaseModel):
    checked : bool
    value : float

class Filter(BaseModel):
    PER : Metrics
    PBR : Metrics
    ROE : Metrics
    RSI : Metrics
    marcap : Metrics #시가총액

#result 페이지에 넘겨주는 모델 get
class Result(BaseModel):
    stock_name : str
    price : str
    dod : str
    per : float
    pbr : float
    roe : float
    rsi : float
    capm : float
    recommend : bool
    commend : str

#지표 딕셔너리 전역변수
global_filter = Filter(
    PER = Metrics(
        checked = False,
        value = 0
    ),
    PBR = Metrics(
        checked = False,
        value = 0
    ),
    ROE = Metrics(
        checked = False,
        value = 0
    ),
    RSI = Metrics(
        checked = False,
        value = 0
    ),
    marcap = Metrics(
        checked = False,
        value = 0
    )
)

#비즈니스 로직

# 주식 선택 화면(/select)
def get_filtered_stocks(StockPage: stock_page):

    stock_list = []

    for i in (stock_page.stock):

        data = get_stock(i.stock_name)

        stock_id = data.stock_id
        stock_name = data.name
        price = data.dpr    #종가
        marcap = data.시가총액
        eps = 당기순이익 / 주식수   
        per = price / eps
        bps = 순자산 / 주식수
        pbr = price / bps
        roe = 당기순이익 / 순자산 * 100
        rsi = calculate_rsi(data)
        
        # 필터링 조건
        filtered = True
        if global_filter.PER.checked and per > global_filter.PER.value:
            filtered = False
        if global_filter.PBR.checked and pbr > global_filter.PBR.value:
            filtered = False
        if global_filter.ROE.checked and roe < global_filter.ROE.value:
            filtered = False
        if global_filter.RSI.checked and rsi < global_filter.RSI.value:
            filtered = False
        if global_filter.marcap.checked and marcap < global_filter.marcap.value:
            filtered = False

        if(filtered):
            stock_list.append(Stock(stock_id=stock_id, stock_name=stock_name, price=price))

    return stock_list

@router.post("/stock_page")
def select(stock_page : StockPage):

    stocks = get_filtered_stocks(stock_page)  # 여기에 실제 데이터 가져오기 로직이 들어감
    stock_page = StockPage(stock=stocks)

    return stock_page


# 필터 지표 값 받아오기(/filter)
@router.post("/filter")
def filter(updated_filter : Filter):
    
    global global_filter
    global_filter = updated_filter

    return {"message" : "Metric saved succesfully"}

@router.get("/filter")
def filter():

    return global_filter


# 분석 결과 화면(/result)
@router.get("/result/{stock_id}", response_model=Result)
def result():
    
    #stock_id로 db에서 찾기

    data = get_data()

    stock_name = data.itmsNm    #종목이름
    price = data.dpr    #종가
    dod = data.fltRt    #등락률
    eps = 당기순이익 / 주식수   
    per = price / eps
    bps = 순자산 / 주식수
    pbr = price / bps
    roe = 당기순이익 / 순자산 * 100
    rsi = calculate_rsi(data)
    exepect_close = 
    commend_txt = ""

    if(per < 5 and pbr < 1 and roe > 10):
        recommend = True
        commend_txt += "PER과 PBR 값이 작고 ROE 값이 큰 것으로 보아 해당 주식은 과소평가되어 있어 성장 가능성이 높습니다.\n"
        if(rsi > 70):
            commend_txt += "하지만 RSI 값이 너무 커 현재 주식이 단기적인 과매수 상태이므로 상황을 조금 지켜보는 것이 나아 보입니다.\n"
        elif(rsi < 30):
            commend_txt += "또한, RSI 값이 너무 작아 주식이 과매도 상태이므로 높은 수익률을 기대할 수 있습니다.\n"
    else:
        recommend = False
        pre = False
        if(per >=5):
            pre = True
            commend_txt += "PER과 "
        if(pbr >= 1):
            pre = True
            commend_txt += "PBR 값이 "
        if(roe <= 10):
            if(pre):
                commend_txt += "크고 ROE 값이 작은 것으로 보아 주식의 성장 가능성을 보장하기 어렵습니다.\n"
            else:
                commend_txt += "ROE 값이 작은 것으로 보아 주식의 성장 가능성을 보장하기 어렵습니다.\n"
        else:
            commend_txt += "크기 때문에 주식의 성장 가능성을 확신하기 어렵습니다.\n"
        if(rsi > 70):
            commend_txt += "또한, RSI 값이 너무 커 현재 주식이 과매수 상태이므로 매수를 하기엔 무리가 있습니다.\n"
        elif(rsi < 30):
            commend_txt += "하지만 RSI 값이 너무 작아 주식이 과매도 상태이므로 단기적인 이익을 얻을 순 있을 것 같습니다.\n"
    
    
    result = Result(
        stock_name = stock_name,
        price = price,
        dod = dod,
        per = per,
        pbr = pbr,
        roe = roe,
        rsi = rsi,
        recommend = recommend,
        commend = commend_txt
    )

    return result


@router.get("/result/portfolio", response_model=Result)
def portfolio():
    #일별 수익률 평균 곱 250 예측 수익률

    #포트폴리오 위험도 계산












@router.get("/plot/{stock_id}")
async def plot(stock_id : int):

    # 차트 생성
    plt.figure(figsize=(6, 4))
    plt.plot(x, y, label = stock_name)
    plt.xlabel("날짜")
    plt.ylabel("주가")
    plt.title("Stock Plot")
    plt.legend()

    # 차트를 이미지 파일로 저장 (BytesIO로 메모리에 저장)
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    plt.close()  # 메모리 해제

    # 이미지 응답으로 반환
    return Response(content=buf.getvalue(), media_type="image/png")