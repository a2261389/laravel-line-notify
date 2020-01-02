import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import BlockIcon from '@material-ui/icons/Block';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import TextField from '@material-ui/core/TextField';
import RemoveIcon from '@material-ui/icons/Remove';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box'

const localization = {
    pagination: {
        labelDisplayedRows: '{from}-{to} 共 {count} 筆',
        labelRowsSelect: '筆',
        labelRowsPerPage: '每頁筆數',
        firstAriaLabel: '第一頁',
        firstTooltip: '第一頁',
        previousAriaLabel: '上一頁',
        previousTooltip: '上一頁',
        nextAriaLabel: '下一頁',
        nextTooltip: '下一頁',
        lastAriaLabel: '最後一頁',
        lastTooltip: '最後一頁',
    },
    toolbar: {
        nRowsSelected: '{0} 行 已選擇',
        searchTooltip: '搜尋',
        searchPlaceholder: '搜尋',
        addRemoveColumns: '新增或移除資料',
        showColumnsTitle: '顯示標題',
        showColumnsAriaLabel: '顯示標題',
        exportTitle: '匯出',
        exportAriaLabel: '匯出',
        exportName: '匯出CSV'
    },
    header: {
        actions: <font style={{ whiteSpace: 'nowrap' }}>操作</font>,
    },
    body: {
        emptyDataSourceMessage: '尚無資料可供顯示',
        addTooltip: '新增',
        deleteTooltip: '刪除',
        editTooltip: '編輯',

        filterRow: {
            filterTooltip: '篩選'
        },
        editRow: {
            deleteText: '確定要刪除該筆資料？',
            cancelTooltip: '取消',
            saveTooltip: '儲存',
        }
    },
    grouping: {
        placeholder: '拖曳標題...',
    }
}

const RowDataDetail = ({ rowData }) => {
    return (
        <div style={{ margin: 10, width: '80%' }}>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="information table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>參數</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>數值</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <RemoveIcon color="primary" fontSize="small" />名稱：
                            </TableCell>
                            <TableCell>{rowData.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <RemoveIcon color="primary" fontSize="small" />狀態：
                            </TableCell>
                            <TableCell>{rowData.status}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <RemoveIcon color="primary" fontSize="small" />排程：
                            </TableCell>
                            <TableCell>{rowData.cron}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <RemoveIcon color="primary" fontSize="small" />
                                建立日期：
                                </TableCell>
                            <TableCell>{rowData.created_at}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <RemoveIcon color="primary" fontSize="small" />
                                訊息內容最後加上「系統訊息請勿回覆」：
                                </TableCell>
                            <TableCell>
                                {rowData.is_not_reply ? '已開啟' : '已關閉'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <RemoveIcon color="primary" fontSize="small" />
                                是否內容顯示「發送日期」：
                            </TableCell>
                            <TableCell>
                                {rowData.display_date !== -1 ? '已開啟' : '已關閉'}
                            </TableCell>
                        </TableRow>
                        {
                            rowData.display_date !== -1 && (
                                <React.Fragment>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            <RemoveIcon color="primary" fontSize="small" />
                                            發送日期時間：
                                        </TableCell>
                                        <TableCell>+{rowData.display_date}天</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            <RemoveIcon color="primary" fontSize="small" />
                                            發送文字：
                                        </TableCell>
                                        <TableCell>{rowData.display_time}</TableCell>
                                    </TableRow>
                                </React.Fragment>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <Box mt={3}>
                <TextField
                    label="訊息內容"
                    multiline
                    rows="10"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        value: rowData.message,
                        readOnly: true,
                    }}
                />
            </Box>
        </div>
    );
}

export default function LineList() {

    const [errorException, setErrorException] = useState({
        open: false,
        content: '',
        title: '',
        method: function () { },
    });
    const [state, setState] = useState({
        columns: [
            { title: 'ID', field: 'id' },
            { title: '名稱', field: 'name' },
            {
                title: '狀態',
                field: 'status',
                render: rowData => rowData.status
                    ? <FiberManualRecordIcon style={{ color: '#00ff00' }} />
                    : <BlockIcon style={{ color: '#ff0000' }} />
            },
            { title: '排程', field: 'cron' },
            { title: '建立日期', field: 'created_at' },
        ],
        data: [],
        isLoading: true,
    });
    useEffect(() => {
        axios.get(`/backend/async/line-list`)
            .then((response) => {
                setState({
                    ...state,
                    data: response.data.data,
                    isLoading: false,
                });
            }).catch((error) => {
                console.error(error)
                setState({ ...state, isLoading: false });
                setErrorException({
                    open: true,
                    content: error.response.data.message,
                    title: '發生錯誤',
                    method: function () {
                        setErrorException({ ...errorException, open: false });
                    },
                });
            });
    }, []);

    const deleteItem = (oldData) => {
        return axios.delete(`/backend/line/${oldData.id}`)
            .then((response) => {
                setState(prevState => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                });
            }).catch((error) => {
                console.error(error)
                setErrorException({
                    open: true,
                    content: error.response.data.message,
                    title: '發生錯誤',
                    method: function () {
                        setErrorException({ ...errorException, open: false });
                    },
                });
            });
    }

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
            <MaterialTable
                title="LINE Notify 列表"
                columns={state.columns}
                data={state.data}
                localization={localization}
                isLoading={state.isLoading}
                editable={{
                    onRowDelete: oldData => deleteItem(oldData),
                }}
                options={{
                    pageSize: 10,
                    pageSizeOptions: [10, 25, 50, 100, 200],
                    actionsColumnIndex: 100,
                }}
                detailPanel={[
                    {
                        tooltip: '查看詳情',
                        render: rowData => <RowDataDetail rowData={rowData} />
                    }
                ]}
                actions={[
                    {
                        icon: 'edit',
                        tooltip: '編輯',
                        onClick: (event, rowData) => window.location.href = `/backend/line/${rowData.id}/edit`
                    },
                    {
                        icon: 'add',
                        tooltip: '新增LINE Notify',
                        isFreeAction: true,
                        onClick: (event) => window.location.href = `/backend/async/line-enable`
                    }
                ]}
            />
        </div>
    );
}

if (document.getElementById('line-list')) {
    ReactDOM.render(<LineList />, document.getElementById('line-list'));
}
