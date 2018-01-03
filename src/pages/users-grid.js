import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {getWaitingUsers} from "../store/users/reducer";
import UserCard from "../components/user-card";
import SnackBar from "../components/snack-bar";
import {validateUsers} from "../store/users/actions";

const initState = {
    snackBarOpen: false,
    snackBarMessage: "",
};

class UserGrid extends React.Component {

    constructor() {
        super();
        this.state = initState;
    }

    handleClose = () => {
        this.setState(initState);
    };


    onUserClick(user) {
        this.setState({
            snackBarOpen: true,
            snackBarMessage: "Pressed " + user.name,
        });
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

        return (
            <div style={styles.container}>
                {_.map(this.props.users, user =>
                    <UserCard
                        key={user.id}
                        name={user.name}
                        searsId={user.searsId}
                        onClick={() => this.onUserClick(user)}
                    />
                )}

                <SnackBar
                    open={this.state.snackBarOpen}
                    message={this.state.snackBarMessage}
                    handleClose={this.handleClose}
                />
            </div>

        );

    }
}

function mapStateToProps(state) {
    return {
        users: getWaitingUsers(state),
    };
}

export default connect(mapStateToProps)(UserGrid);
