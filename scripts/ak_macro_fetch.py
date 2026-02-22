import json
import os
from datetime import datetime
import pandas as pd
def to_pairs(df,date_col,value_col):
    out=[]
    if date_col in df.columns and value_col in df.columns:
        for _,row in df[[date_col,value_col]].dropna().iterrows():
            t=str(row[date_col])
            v=float(row[value_col])
            out.append({"t":t,"v":v})
    return out
def try_pmi():
    try:
        import akshare as ak
        df=ak.macro_china_pmi()
        c_date=None
        for k in ["年月","日期","date","时间","time"]:
            if k in df.columns:
                c_date=k
                break
        c_pmi=None
        for k in ["制造业PMI","PMI","pmi"]:
            if k in df.columns:
                c_pmi=k
                break
        c_new=None
        for k in ["新订单指数","新订单","new_orders","newOrders"]:
            if k in df.columns:
                c_new=k
                break
        return {"pmi":to_pairs(df,c_date,c_pmi),"newOrders":to_pairs(df,c_date,c_new)}
    except Exception:
        return {"pmi":[],"newOrders":[]}
def yoy_from_series(df,date_col,value_col):
    try:
        s=df[[date_col,value_col]].dropna().copy()
        s[date_col]=pd.to_datetime(s[date_col],errors="coerce")
        s=s.dropna()
        s=s.sort_values(date_col)
        s["year"]=s[date_col].dt.year
        s["month"]=s[date_col].dt.month
        s["key"]=s["year"].astype(str)+"-"+s["month"].astype(str).str.zfill(2)
        s["yoy"]=s[value_col].pct_change(12)*100.0
        out=[]
        for _,row in s.iterrows():
            if pd.notnull(row["yoy"]):
                out.append({"t":row["key"],"v":float(row["yoy"])})
        return out
    except Exception:
        return []
def try_money_supply():
    try:
        import akshare as ak
        df=ak.macro_china_money_supply()
        c_date=None
        for k in ["月份","日期","date","时间","time"]:
            if k in df.columns:
                c_date=k
                break
        c_m1=None
        for k in ["M1同比","m1_yoy","M1YOY"]:
            if k in df.columns:
                c_m1=k
                break
        c_m2=None
        for k in ["M2同比","m2_yoy","M2YOY"]:
            if k in df.columns:
                c_m2=k
                break
        if c_m1 and c_m2:
            m1=to_pairs(df,c_date,c_m1)
            m2=to_pairs(df,c_date,c_m2)
            return {"m1YoY":m1,"m2YoY":m2}
        c_m1_lvl=None
        for k in ["M1","m1"]:
            if k in df.columns:
                c_m1_lvl=k
                break
        c_m2_lvl=None
        for k in ["M2","m2"]:
            if k in df.columns:
                c_m2_lvl=k
                break
        return {"m1YoY":yoy_from_series(df,c_date,c_m1_lvl),"m2YoY":yoy_from_series(df,c_date,c_m2_lvl)}
    except Exception:
        return {"m1YoY":[],"m2YoY":[]}
def try_cpi():
    try:
        import akshare as ak
        df=ak.macro_china_cpi()
        if "当月同比" in df.columns and ("时间" in df.columns or "月份" in df.columns or "date" in df.columns):
            c_date="时间" if "时间" in df.columns else ("月份" if "月份" in df.columns else "date")
            return {"cpiYoY":to_pairs(df,c_date,"当月同比")}
        c_date=None
        for k in ["时间","月份","date","年月"]:
            if k in df.columns:
                c_date=k
                break
        c_val=None
        for k in ["CPI同比","同比","cpi_yoy"]:
            if k in df.columns:
                c_val=k
                break
        return {"cpiYoY":to_pairs(df,c_date,c_val)}
    except Exception:
        return {"cpiYoY":[]}
def try_unemp():
    try:
        import akshare as ak
        df=ak.macro_china_unemployment_rate()
        c_date=None
        for k in ["日期","时间","date","月份"]:
            if k in df.columns:
                c_date=k
                break
        c_val=None
        for k in ["城镇调查失业率","失业率","unemployment_rate"]:
            if k in df.columns:
                c_val=k
                break
        return {"unemp":to_pairs(df,c_date,c_val)}
    except Exception:
        return {"unemp":[]}
def try_tsf_yoy():
    try:
        import akshare as ak
        df=ak.macro_china_total_social_financing()
        c_date=None
        for k in ["月份","日期","时间","date"]:
            if k in df.columns:
                c_date=k
                break
        c_val=None
        for k in ["社会融资规模存量","社融存量","total"]:
            if k in df.columns:
                c_val=k
                break
        return {"tsfYoY":yoy_from_series(df,c_date,c_val)}
    except Exception:
        return {"tsfYoY":[]}
def merge_dicts(ds):
    out={"pmi":[],"newOrders":[],"tsfYoY":[],"m1YoY":[],"m2YoY":[],"houseWoW":[],"cpiYoY":[],"unemp":[]}
    for d in ds:
        for k,v in d.items():
            if isinstance(v,list) and v:
                out[k]=v
    return out
def main():
    data=merge_dicts([try_pmi(),try_money_supply(),try_cpi(),try_unemp(),try_tsf_yoy()])
    os.makedirs("data",exist_ok=True)
    with open(os.path.join("data","macro_history.json"),"w",encoding="utf-8") as f:
        json.dump(data,f,ensure_ascii=False)
    rows=[]
    keys=["pmi","newOrders","tsfYoY","m1YoY","m2YoY","houseWoW","cpiYoY","unemp"]
    dates=set()
    for k in keys:
        for p in data[k]:
            dates.add(p["t"])
    for t in sorted(list(dates)):
        row={"date":t}
        for k in keys:
            row[k]=""
        for k in keys:
            for p in data[k]:
                if p["t"]==t:
                    row[k]=p["v"]
                    break
        rows.append(row)
    pd.DataFrame(rows).to_csv(os.path.join("data","macro_history.csv"),index=False,encoding="utf-8")
if __name__=="__main__":
    main()
