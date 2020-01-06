import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box'
import Icon from '@material-ui/core/Icon';
import InfoIcon from '@material-ui/icons/Info';
import { makeStyles } from '@material-ui/core/styles';
import { amber, green } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InputAdornment from '@material-ui/core/InputAdornment';
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

const cronRules = [
    {
        primary: <span>請遵造「分(0-59)、時(0-23)、日(0-29)、月(0-11)、週(0-7)」的格式進行輸入。</span>,
        secondary: <span>例如：每日下午三點三十分執行一次，輸入<span style={{ color: 'red' }}>30 15 * * *</span></span>,
        iconColor: 'primary',
    },
    {
        primary: <span>輸入*號代表皆會執行。</span>,
        secondary: null,
        iconColor: 'primary',
    },
    {
        primary: <span>週0及7都視為禮拜日。</span>,
        secondary: null,
        iconColor: 'error',
    },
    {
        primary: <span>週及日不可同時存在。</span>,
        secondary: <span>例如：<span style={{ color: 'red' }}>0 10 1 * 1</span>會是每月一號以及每週一10:00分各執行一次。</span>,
        iconColor: 'error',
    },
];

export default function LineDetail({ detailId }) {

    const breadcrumbs = [
        {
            link: `/`,
            name: '首頁',
            active: false,
        },
        {
            link: `/backend/line`,
            name: 'Line Notify列表',
            active: false,
        },
        {
            link: `/backend/line/${detailId}/edit`,
            name: '編輯',
            active: true,
        }
    ];

    const [state, setState] = useState({
        name: '',
        message: '',
        status: true,
        isNotReply: true,
        hasDisplayDate: false,
        displayDate: 0,
        displayTime: '',
        token: '',
        cron: '',
    });

    const [alertOpen, setAlertOpen] = useState(false);
    const [errorException, setErrorException] = useState({
        open: false,
        content: '',
        title: '',
        method: function () { },
    });
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
        axios.put(`/backend/line/${detailId}`, {
            name: state.name,
            message: state.message,
            cron: state.cron,
            has_display_date: state.hasDisplayDate,
            display_date: state.displayDate,
            display_time: state.displayTime,
            token: state.token,
            is_not_reply: state.isNotReply,
            status: state.status,
        }).then((response) => {
            dispatchDataFetch({ type: 'FETCH_SUCCESS', payload: response.data });
            window.location.href = '/backend/line';
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
        axios.get(`/backend/line/${detailId}`)
            .then((response) => {
                let getData = response.data.data;
                setState({
                    ...state,
                    name: getData.name,
                    message: getData.message,
                    cron: getData.cron,
                    token: getData.token,
                    status: getData.status ? true : false,
                    hasDisplayDate: getData.display_date === -1 ? false : true,
                    displayDate: getData.display_date === -1 ? 0 : getData.display_date,
                    displayTime: getData.display_time || '',
                    isNotReply: getData.is_not_reply ? true : false,
                });
            }).catch((error) => {
                setErrorException({
                    ...errorException,
                    open: true,
                    title: '發生錯誤',
                    content: `發生錯誤：${error.response.data.message}，請重新操作。`,
                    method: function () {
                        window.location.href = '/backend/line';
                    }
                });
            });
    }, []);


    const Exception = ({ props }) => {
        return (
            <Dialog
                open={props.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.method} color="primary">
                        確認
                </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <div>
            <Exception props={errorException} />
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
                <Grid item xs={4}>
                    <Box mt={3}>
                        <TextField
                            label="Token"
                            fullWidth
                            variant="outlined"
                            error={hasError('token')}
                            helperText={getErrorMsg('token')}
                            InputProps={{
                                value: state.token,
                                readOnly: true,
                                startAdornment: <InputAdornment position="start">
                                    <VpnKeyIcon color="primary" />
                                </InputAdornment>
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item xs />
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs />
                <Grid item xs={4}>
                    <Box mt={3}>
                        <TextField
                            label="輸入名稱"
                            fullWidth
                            onChange={handlerState('name')}
                            error={hasError('name')}
                            helperText={getErrorMsg('name')}
                            InputProps={{
                                value: state.name,
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
                        <FormControlLabel
                            control={<Checkbox color="primary" checked={state.hasDisplayDate} onChange={handlerState('hasDisplayDate', 'checked')} />}
                            label="是否內容顯示「發送日期」"
                        />
                        <Box display={state.hasDisplayDate ? 'block' : 'none'}>
                            <Box>
                                <TextField
                                    label="設定發送日期"
                                    fullWidth
                                    placeholder="0(當日), 1(+1天)...以此類推"
                                    onChange={handlerState('displayDate')}
                                    error={hasError('display_date')}
                                    helperText={getErrorMsg('display_date')}
                                    InputProps={{
                                        value: state.displayDate,
                                        startAdornment: <InputAdornment position="start">+</InputAdornment>,
                                        endAdornment: <InputAdornment position="end">天</InputAdornment>,
                                    }}
                                    disabled={!state.hasDisplayDate}
                                />
                            </Box>
                            <Box mt={2}>
                                <TextField
                                    label="是否發送日期再加上文字"
                                    onChange={handlerState('displayTime')}
                                    fullWidth
                                    placeholder="例如13:00 ~ 15:30"
                                    error={hasError('display_time')}
                                    helperText={getErrorMsg('display_time')}
                                    disabled={!state.hasDisplayDate}
                                    InputProps={{
                                        value: state.displayTime,
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs />
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs />
                <Grid item xs>
                    <Box mt={3}>
                        <TextField
                            label="輸入排程規則"
                            placeholder="例如:5 10 * * *(每天10:05分執行)"
                            onChange={handlerState('cron')}
                            fullWidth
                            error={hasError('cron')}
                            helperText={getErrorMsg('cron')}
                            InputProps={{
                                value: state.cron,
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item xs />
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs />
                <Grid item xs>
                    <List dense={false}>
                        {
                            cronRules.map((item, key) => {
                                return (
                                    <ListItem key={key}>
                                        <ListItemIcon>
                                            <InfoIcon color={item.iconColor} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.primary}
                                            secondary={item.secondary}
                                        />
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </Grid>
                <Grid item xs />
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs />
                <Grid item xs>
                    <Box mt={3}>
                        <FormControlLabel
                            control={<Switch color="primary" checked={state.status} onChange={handlerState('status', 'checked')} />}
                            label={`[ ${(state.status ? '啟用' : '停用')} ] 排程`}
                        />
                    </Box>
                </Grid>
                <Grid item xs />
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs />
                <Grid item xs>
                    <Box mt={3}>
                        <FormControlLabel
                            control={<Switch color="primary" checked={state.isNotReply} onChange={handlerState('isNotReply', 'checked')} />}
                            label={`[ ${(state.isNotReply ? '開啟' : '取消')} ] 訊息內容加上「系統訊息請勿回覆」`}
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
                                    <Typography>儲存</Typography>
                            }
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs />
            </Grid>
        </div>
    );
}

if (document.getElementById('line-detail')) {
    ReactDOM.render(<LineDetail detailId={document.getElementById('line-detail').dataset.id} />, document.getElementById('line-detail'));
}
