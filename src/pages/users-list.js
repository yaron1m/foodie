import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {getUsers} from "../store/users/reducer";
import UserCard from "../components/user-card";

class UsersList extends React.Component {

    render() {
        const styles = {
            container: {
                display: "flex",
                textAlign: "center",
                justifyContent: "space-evenly",
                flexWrap: "wrap",
            }
        };


        return (
            <div style={styles.container}>
                {_.map(this.props.users, user =>
                    <UserCard
                        key={user.id}
                        name={user.firstName + " " + user.lastName}
                        searsId={user.searsId}
                    />
                )}
            </div>

        );

    }
}

function mapStateToProps(state) {
    return {
        users: getUsers(state),
    };
}

export default connect(mapStateToProps)(UsersList);