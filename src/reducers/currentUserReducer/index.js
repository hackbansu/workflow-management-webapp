import actions from 'constants/actions.js';

const { UPDATE_TOKEN } = actions.common;

const initialState = {
    token: '',
};

/**
 * Reducer for current user actions.
 */
export default (state = initialState, action) => {
    switch (action.type) {
    case UPDATE_TOKEN:
        return {
            ...state,
            token: action.token,
        };

    default:
        return state;
    }
};
