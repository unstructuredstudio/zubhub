import { colors } from "../../../colors";

const styles = theme => ({
  notificationButtonStyle: {
    minWidth: '0px !important',
  },
  notification: {
    backgroundColor: colors["primary-01"],
  },
  spanNumber: {
    textAlign: 'center',
    position: 'absolute',
    width: '15px',
    height: '15px',
    top: '3px',
    left: '16px',
    borderRadius: '999px',
    fontSize: '10px',
    fontWeight: '600',
    backgroundColor: '#F4DB57',
    color: '#000000'
  }
});

export default styles;
