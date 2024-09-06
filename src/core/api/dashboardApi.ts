import axios from './instance';

import type { GetCardsResponseDto } from '@core/dtos/CardsDto';
import type {
  GetColumnsResponseDto,
  CreateColumnRequestDto,
  ColumnServiceResponseDto,
  UpdateColumnRequestDto,
} from '@core/dtos/ColumnsDto';
import type { DashboardApplicationServiceResponseDto } from '@core/dtos/DashboardDto';

export const getColumns = async (dashboardId: number) => {
  const res = await axios.get<GetColumnsResponseDto>(
    `/columns?dashboardId=${dashboardId}`
  );
  const { data } = res;
  return data;
};

export const postColumn = async (formData: CreateColumnRequestDto) => {
  try {
    const res = await axios.post<ColumnServiceResponseDto>(
      '/columns',
      formData
    );
    const { data } = res;
    return data;
  } catch (error) {
    return null;
  }
};

interface PutColumnParams {
  columnId: number;
  formData: UpdateColumnRequestDto;
}
export const putColumn = async ({ columnId, formData }: PutColumnParams) => {
  try {
    const res = await axios.put<ColumnServiceResponseDto>(
      `/columns/${columnId}`,
      formData
    );
    const { data } = res;
    return data;
  } catch (error) {
    return null;
  }
};

export const deleteColumn = async (columnId: number) => {
  try {
    const res = await axios.delete(`/columns/${columnId}`);
    return res;
  } catch (error) {
    return null;
  }
};

export const getCards = async (columnId: number) => {
  const res = await axios.get<GetCardsResponseDto>(
    `/cards?size=10&columnId=${columnId}`
  );
  const { data } = res;
  return data;
};

export const getDashboardDetail = async (dashboardId: number) => {
  const res = await axios.get<DashboardApplicationServiceResponseDto>(
    `/dashboards/${dashboardId}`
  );
  const { data } = res;
  return data;
};

export const updateDashboard = async (
  dashboardId: number,
  data: { title: string; color: string }
) => {
  const res = await axios.put<DashboardApplicationServiceResponseDto>(
    `dashboards/${dashboardId}`,
    data
  );
  return res.data;
};
