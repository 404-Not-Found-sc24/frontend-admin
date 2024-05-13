import React, {useEffect, useState} from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {AgGridReact, AgGridReactProps} from 'ag-grid-react';
import axios from "axios";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";

interface Notice {
    title: string;
    content: string;
    createdDate: Date;
    updatedDate: Date;
    memberName: string;
}

const Notice: React.FC = () => {
    const [rowsNoticeData, setRowsNoticeData] = useState([]);
    const { accessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(rowsNoticeData);
    }, [rowsNoticeData]);

    useEffect(() => {
        getNoticeData();
    }, [accessToken]);

    const getNoticeData = async () => {
        try {
            if (!accessToken) {
                console.error("Access token is missing.");
                return;
            }

            await axios
                .get(`/event/announce`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then(response => {
                    console.log(response.data);
                    setRowsNoticeData(response.data);
                });
        } catch(e) {
            console.error('Error:', e);
        };
    };

    const handleTitleClick = (event: any) => {
        const clickedRowData = event.data;
        navigate('/notice/view', {
            state: {
                title: clickedRowData.title,
                content: clickedRowData.content,
                createdDate: clickedRowData.createdDate,
                updatedDate: clickedRowData.updatedDate,
                memberName: clickedRowData.memberName,
            },
        });
    };

    const gridOptions: AgGridReactProps<Notice> = {
        columnDefs: [
            { headerName: '번호', valueGetter: (params) => params.node && params.node.rowIndex != null ? params.node.rowIndex + 1 : '' , width: 70, cellStyle: {textAlign: 'center'}},
            {headerName: '제목', field: 'title', width: 300},
            {headerName: '내용', field: 'content', width: 300},
            {headerName: '작성일자', field: 'createdDate', width: 150, cellStyle: {textAlign: 'center'}},
            {headerName: '수정일자', field: 'updatedDate', width: 150, cellStyle: {textAlign: 'center'}},
            {headerName: '작성자', field: 'memberName', width: 150, cellStyle: {textAlign: 'center'}},
        ],
        defaultColDef: {
            sortable: true,
            headerClass: "centered",
        },
        onCellClicked: handleTitleClick,
    };

    const rowNoticeData = rowsNoticeData && rowsNoticeData.map((v: any) => {
        return {
            title: v.title,
            content: v.content,
            createdDate: new Date(v.createdDate),
            updatedDate: new Date(v.updatedDate),
            memberName: v.memberName,
        };
    });

    const writeNotice = () => {
        navigate('/notice/write');
    };

    return (
        <div className="w-5/6 ml-[240px] h-[900px] flex-1 flex justify-center flex-col items-center">
            <div className="font-['Nanum Gothic'] text-3xl mb-5 font-bold text-main-green-color">
                공지 관리
            </div>
            <div className="w-4/5">
                <button className='bg-main-green-color text-white rounded-full px-3 py-1 font-bold text-sm float-end mb-3' onClick={writeNotice}>+ 공지 작성</button>
            </div>
            <div className="ag-theme-alpine" style={{height: "650px", width: '80%'}}>
            <AgGridReact
                    rowData={rowNoticeData}
                    gridOptions={gridOptions}
                    animateRows={true}
                >
                </AgGridReact>
            </div>
        </div>
    );
};

export default Notice;
