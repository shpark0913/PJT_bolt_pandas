import React from "react";
import {Button, RedButton, SemesButton} from "../ButtonComponents";
import useTransferBoltImages from "../../_hooks/useTransferBoltImages";
import {TransferBoltImageObject} from "../../_utils/Types";
import { useAppDispatch, useAppSelector } from "../../_hooks/hooks";
import { setIsConfirmModalOpen } from "../../_store/slices/transferPageSlice";
import Axios from "../../_utils/Axios";

function TransferButtons() {
  const dispatch = useAppDispatch();
  let { type, status } = useAppSelector(state => state.transferPage)
  const { openConfirmModal, TransferClass, TransferLearning, DeleteImages } = useTransferBoltImages();

  let TransferValue = ['양호로 이동', '유실로 이동', '파단으로 이동'];

  /** 어느 클래스로 이동할지 묻는 버튼 */
  const ConfirmMoveClassButton = (): JSX.Element => {
    const moveButtons = [0, 1, 2].map(val => {
      if (status === val) return <></>;
      return <Button onClick={() => {
        openConfirmModal(status, val)
      }}> {TransferValue[val]} </Button>
    })
    return <> {moveButtons} </>;
  }
  /** 학습 클래스로 이동할지 묻는 버튼 */
  const ConfirmMoveTrainButton = () => {
    return <SemesButton onClick={() => openConfirmModal(status, 3)}> 학습으로 이동 </SemesButton>
  };
  /** 삭제를 묻는 버튼 */
  const ConfirmDeleteButton = () => {
    return <RedButton onClick={() => openConfirmModal(status, 4)}> 삭제하기 </RedButton>
  };
  /** 학습할 것인지 묻는 버튼 */
  const ConfirmTrainButton = () => {
    return <SemesButton onClick={() => openConfirmModal(status, 3)}> 학습하기 </SemesButton>
  };
  /** confirm 모달창 닫기 */
  const CancelConfirmModalButton = () => {
    return <Button onClick={() => dispatch(setIsConfirmModalOpen(false)) }>취소하기</Button>
  }


  /** 다른 클래스로 이동하기  */
  const TransferClassButton = (preType: number,
                               nextType: number,
                               selected: TransferBoltImageObject[]) => {

    return <SemesButton
      onClick={ () => {
        TransferClass(preType, nextType, selected.map(d => d.fileId));
        setSelected(prev => {
          const tmp = [...prev]
          tmp[preType] = []
          return [...tmp]
        });
        dispatch(setIsConfirmModalOpen(false));
      }}
    >
      {TransferValue[nextType]}
    </SemesButton>
  }
  /** 학습용 폴더로 이동 */
  const TransferLearningButton = (selected: TransferBoltImageObject[]) => {
    return <SemesButton
      onClick={ () => {
        TransferLearning(selected.map(d => d.fileId));
        setSelected(prev => {
          const tmp = [...prev]
          tmp[type.preType] = []
          return [...tmp]
        });
        dispatch(setIsConfirmModalOpen(false));
      }}
    >
      { TransferValue[3] }
    </SemesButton>
  }
  const DeleteImagesButton = (selected: TransferBoltImageObject[]) => {
    return <RedButton onClick={() => {
      DeleteImages(selected.map(d => d.fileId))
      setSelected(prev => {
        const tmp = [...prev]
        tmp[preType] = []
        return [...tmp]
      });
      dispatch(setIsConfirmModalOpen(false));
    }}>{TransferValue[4]}</RedButton>
  }

  const handleTrain = async () => {
    try {
      const response = await Axios.get('transition/learning', {
        params: {},
      })
      console.log(response);
    }
    catch (error) {
      console.log(error)
    }
  }
  const TrainButton = () => {
    return <SemesButton onClick={() => handleTrain()}>학습하기</SemesButton>
  }

  return { ConfirmMoveClassButton, ConfirmMoveTrainButton, ConfirmDeleteButton, ConfirmTrainButton,
    CancelConfirmModalButton, TransferClassButton, TransferLearningButton, DeleteImagesButton, TrainButton }
}

export default TransferButtons;