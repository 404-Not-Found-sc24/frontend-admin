import React, { useEffect, useState } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';

interface Approval {
  approvalId: number;
  address: string;
  content: string;
  date: string;
  detail: string;
  division: string;
  latitude: number;
  longitude: number;
  name: string;
  state: string;
  userName: string;
}

const PlaceApproval: React.FC = () => {
  const [rowsPlaceData, setRowsPlaceData] = useState<Approval[]>([]);
  const { refreshAccessToken } = useAuth();
  const accessToken = localStorage.getItem('accessToken');

  console.log(accessToken);

  useEffect(() => {
    getPlaceData();
  }, []);

  const getPlaceData = async () => {
    try {
      const response = await axios.get(`/manage/approval`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response.data);
      setRowsPlaceData(response.data);
    } catch (e) {
      if (
        (e as AxiosError).response &&
        (e as AxiosError).response?.status === 401
      ) {
        try {
          await refreshAccessToken();
          // 새로운 액세스 토큰으로 다시 요청을 보냅니다.
          // 여기에서는 재시도 로직을 추가할 수 있습니다.
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
        }
      } else {
        console.error('장소 정보 조회 실패:', e);
      }
    }
  };

  const approvedplace = async (rowData: Approval) => {
    try {
      const { address, content, detail, name } = rowData;
      const requestData = {
        address,
        content,
        detail,
        name,
      };
      const response = await axios.post(
        `/manage/approve/${rowData.approvalId}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response.data);
      getPlaceData();
    } catch (e) {
      if (
        (e as AxiosError).response &&
        (e as AxiosError).response?.status === 401
      ) {
        try {
          await refreshAccessToken();
          // 새로운 액세스 토큰으로 다시 요청을 보냅니다.
          // 여기에서는 재시도 로직을 추가할 수 있습니다.
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
        }
      } else {
        console.error('장소 승인 실패:', e);
      }
    }
  };

  const deniedplace = async (rowData: Approval) => {
    try {
      const response = await axios.post(
        `/manage/deny/${rowData.approvalId}`,
        null,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response.data);
      getPlaceData();
    } catch (e) {
      if (
        (e as AxiosError).response &&
        (e as AxiosError).response?.status === 401
      ) {
        try {
          await refreshAccessToken();
          // 새로운 액세스 토큰으로 다시 요청을 보냅니다.
          // 여기에서는 재시도 로직을 추가할 수 있습니다.
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
        }
      } else {
        console.error('장소 거절 실패:', e);
      }
    }
  };

  const handleApprovalChange = async (rowData: Approval) => {
    try {
      if (rowData.state === 'approved') {
        await approvedplace(rowData);
      } else if (rowData.state === 'denied') {
        await deniedplace(rowData);
      }
    } catch (error) {
      if (
        (error as AxiosError).response &&
        (error as AxiosError).response?.status === 401
      ) {
        try {
          await refreshAccessToken();
          // 새로운 액세스 토큰으로 다시 요청을 보냅니다.
          // 여기에서는 재시도 로직을 추가할 수 있습니다.
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
        }
      } else {
        console.error('State 변경 실패:', error);
      }
    }
  };

  const onCellValueChanged = (event: any) => {
    if (event.colDef.field === 'state' && event.data) {
      handleApprovalChange(event.data);
    }
  };

  const gridOptions: AgGridReactProps<Approval> = {
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
      { headerName: '이름', field: 'name', width: 250 },
      { headerName: '내용', field: 'content', width: 300 },
      { headerName: '주소', field: 'address', width: 300 },
      { headerName: '구분', field: 'division', width: 300 },
      {
        headerName: '작성자',
        field: 'userName',
        width: 150,
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: '날짜',
        field: 'date',
        width: 150,
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: '승인',
        field: 'state',
        width: 100,
        cellStyle: { textAlign: 'center' },
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['appiled', 'approved', 'denied'],
        },
        onCellValueChanged,
      },
    ],
    defaultColDef: {
      sortable: true,
      headerClass: 'centered',
    },
  };

  const rowPlaceData =
    rowsPlaceData &&
    rowsPlaceData.map((v: any) => {
      return {
        approvalId: v.approvalId,
        name: v.name,
        content: v.content,
        address: v.address,
        userName: v.userName,
        date: v.date,
        state: v.state,
        detail: v.detail,
        division: v.division,
        latitude: v.latitude,
        longitude: v.longitude,
      };
    });

  return (
    <div className="w-5/6 ml-[240px] h-[900px] flex-1 flex justify-center flex-col items-center">
      <div className="font-['Nanum Gothic'] text-3xl mb-5 font-bold text-main-green-color">
        장소 관리
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: '650px', width: '80%' }}
      >
        <AgGridReact
          rowData={rowPlaceData}
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

export default PlaceApproval;
