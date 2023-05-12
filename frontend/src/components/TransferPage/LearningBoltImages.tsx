import React, {useState} from 'react';
import styled from "styled-components";

import {TransferBoltImageObject, TransferLoaderType} from "../../_utils/Types";
import ImageUrl from "../../_utils/ImageUrl";
import {useAppDispatch, useAppSelector} from "../../_hooks/hooks";
import {setDetailInfo, setIsDetailOpen} from "../../_store/slices/transferPageSlice";

import { NumberSpan } from "./TransferTabComponents";
import {TransferBoltImage, BoltImagesGrid, BoltImagesGridContainer} from "./TransferImageComponents";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ClassName = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  &:hover {
    cursor: pointer;
  }
  & > h1 {
    margin-bottom: 0;
    margin-right: 5px;
  }
  &~hr {
    border: 0.5px solid var(--background-color);
    margin: 15px 0;
    &:last-of-type {
      display: none;
    }
  }
`
function LearningBoltImages({BoltImageLists, imageLength}: { BoltImageLists: TransferLoaderType[], imageLength: number }) {

  const dispatch = useAppDispatch();
  const { isDetailOpen, tabMenuList } = useAppSelector(state => state.transferPage);
  const [isTabOpen, setIsTabOpen] = useState<boolean[]>([false, false, false]);
  const [selected, setSelected] = useState<TransferBoltImageObject[][]>([[], [], [], []]);

  const styleFunc = (status: number): React.CSSProperties => {
    return {
      width: "24px",
      fill: "var(--emphasize-color)",
      transition: "transform 200ms ease-in",
      transform: isTabOpen[status] ? "rotate(0)" : "rotate(-90deg)",
    }
  }

  const BoltImageElement = BoltImageLists.map((data) =>
    <>
      {/* 클래스 이름.. */}
      <ClassName onClick={() => {
        setIsTabOpen(prev => {
          let newList = [...prev];
          newList[data.status] = !newList[data.status];
          return [...newList]
        });
      }}>
        <ExpandMoreIcon sx={styleFunc(data.status)} />
        <h1>
          {tabMenuList[data.status]}
        </h1>
        <NumberSpan>{data.images.length}</NumberSpan>
      </ClassName>

      <BoltImagesGrid className={`${isDetailOpen? "active" : ""} ${isTabOpen[data.status] ? "open" : ""}`}>
        { data.images.map((image) =>
          <TransferBoltImage key={`bolt_images-${image.fileId}`} >
            <label>
              <input type="checkbox" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                console.log(e.target.checked);
                if (e.target.checked) {
                  setSelected(prev => {
                    const tmp = [...prev];
                    tmp[3] = [...tmp[3], image];
                    return tmp;
                  })
                }
                else {
                  setSelected(prev => {
                    const tmp = [...prev];
                    tmp[3] = tmp[3].filter((tmpData) => tmpData.fileId !== image.fileId);
                    return tmp;
                  })
                }
              }} />
              <img src={ImageUrl(image.imgUrl)} alt="bolt" />
            </label>

            <div onClick={() => {
              dispatch(setIsDetailOpen(true));
              dispatch(setDetailInfo({imgUrl: image.imgUrl, originName: image.originName, fileId: image.fileId}))
            } }>
              {image.originName}
            </div>
          </TransferBoltImage>
        )}
      </BoltImagesGrid>
      <hr />

    </>
  )

  console.log(BoltImageElement);


  return (
    // <TabContentFlex>
    //   <TabContentInfos>
    //     <div>
    //       <label>전체 선택 <input type="checkbox"  /></label>
    //       <div>{`현재 선택 : ${selected.length}/${ imageLength }`}</div>
    //     </div>
    //     <div>학습하기 삭제하기 버튼 2개</div>
    //   </TabContentInfos>
    //
    //   <TabContentMain>
    //     <BoltImagesGridContainer className={isDetailOpen? "active" : ""}>
    //       { BoltImageElement }
    //     </BoltImagesGridContainer>
    //     <BoltImageDetailContainer className={isDetailOpen? "active" : ""}>
    //       <CloseButton onClick={() => dispatch(setIsDetailOpen(false))}><KeyboardDoubleArrowRightIcon sx={{height: "35px", width: "35px"}} /></CloseButton>
    //       <img src={ImageUrl(detailInfo.imgUrl)} alt="bolt detail"/>
    //       <div>{detailInfo.originName}</div>
    //     </BoltImageDetailContainer>
    //   </TabContentMain>
    //
    // </TabContentFlex>
    <BoltImagesGridContainer className={isDetailOpen? "active" : ""}>
      { BoltImageElement }
    </BoltImagesGridContainer>
  );
}

export default LearningBoltImages;