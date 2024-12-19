import { useGetFarmLogsQuery, useGetFarmQuery } from '../../redux/apis/baseApi';

const useFetchFarm = id => {
    const {
        data: farm,
        isError,
        isLoading: isLoadingFarm,
        isFetching,
    } = useGetFarmQuery(id);
    const {
        data: logs = [],
        isLoading: isLoadingFarmLog,
        isFetching: isFetchingLogs,
    } = useGetFarmLogsQuery(id);

    const sortedLogs = [...logs].sort((a, b) => a?.id - b?.id);
    const currentWeather =
        sortedLogs?.length > 0 ? sortedLogs.slice(-1)[0] : null;

    return {
        farm,
        data:
            sortedLogs?.length > 0
                ? {
                      ...farm,
                      currentWeather,
                      weatherLogs: sortedLogs.slice(-7),
                  }
                : {
                      ...farm,
                  },
        loading: isLoadingFarmLog || isLoadingFarm,
        isFetching,
        isError,
        isFetchingLogs,
    };
};

export default useFetchFarm;
