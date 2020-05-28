import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Message } from "modules/modal/message";
import { closeModal } from "modules/modal/actions/close-modal";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "appStore";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = (state: AppState) => ({
  modal: AppStatus.get().modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => closeModal(),
});

const mergeProps = (sP, dP, oP) => {
  return {
    title: `Market Loading`,
    buttons: [],
    description: [
      "Please wait, Market is loading...",
    ],
    closeAction: () => dP.closeModal(),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(Message),
);
