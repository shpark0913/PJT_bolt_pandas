import { TBody, TD, TH, THeadMain, TR, Table } from "../TableComponents";
import { setCheckId, setInquire } from "../../_store/slices/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { Button } from "../ButtonComponents";
import { EventSourcePolyfill } from "event-source-polyfill";
import { store } from "../../_store/store";

function OHTResultMenu(props) {
  const [dashboardData, setDashboardData] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const inquire = useSelector(state => {
    return state.dashboard.inquire;
  });

  useEffect(() => {
    const sse = new EventSourcePolyfill(`${BASE_URL}dashboard`, {
      headers: {
        accesstoken: store.getState().user.token,
      },
    });

    sse.addEventListener("dashboard", event => {
      setDashboardData(JSON.parse(event.data));
      if (inquire === false) {
        dispatch(setCheckId(JSON.parse(event.data)[0].ohtCheckId));
      }
    });
  }, []);

  return (
    <Table>
      <THeadMain style={{ borderTop: "solid 2px var(--emphasize-color)" }}>
        <TR>
          <TH>&nbsp;&nbsp;&nbsp; 날짜 &nbsp;&nbsp;&nbsp;</TH>
          <TH>&nbsp;&nbsp;&nbsp; 시간 &nbsp;&nbsp;&nbsp;</TH>
          <TH>&nbsp;&nbsp; 호기 ID &nbsp;&nbsp;</TH>
          <TH>&nbsp; 판정 결과 &nbsp;</TH>
          <TH>&nbsp; FL &nbsp;</TH>
          <TH>&nbsp; FR &nbsp;</TH>
          <TH>&nbsp; RL &nbsp;</TH>
          <TH>&nbsp; RR &nbsp;</TH>
          <TH>상세보기</TH>
        </TR>
      </THeadMain>
      {props.isActive ? (
        <TBody>
          {dashboardData.map((item, idx) => {
            return (
              <TR key={idx} NG={item.flCount + item.frCount + item.rlCount + item.rrCount}>
                <TD>
                  {item.ohtCheckEndDatetime[0]}-
                  {String(item.ohtCheckEndDatetime[1]).padStart(2, "0")}-
                  {String(item.ohtCheckEndDatetime[2]).padStart(2, "0")}
                </TD>
                <TD>
                  {" "}
                  {String(item.ohtCheckEndDatetime[3]).padStart(2, "0")}:
                  {String(item.ohtCheckEndDatetime[4]).padStart(2, "0")}:
                  {item.ohtCheckEndDatetime.length === 5
                    ? "00"
                    : String(item.ohtCheckEndDatetime[5]).padStart(2, "0")}
                </TD>
                <TD>{item.ohtSn}</TD>
                <TD>
                  {item.flCount + item.frCount + item.rlCount + item.rrCount === 0 ? "정상" : "NG"}
                </TD>
                <TD>{item.flCount ? item.flCount : "-"}</TD>
                <TD>{item.frCount ? item.frCount : "-"}</TD>
                <TD>{item.rlCount ? item.rlCount : "-"}</TD>
                <TD>{item.rrCount ? item.rrCount : "-"}</TD>
                <TD>
                  <Button
                    width="50%"
                    onClick={event => {
                      event.preventDefault();
                      dispatch(setCheckId(item.ohtCheckId));
                      dispatch(setInquire(true));
                    }}
                  >
                    상세보기
                  </Button>
                </TD>
              </TR>
            );
          })}
        </TBody>
      ) : (
        <TBody>
          {dashboardData.map((item, idx) => {
            if (item.flCount + item.frCount + item.rlCount + item.rrCount !== 0) {
              return (
                <TR key={idx} NG={item.flCount + item.frCount + item.rlCount + item.rrCount}>
                  <TD>
                    {item.ohtCheckEndDatetime[0]}-
                    {String(item.ohtCheckEndDatetime[1]).padStart(2, "0")}-
                    {String(item.ohtCheckEndDatetime[2]).padStart(2, "0")}
                  </TD>
                  <TD>
                    {" "}
                    {String(item.ohtCheckEndDatetime[3]).padStart(2, "0")}:
                    {String(item.ohtCheckEndDatetime[4]).padStart(2, "0")}:
                    {item.ohtCheckEndDatetime.length === 5
                      ? "00"
                      : String(item.ohtCheckEndDatetime[5]).padStart(2, "0")}
                  </TD>
                  <TD>{item.ohtId}</TD>
                  <TD>
                    {item.flCount + item.frCount + item.rlCount + item.rrCount === 0
                      ? "정상"
                      : "NG"}
                  </TD>
                  <TD>{item.flCount ? item.flCount : "-"}</TD>
                  <TD>{item.frCount ? item.frCount : "-"}</TD>
                  <TD>{item.rlCount ? item.rlCount : "-"}</TD>
                  <TD>{item.rrCount ? item.rrCount : "-"}</TD>
                  <TD>
                    <Button
                      width="50%"
                      onClick={event => {
                        event.preventDefault();
                        dispatch(setCheckId(item.ohtCheckId));
                        dispatch(setInquire(true));
                      }}
                    >
                      상세보기
                    </Button>
                  </TD>
                </TR>
              );
            }
            return null;
          })}
        </TBody>
      )}
    </Table>
  );
}

export default OHTResultMenu;
