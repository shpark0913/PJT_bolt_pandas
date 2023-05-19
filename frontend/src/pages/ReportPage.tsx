import { Button, SemesButton } from "../components/ButtonComponents";
import { Form, useLoaderData, useSearchParams, useSubmit } from "react-router-dom";
import { InputEndDate, InputStartDate } from "../components/ReportPage/InputDate";
import React, { useCallback, useEffect, useState } from "react";
import { ReportLoaderType, ReportObjectType } from "../_utils/Types";
import { useAppDispatch, useAppSelector } from "../_hooks/hooks";

import Axios from "../_utils/Axios";
import InputDescFlag from "../components/ReportPage/InputDescFlag";
import InputErrorFlag from "../components/ReportPage/InputErrorFlag";
import InputOhtSn from "../components/ReportPage/InputOHTSn";
import InputTime from "../components/ReportPage/InputTime";
import InputWheelPosition from "../components/ReportPage/InputWheelPosition";
import PaginationComponents from "../components/ReportPage/PaginationComponents";
import ReportDetail from "../components/ReportDetail/ReportDetail";
import ReportTable from "../components/ReportPage/ReportTable";
import { setQueryObj } from "../_store/slices/reportPageSlice";
import styled from "styled-components";
import useDate from "../_hooks/useDate";

const ReportSection = styled.section`
  padding: 30px;
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
`;
const ReportContainer = styled.div`
  width: 100%;
  transition: all 500ms ease;
  overflow-x: auto;

  &.open {
    width: 55%;
    overflow-x: auto;
  }
`;

const FormTop = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 20px;
`;
const FormInputs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(200px, auto));
  gap: 10px 20px;

  & div {
    grid-column: span 2;
    width: calc(2 * 220px + 20px);
  }

  & > button:last-child {
    justify-self: end;
  }
`;

