import React from 'react';
import PropTypes from 'prop-types';
import Card, {CardContent, CardMedia} from 'material-ui/Card';
import {markOrdersAsNotified} from "../store/orders/actions";
import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import {connect} from "react-redux";
import {getWaitingOrdersByUserId} from "../store/orders/reducer";
import SnackBar from "./snack-bar";
import {getFloor} from "../store/appData/reducer";
import fireworks from "fireworks";

const notifyUrl = "https://foodie-telegram-bot.herokuapp.com/notify?userId=";

const initState = {
    snackBarOpen: false,
    snackBarMessage: "",
};

const radius = 10;
const width = 200;
const disabledColor = "#DADADA";
const notifiedColor = "#4eb61e";

class UserCard extends React.Component {


    constructor() {
        super();
        this.state = initState;
    }

    handleClose = () => {
        this.setState(initState);
    };

    wasNotified() {
        return _.some(this.props.usersWaitingOrders, order => order.notified === true)
    }

    async onUserClick() {
        fireworks({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            colors: ["#cc3333", "#4CAF50", "#81C784"]
        });

        console.log(notifyUrl + this.props.user.id + "&floor=" + this.props.floor);
        fetch(notifyUrl + this.props.user.id + "&floor=" + this.props.floor, {
            mode: 'no-cors',

            method: 'post',

            headers: {
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });

        this.props.dispatch(markOrdersAsNotified(this.props.user));


    }

    render() {

        const styles = {
            div: {
                borderRadius: 20

            },
            card: {
                maxWidth: width,
                margin: 10,
                borderRadius: radius,
                backgroundColor: this.props.user.waiting ? (this.wasNotified.bind(this)() ? notifiedColor : "white") : disabledColor
            },
            media: {
                height: width,
                width: width,
                borderTopLeftRadius: radius,
                borderTopRightRadius: radius,
            },
            name: {
                fontSize: 18,
            }
        };


        const imagePrefix = "http://searsboards.searsil.loc/-/get-user-image/";

        return (
            <div style={styles.div}>
                <Card
                    style={styles.card}
                    onClick={this.onUserClick.bind(this)}
                >
                    <CardMedia
                        style={styles.media}
                        image={imagePrefix + this.props.user.searsId}
                    />
                    <CardContent>
                        <div style={styles.name}>
                            {this.props.user.name}
                        </div>
                    </CardContent>
                </Card>


                <SnackBar
                    open={this.state.snackBarOpen}
                    message={this.state.snackBarMessage}
                    handleClose={this.handleClose}
                />
            </div>

        );
    }
}

UserCard.propTypes = {
    user: PropTypes.object,
    name: PropTypes.string,
    subText: PropTypes.string,
    searsId: PropTypes.string,
    onClick: PropTypes.func,
};

function mapStateToProps(state, ownProps) {
    return {
        user: ownProps.user,
        usersWaitingOrders: getWaitingOrdersByUserId(state, ownProps.user.id),
        floor: getFloor(state),
    };
}

export default connect(mapStateToProps)(UserCard);