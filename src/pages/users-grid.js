import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {getUsers} from "../store/users/reducer";
import UserCard from "../components/user-card";
import {validateUsers} from "../store/users/actions";
import {getOrders, getWaitingOrders} from "../store/orders/reducer";
import {getFilter} from "../store/appData/reducer";

class UserGrid extends React.Component {

    componentDidMount() {
        setInterval(() => {
            this.forceUpdate();
        }, 1000);
    }


    getUsersToDisplay() {
        const users = this.props.users;
        const waitingOrders = getWaitingOrders(this.props.orders);

        let result;

        const filter = this.props.filter;
        result = _.filter(users, user => _.some(waitingOrders, order => order.userId === user.id));

        //Mark waiting users
        _.map(result, user => {
            user.waiting = true;
        });
        if (filter !== "") { //Has filter - search in all users
            const allowSearchInAll = false;
            if (allowSearchInAll) {
                result = _.filter(users, user => user.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
            } else {
                result = _.filter(result, user => user.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
            }
            //Mark waiting users
            _.map(result, user => {
                user.waiting = _.some(waitingOrders, order => order.userId === user.id);
            });
        }

        return _.sortBy(result, user => user.name);

    }

    render() {
        const styles = {
            container: {
                display: "flex",
                textAlign: "center",
                justifyContent: "space-evenly",
                flexWrap: "wrap",
            }
        };

        this.props.dispatch(validateUsers());

        const usersToDisplay = this.getUsersToDisplay.bind(this)();

        return (
            <div style={styles.container}>
                {_.map(usersToDisplay, user =>
                    <UserCard
                        key={user.id}
                        user={user}
                    />
                )}
            </div>

        );

    }
}

function mapStateToProps(state) {
    return {
        users: getUsers(state),
        orders: getOrders(state),
        filter: getFilter(state),
    };
}

export default connect(mapStateToProps)(UserGrid);