const NoData = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
`;

function ReportPage() {
  // ================ 초기 값 ================
  let dispatch = useAppDispatch();
  let submit = useSubmit();
  let { result, totalPage } = useLoaderData() as ReportLoaderType; // 서버에서 가져온 값

  let [query] = useSearchParams(); // 쿼리값

  useEffect(() => {
    dispatch(setQueryObj(Object.fromEntries(query))); // 쿼리 값을 redux에 저장... 저장 되는거 맞지?
  }, [query]);

  let userName = useAppSelector(state => state.user.userName); // csv 출력 시 필요
  let { todayFormat } = useDate();
  let todayDate = todayFormat(); // 오늘 날짜
  let paginationTotalPage = Math.ceil(totalPage / 20);

  // =================== submit ======================
  /** 페이지를 바꾸는 경우 -> 그냥 제출
   *  그게 아니면 -> page를 1로 바꿔줘야 함
   */
  const handleSubmit = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.currentTarget.form) {
      let form = new FormData(e.currentTarget.form);
      if (e.currentTarget.name !== "page") {
        form.set("page", "1");
      }
      !form.has("errorFlag") && form.set("errorFlag", "0");
      !form.has("time") && form.set("time", "ALL");
      submit(form);
    }
  };

  // =================== 모달 관련 ===================
  let [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  let [detailInfo, setDetailInfo] = useState<ReportObjectType>({
    wheelCheckDate: [2023, 5, 2, 4, 32, 10],
    boltGoodCount: 0,
    boltLoseCount: 0,
    boltOutCount: 0,
  });
  /** 모달이 열리면 실행되는 함수 */
  const handleModalOpen = useCallback(
    async (e: React.MouseEvent<HTMLTableRowElement>, wheelCheckId: number) => {
      e.preventDefault();
      let reportDetail: ReportObjectType = {
        wheelCheckDate: [2023, 5, 2, 4, 32, 10],
        boltGoodCount: 0,
        boltLoseCount: 0,
        boltOutCount: 0,
      };
      try {
        let response = await Axios.get(`report/detail/${wheelCheckId}`);
        reportDetail = response.data.data;
      } catch (err) {
        console.log(err);
      }
      await setDetailInfo(reportDetail);
      setIsModalOpen(true);
    },
    [],
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // ================ form 조회 =================

  // ==================== CSV 파일 다운로드 ====================
  const handleDownloadCSV = () => {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("page");
    searchParams.set("userName", userName);
    let newSearchParams: string[] = [];
    searchParams.forEach((val, key) => {
      newSearchParams.push(`${key}=${val}`);
    });

    window.location.href = `${process.env.REACT_APP_BASE_URL}report/download?${newSearchParams.join(
      "&",
    )}`;
  };

  // ======================= 일주일 조회, 30일 조회 ==========================
  const handleSubmitPeriod = (e: React.MouseEvent<HTMLButtonElement>, day: number) => {
    if (e.currentTarget.form) {
      let form = new FormData(e.currentTarget.form);
      dispatch(
        setQueryObj({
          page: "1",
          startDate: todayFormat(new Date(Date.now() - day * 24 * 60 * 60 * 1000)),
          endDate: todayDate,
        }),
      );

      form.set("page", "1");
      form.set("startDate", todayFormat(new Date(Date.now() - day * 24 * 60 * 60 * 1000)));
      form.set("endDate", todayDate);
      !form.has("errorFlag") && form.set("errorFlag", "0");
      !form.has("time") && form.set("time", "ALL");

      submit(form);
    }
  };

  const handleSubmitToday = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.form) {
      let form = new FormData(e.currentTarget.form);
      dispatch(setQueryObj({ page: "1", startDate: todayDate, endDate: todayDate }));

      form.set("page", "1");
      form.set("startDate", todayDate);
      form.set("endDate", todayDate);
      !form.has("errorFlag") && form.set("errorFlag", "0");
      !form.has("time") && form.set("time", "ALL");

      submit(form);
    }
  };

  return (
    <>
      <ReportSection>
        {/*{ isModalOpen && <ReportModal scrollY={scrollY} detailInfo={detailInfo} handleModalClose={handleModalClose}  /> }*/}
        {/*<Title title="레포트" />*/}

        <ReportContainer className={isModalOpen ? "open" : "close"}>
          <Form
            replace={true}
            method="GET"
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <FormTop>
              <FormInputs>
                <InputOhtSn />
                <InputStartDate handleSubmit={handleSubmit} />
                <InputEndDate handleSubmit={handleSubmit} todayDate={todayDate} />
                <InputTime handleSubmit={handleSubmit} />
                <InputWheelPosition handleSubmit={handleSubmit} />
                <InputDescFlag handleSubmit={handleSubmit} />
                <InputErrorFlag handleSubmit={handleSubmit} />
                <div>
                  <SemesButton
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmitPeriod(e, 30)}
                    type="button"
                    width="120px"
                    height="26px"
                    style={{ marginRight: "20px" }}
                  >
                    최근 30일 조회
                  </SemesButton>
                  <SemesButton
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmitPeriod(e, 7)}
                    type="button"
                    width="120px"
                    height="26px"
                    style={{ marginRight: "20px" }}
                  >
                    최근 7일 조회
                  </SemesButton>
                  <SemesButton
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmitToday(e)}
                    type="button"
                    width="120px"
                    height="26px"
                    style={{ marginRight: "20px" }}
                  >
                    당일 조회
                  </SemesButton>
                </div>
              </FormInputs>

              <Button type="button" onClick={() => handleDownloadCSV()} width="90px" height="26px">
                CSV 출력
              </Button>
            </FormTop>

            {result?.length ? (
              <>
                <ReportTable handleModalOpen={handleModalOpen} />
                <PaginationComponents
                  paginationTotalPage={paginationTotalPage}
                  handleSubmit={handleSubmit}
                />
              </>
            ) : (
              <NoData>데이터가 존재하지 않습니다.</NoData>
            )}
          </Form>
        </ReportContainer>

        <ReportDetail
          className={isModalOpen ? "open" : "close"}
          handleModalClose={handleModalClose}
          detailInfo={detailInfo}
        ></ReportDetail>
      </ReportSection>
    </>
  );
}

export default ReportPage;
