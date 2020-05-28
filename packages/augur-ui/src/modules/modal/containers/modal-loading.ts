import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Loading } from 'modules/modal/loading';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const { isLogged, modal, loginAccount } = AppStatus.get();
  return ({
    isLogged,
    loginAccount,
    modal,
  });
}
const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => closeModal(),
});

const mergeProps = (sP: any, dP: any) => ({
  shouldClose: sP.isLogged && sP.loginAccount.meta && !sP.loginAccount.meta.preloaded,
  message: sP.modal.message,
  callback: sP.modal.callback,
  showMetaMaskHelper: sP.modal.showMetaMaskHelper,
  showCloseAfterDelay: sP.modal.showCloseAfterDelay,
  showLearnMore: sP.modal.showLearnMore,
  closeModal: dP.closeModal,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Loading)
);
