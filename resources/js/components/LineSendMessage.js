import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box'
import Icon from '@material-ui/core/Icon';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';
import { amber, green } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import NativeSelect from '@material-ui/core/NativeSelect';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    inline: {
        display: 'inline',
    }
}));

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};


const breadcrumbs = [
    {
        link: '/',
        name: '首頁',
        active: false,
    },
    {
        link: '/backend/line',
        name: 'Line Notify列表',
        active: false,
    },
    {
        link: '/backend/line-send',
        name: '寄發訊息',
        active: true,
    }
]

export default function LineSendMessage() {
    const [isSend, setIsSend] = useState(false);
    const [state, setState] = useState({
        message: '',
        notify_id: '',
    });

    const [notifications, setNotifications] = useState([{
        id: 0,
        name: ''
    }]);

    const [data, setData] = useState({ data: {} });
    const [alertOpen, setAlertOpen] = useState(false);

    const statusCodeColor = (status) => {
        status = parseInt(status);
        if (status === 200) { return 'success'; }
        return 'error';
    }

    const submitLineSetting = () => {
        setIsSend(true);
        setAlertOpen(false);
        axios.post('/backend/async/line-send-message', {
            message: state.message,
            notify_id: state.notify_id,
        }).then((res) => {
            setData(res.data);
            setAlertOpen(true);
            setIsSend(false);
        }).catch((error) => {
            if (error.response.status !== 422) {
                setAlertOpen(true);
            }
            setData(error.response.data);
            setIsSend(false);
        });
    }

    const handlerState = (name, type = 'value') => event => {
        setState({ ...state, [name]: event.target[type] });
    }

    const getErrorMsg = field => hasError(field) ? data.data[field][0] : '';
    const hasError = field => !!data.data[field];

    const classes = useStyles();
    const ResponseIcon = variantIcon[statusCodeColor(data.status)];

    const Exception = ({ title, content, open, method }) => {
        return (
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { method(false) }} color="primary">
                        確認
                </Button>
                </DialogActions>
            </Dialog>
        );
    }

    useEffect(() => {
        axios.get('/backend/async/line-list')
            .then((res) => {
                setNotifications(res.data.data);
            }).catch((error) => {
                setData(error.response.data);
                setIsSend(false);
            });
    }, [])

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs />
                <Grid item xs={4}>
                    {
                        alertOpen && <SnackbarContent className={classes[statusCodeColor(data.status)]}
                            message={
                                <span id="client-snackbar">
                                    <ResponseIcon />
                                    {data.message}
                                </span>
                            }
                            action={[
                                <IconButton
                                    key="close"
                                    aria-label="close"
                                    color="inherit"
                                    onClick={() => { setAlertOpen(false) }}
                                >
                                    <CloseIcon />
                                </IconButton>,
                            ]}
                        />
                    }
                </Grid>
                <Grid item xs />
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={6} />
                <Grid item xs={4}>
                    <Breadcrumbs aria-label="breadcrumb">
                        {
                            breadcrumbs.map((breadcrumb, key) => {
                                if (breadcrumb.active) {
                                    return <Typography color="textPrimary" key={key}>{breadcrumb.name}</Typography>
                                }
                                return (
                                    <Link color="inherit" href={breadcrumb.link} key={key}>{breadcrumb.name}</Link>
                                )
                            })
                        }
                    </Breadcrumbs>
                </Grid>
                <Grid item xs />
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs />
                <Grid item xs>
                    <Box mt={3}>
                        <FormControl required fullWidth error={hasError('notify_id')}>
                            <InputLabel htmlFor="notify_id">選擇Notify帳戶</InputLabel>
                            <Select
                                native
                                value={state.notify_id}
                                onChange={handlerState('notify_id')}
                                name="notify_id"
                                inputProps={{
                                    id: 'notify_id',
                                }}
                            >
                                <option value="" />
                                {
                                    notifications.map((notification) => {
                                        return (<option key={notification.id} value={ notification.id }>{notification.name}</option>);
                                    })
                                }
                            </Select>
                            <FormHelperText>{getErrorMsg('notify_id')}</FormHelperText>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item xs />
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs />
                <Grid item xs>
                    <Box mt={3}>
                        <TextField
                            id="outlined-multiline-static"
                            label="訊息內容"
                            multiline
                            rows="10"
                            variant="outlined"
                            fullWidth
                            onChange={handlerState('message')}
                            error={hasError('message')}
                            helperText={getErrorMsg('message')}
                            InputProps={{
                                value: state.message,
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item xs />
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs />
                <Grid item xs>
                    <Box mt={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            endIcon={<Icon>send</Icon>}
                            onClick={() => { submitLineSetting() }}
                            disabled={isSend}
                        >
                            {
                                isSend ?
                                    <CircularProgress size={24} color="inherit" /> :
                                    <Typography>寄發訊息</Typography>
                            }
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs />
            </Grid>
        </div>
    );
}

if (document.getElementById('line-send-message')) {
    ReactDOM.render(<LineSendMessage />, document.getElementById('line-send-message'));
}
