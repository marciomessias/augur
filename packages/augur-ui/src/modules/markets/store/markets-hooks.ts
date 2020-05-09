import { useReducer } from 'react';
import { MARKETS_ACTIONS, MOCK_MARKETS_STATE, DEFAULT_MARKETS_STATE, STUBBED_MARKETS_ACTIONS } from 'modules/markets/store/constants';
import immutableDelete from "immutable-delete";

const {
  UPDATE_ORDER_BOOK,
  CLEAR_ORDER_BOOK,
  UPDATE_MARKETS_DATA,
  REMOVE_MARKET
} = MARKETS_ACTIONS;

function processMarketsData(newMarketsData, existingMarketsData) {
  return Object.keys(newMarketsData).reduce((p, marketId) => {
    const marketData = {
      ...existingMarketsData[marketId],
      ...newMarketsData[marketId]
    };

    p[marketId] = marketData;

    return p;
  }, {});
}

export const Markets = {
  actionsSet: false,
  get: () => ({ ...DEFAULT_MARKETS_STATE }),
  actions: STUBBED_MARKETS_ACTIONS,
};

export function MarketsReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case UPDATE_ORDER_BOOK: {
      const { marketId, orderBook } = action;
      updatedState.orderBooks = {
        ...updatedState.orderBooks,
        [marketId]: orderBook,
      };
      break;
    }
    case CLEAR_ORDER_BOOK: {
      updatedState.orderBooks = DEFAULT_MARKETS_STATE.orderBooks;
      break;
    }
    case UPDATE_MARKETS_DATA:
      updatedState.marketInfos = {
        ...updatedState.marketInfos,
        ...processMarketsData(action.marketInfos, updatedState.marketInfos)
      };
      break;
    case REMOVE_MARKET:
      updatedState.marketInfos = immutableDelete(updatedState.marketInfos, action.marketId);
      break;
    default:
      throw new Error(`Error: ${action.type} not caught by Markets reducer`);
  }

  window.markets = updatedState;
  return updatedState;
}

export const useMarkets = (defaultState = MOCK_MARKETS_STATE) => {
  const [state, dispatch] = useReducer(MarketsReducer, defaultState);
  return {
    ...state,
    actions: {
      updateOrderBook: (marketId, orderBook) => dispatch({ type: UPDATE_ORDER_BOOK, marketId, orderBook }),
      clearOrderBook: () => dispatch({ type: CLEAR_ORDER_BOOK }),
      updateMarketsData: (marketInfos) => dispatch({ type: UPDATE_MARKETS_DATA, marketInfos }),
      removeMarket: (marketId) => dispatch({ type: REMOVE_MARKET, marketId }),
    },
  };
};