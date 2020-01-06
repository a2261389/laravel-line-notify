import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box'
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import { amber, green } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Collapse from '@material-ui/core/Collapse';
import { Alert, AlertTitle } from '@material-ui/lab';

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
    const [alertOpen, setAlertOpen] = useState(false);
    const [state, setState] = useState({
        message: '',
        notify_id: '',
    });

    const [notifications, setNotifications] = useState([{
        id: 0,
        name: ''
    }]);

    const reducerDataFetch = (state, action) => {
        switch (action.type) {
            case 'FETCH_INIT':
                setAlertOpen(false);
                return {
                    ...state,
                    isSend: true,
                }
            case 'FETCH_SUCCESS':
                setAlertOpen(true);
                return {
                    ...state,
                    isSend: false,
                    response: {
                        status: action.payload.status,
                        message: action.payload.message,
                        data: action.payload.data,
                    }
                }
            case 'FETCH_FAILED':
                setAlertOpen(true);
                return {
                    ...state,
                    isSend: false,
                    response: {
                        status: action.payload.status,
                        message: action.payload.message,
                        data: action.payload.data,
                    }
                }
            case 'FETCH_INVALIDATED':
                setAlertOpen(false);
                return {
                    ...state,
                    isSend: false,
                    response: {
                        status: action.payload.status,
                        message: action.payload.message,
                        data: action.payload.data,
                    }
                }
        }
    }

    const [dataFetch, dispatchDataFetch] = useReducer(reducerDataFetch, {
        isSend: false,
        response: {
            status: '',
            message: '',
            data: {},
        },
    });

    const statusCodeToText = (status) => {
        status = parseInt(status);
        if (status === 200) { return ['success', '成功']; }
        return ['error', '錯誤'];
    }

    const submitLineSetting = () => {
        dispatchDataFetch({ type: 'FETCH_INIT' });
        axios.post('/backend/async/line-send-message', {
            message: state.message,
            notify_id: state.notify_id,
        }).then((response) => {
            dispatchDataFetch({ type: 'FETCH_SUCCESS', payload: response.data });
        }).catch((error) => {
            if (error.response.status !== 422) {
                dispatchDataFetch({ type: 'FETCH_FAILED', payload: error.response.data });
            } else {
                dispatchDataFetch({ type: 'FETCH_INVALIDATED', payload: error.response.data });
            }
        });
    }

    const handlerState = (name, type = 'value') => event => {
        setState({ ...state, [name]: event.target[type] });
    }

    const getErrorMsg = field => hasError(field) ? dataFetch.response.data[field][0] : '';
    const hasError = field => !!dataFetch.response.data[field];

    const classes = useStyles();

    useEffect(() => {
        axios.get('/backend/async/line-list')
            .then((response) => {
                setNotifications(response.data.data);
            }).catch((error) => {
                dispatchDataFetch({ type: 'FETCH_FAILED', payload: error.response.data });
            });
    }, [])

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs />
                <Grid item xs={4}>
                    <Box mb={3}>
                        <Collapse in={alertOpen}>
                            <Alert
                                variant="filled"
                                onClose={() => { setAlertOpen(false) }}
                                severity={statusCodeToText(dataFetch.response.status)[0]}
                            >
                                <AlertTitle>{statusCodeToText(dataFetch.response.status)[1]}</AlertTitle>
                                {dataFetch.response.message}
                            </Alert>
                        </Collapse>
                    </Box>
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
                                        return (<option key={notification.id} value={notification.id}>{notification.name}</option>);
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
                            disabled={dataFetch.isSend}
                        >
                            {
                                dataFetch.isSend ?
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
