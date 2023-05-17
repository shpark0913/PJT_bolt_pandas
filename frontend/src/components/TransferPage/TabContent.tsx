import React, {useState} from 'react';

import {useAppDispatch, useAppSelector} from "../../_hooks/hooks";
import {TransferBoltImageObject, TransferLoaderType} from "../../_utils/Types";
import ImageUrl from "../../_utils/ImageUrl";
import {setIsDetailOpen} from "../../_store/slices/transferPageSlice";

import {
  TabContentFlex,
  TabContentInfos,
  TabContentContainer,
  TabContentMain,
  BoltImageDetailContainer, BoltImageDetail, BoltImageDetailWrapper
} from "./TabContentComponents";
import TransferBoltImages from "./TransferBoltImages";
import LearningBoltImages from "./LearningBoltImages";
import TransferButtons from "./TransferButtons";
import {CloseButton} from "../Modal/ModalComponents";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
// import useConfirmModal from "../../_hooks/useConfirmModal";
import ConfirmModal from "./ConfirmModal";

function TabContent({BoltImageLists, imageLengthList}: {BoltImageLists: TransferLoaderType[][], imageLengthList: number[]}) {

  const dispatch = useAppDispatch();
  const { isConfirmModalOpen, isDetailOpen, tabIndex, detailInfo } = useAppSelector(state => state.transferPage);
  const { ConfirmTransferClassButton } = TransferButtons();
  const [selected, setSelected] = useState<TransferBoltImageObject[][]>([[], [], [], []]);
  // const { isConfirmModalOpen, ConfirmTransferClassButton, TransferClassButton, TransferLearningButton, DeleteImagesButton } = TransferButtons();
  // const { isConfirmModalOpen, setIsConfirmModalOpen } = useConfirmModal();
  //
  // const ButtonLists: JSX.Element[] = [
  //   selected[0].length ?
  //     <>
  //       { TransferClassButton(0, 1, selected[0].map(d => d.fileId)) }
  //       { TransferClassButton(0, 2, selected[0].map(d => d.fileId)) }
  //       { TransferLearningButton(selected[0].map(d => d.fileId)) }
  //       { DeleteImagesButton(0, selected[0], setSelected) }
  //     </> : <></>,
  //   selected[1].length ?
  //     <>
  //       { TransferClassButton(1, 0, selected[1].map(d => d.fileId)) }
  //       { TransferClassButton(1, 2, selected[1].map(d => d.fileId)) }
  //       { TransferLearningButton(selected[1].map(d => d.fileId)) }
  //       { DeleteImagesButton(1, selected[1], setSelected) }
  //     </> : <></>,
  //   selected[2].length ?
  //     <>
  //       { TransferClassButton(2, 0, selected[2].map(d => d.fileId)) }
  //       { TransferClassButton(2, 1, selected[2].map(d => d.fileId)) }
  //       { TransferLearningButton(selected[2].map(d => d.fileId)) }
  //       { DeleteImagesButton(2, selected[2], setSelected) }
  //     </> : <></>,
  //   selected[3].length ?
  //     <>
  //       { TransferLearningButton(selected[3].map(d => d.fileId)) }
  //       { DeleteImagesButton(3, selected[3], setSelected) }
  //     </> : <></>,
  // ];

  return (
    <TabContentContainer>

      { isConfirmModalOpen ? <ConfirmModal selected={selected[tabIndex]} setSelected={setSelected} /> : <></> }

      <TabContentFlex>
        <TabContentInfos>
          <div>
            <label>전체 선택 <input type="checkbox"/></label>
            <div>{`현재 선택 : ${selected[tabIndex].length}/${imageLengthList[tabIndex]}`}</div>
          </div>
          {/*<div>{ ButtonLists[tabIndex] }</div>*/}
          <div> {ConfirmTransferClassButton(tabIndex)} </div>
        </TabContentInfos>
        <TabContentMain>
          { tabIndex < 3 ?
            <TransferBoltImages BoltImageLists={BoltImageLists[0]} selected={selected[tabIndex]} setSelected={setSelected} /> :
            <LearningBoltImages BoltImageLists={BoltImageLists[1]} imageLength={imageLengthList[3]} selected={selected[tabIndex]} setSelected={setSelected} />
          }
          <BoltImageDetailContainer className={isDetailOpen? "active" : ""}>
            <CloseButton onClick={() => dispatch(setIsDetailOpen(false))}><KeyboardDoubleArrowRightIcon sx={{height: "35px", width: "35px"}} /></CloseButton>
            <BoltImageDetailWrapper>
              <BoltImageDetail src={ImageUrl(detailInfo.imgUrl)} alt="bolt detail"/>
              <div>{detailInfo.originName}</div>
            </BoltImageDetailWrapper>
          </BoltImageDetailContainer>

        </TabContentMain>
      </TabContentFlex>
    </TabContentContainer>
  );
}

export default TabContent;