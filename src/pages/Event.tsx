import React, { useEffect, useState } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Event {
  title: string;
  content: string;
  createdDate: Date;
  updatedDate: Date;
  memberName: string;
}

const Event: React.FC = () => {
  const [rowsEventData, setRowsEventData] = useState([]);
  const { accessToken } = useAuth();

  console.log(accessToken);

  useEffect(() => {
    getEventData();
  }, [accessToken]);

  const getEventData = async () => {
    try {
      if (!accessToken) {
        console.error('Access token is missing.');
        return;
      }

      await axios
        .get(`/event/event`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setRowsEventData(response.data);
        });
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const gridOptions: AgGridReactProps<Event> = {
    columnDefs: [
      {
        headerName: '번호',
        valueGetter: (params) =>
          params.node && params.node.rowIndex != null
            ? params.node.rowIndex + 1
            : '',
        width: 70,
        cellStyle: { textAlign: 'center' },
      },
      { headerName: '제목', field: 'title', width: 300 },
      { headerName: '내용', field: 'content', width: 300 },
      {
        headerName: '작성일자',
        field: 'createdDate',
        width: 150,
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: '수정일자',
        field: 'updatedDate',
        width: 150,
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: '작성자',
        field: 'memberName',
        width: 150,
        cellStyle: { textAlign: 'center' },
      },
    ],
    defaultColDef: {
      sortable: true,
      headerClass: 'centered',
    },
  };

  const rowEventData =
    rowsEventData &&
    rowsEventData.map((v: any) => {
      return {
        title: v.title,
        content: v.content,
        createdDate: new Date(v.createdDate),
        updatedDate: new Date(v.updatedDate),
        memberName: v.memberName,
      };
    });

  return (
    <div className="w-5/6 ml-[240px] h-[900px] flex-1 flex justify-center flex-col items-center">
      <div className="font-['Nanum Gothic'] text-3xl mb-5 font-bold text-main-green-color">
        공지 관리
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: '650px', width: '80%' }}
      >
        <AgGridReact
          rowData={rowEventData}
          gridOptions={gridOptions}
          animateRows={true} // 행 애니메이션
          suppressRowClickSelection={true} // true -> 클릭 시 행이 선택안됌
          rowSelection={'multiple'} // 여러행 선택
          enableCellTextSelection={true} // 그리드가 일반 테이블인 것처럼 드래그시 일반 텍스트 선택
        ></AgGridReact>
      </div>
    </div>
  );
};

export default Event;
