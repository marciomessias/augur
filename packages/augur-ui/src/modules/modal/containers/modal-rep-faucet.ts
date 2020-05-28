import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Message } from "modules/modal/message";
import { AppState } from "appStore";
import { closeModal } from "modules/modal/actions/close-modal";
import getRep from "modules/account/actions/get-rep";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = (state: AppState) => ({
  modal: AppStatus.get().modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => closeModal(),
  getRep: () => dispatch(getRep()),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "REP Faucet",
  description: ["Get test net REP, it will be sent to your connected wallet."],
  closeAction: () => dP.closeModal(),
  buttons: [
    {
      text: "Get REP",
      action: () => {
        dP.getRep();
        dP.closeModal();
      },
    },
    {
      text: "Cancel",
      action: () => dP.closeModal(),
    },
  ],
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(Message),
);
