import * as actionTypes from './action-types';
import _ from 'lodash';
import {getWaitingOrders} from "../orders/reducer";

export default (state = {}, action = {}) => {
    switch (action.type) {
        case actionTypes.RECEIVE_USERS:
            return action.payload;

        //case LOGGED_OUT:
         //   return {};

        default:
            return state
    }
}

// Selectors:
export function getUsers(state) {
    return state.users;
}

export function getWaitingUsers(state) {
    const users = getUsers(state);
    const waitingOrders = getWaitingOrders(state);

    const waitingUsers = _.filter(users, user => _.some(waitingOrders, order => order.userId === user.id));

    return waitingUsers;

}
//
// export function getNextOrganizationId(state) {
//     const organizations = getOrganizations(state);
//     const keys = _.keys(organizations);
//     if (!organizations || keys.length === 0)
//         return null;
//     return _.max(_.map(_.keys(organizations), _.parseInt)) + 1;
// }
//
// export function getOrganizationById(state, id) {
//     return getOrganizations(state)[id];
// }