import React, { useCallback, useEffect, useState } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Promotion {
  title: string;
  content: string;
  createdDate: Date;
  updatedDate: Date;
  memberName: string;
}

const Promotion: React.FC = () => {
  const [rowsPromotionData, setRowsPromotionData] = useState([]);
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  console.log(accessToken);

  useEffect(() => {
    getPromotionData();
  }, [accessToken]);

  const getPromotionData = async () => {
    try {
      if (!accessToken) {
        console.error('Access token is missing.');
        return;
      }

      await axios
        .get(`/event/promotion`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setRowsPromotionData(response.data);
        });
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const deleteButtonRenderer = useCallback(
    (params: any) => {
      const handleDelete = () => {
        const clickedRowData = params.data;
        console.log(accessToken); // accessToken 접근
        axios
          .delete(`/manage/event/` + clickedRowData.eventId, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            console.log('Success:', response.data);
            getPromotionData();
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      };

      return (
        <div
          className="flex items-center justify-center"
          onClick={handleDelete}
        >
          <div className="delete"></div>
        </div>
      );
    },
    [accessToken],
  );

  const handleTitleClick = (event: any) => {
    const clickedRowData = event.data;
    console.log(clickedRowData);
    navigate('/promotion/view', {
      state: {
        eventId: clickedRowData.eventId,
        title: clickedRowData.title,
        content: clickedRowData.content,
        createdDate: clickedRowData.createdDate,
        updatedDate: clickedRowData.updatedDate,
        memberName: clickedRowData.memberName,
        imageUrl: clickedRowData.imageUrl,
      },
    });
  };

  const gridOptions: AgGridReactProps<Promotion> = {
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
      {
        headerName: '제목',
        field: 'title',
        width: 300,
        onCellClicked: handleTitleClick,
      },
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
      {
        headerName: '삭제',
        width: 70,
        cellRenderer: deleteButtonRenderer,
        cellStyle: { display: 'flex', justifyContent: 'center' },
      },
    ],
    defaultColDef: {
      sortable: true,
      headerClass: 'centered',
    },
  };

  const rowPromotionData =
    rowsPromotionData &&
    rowsPromotionData.map((v: any) => {
      return {
        eventId: v.eventId,
        title: v.title,
        content: v.content,
        createdDate: new Date(v.createdDate),
        updatedDate: new Date(v.updatedDate),
        memberName: v.memberName,
        imageUrl: v.imageUrl,
      };
    });

  return (
    <div className="w-5/6 ml-[15%] h-full flex-1 flex justify-center flex-col items-center">
      <div className="font-['Nanum Gothic'] text-3xl mb-5 font-bold text-main-green-color">
        홍보 관리
      </div>
      <div className="ag-theme-alpine" style={{ height: '75%', width: '80%' }}>
        <AgGridReact
          rowData={rowPromotionData}
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

export default Promotion;
