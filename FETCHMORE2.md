#### useListingsTable.js

- Execute queries with options.
- Map and format data
- Execute fetchmore
- Returns object 
  ```js
  return {
    data,
    mappedData,
    pageInfo,
    loading: loading || defaultProtectionPlanLoading,
    error,
    fetchingMore,
    fetchMoreData
  };
  ```


**useListingsTable.js**
```js
import React, { useState } from "react";
//...
export const mapListingData = (data, defaultProtectionPlan) => {
  const cars = get(data, "viewer.me.owner.cars.edges", []);
  return map(cars, ({ node }) => {
    const combinedCarStatus = getCarStatus(node.status, node.verification);
    const photo = get(node, "photos[0].file.url", null);
    return {
      id: node.id,
      vin: node.vin,
      protectionPlan: node.defaultProtectionPlan
        ? capitalize(node.defaultProtectionPlan)
        : capitalize(defaultProtectionPlan),
      dailyPriceInDollars: `$${centsToDollars(node.dailyPriceInCents)}`,
      updatedAt: moment(node.updatedAt).format("MM/DD/Y"),
      status: CombinedCarStatusTextEnum[combinedCarStatus],
      yearMakeModel: `${node.year} ${node.make} ${node.model}`,
      carPhoto: <>{photo && <img alt="Driver" src={photo} />}</>,
      carSummary: node
    };
  });
};

const useLoadMore = (loading, error, fetchMore, pageInfo) => {
  const [fetchingMore, updateFetchingMore] = useState(false);
  const { hasNextPage, endCursor } = pageInfo;
  const first = 10;

  const fetchMoreData = () => {
    //...
  };

  return {
    fetchingMore,
    fetchMoreData
  };
};

export const useListingsTable = options => {
  const { data, loading, error, fetchMore } = useQuery(FLEET_LISTINGS, options);

  const {
    data: defaultProtectionPlanData,
    loading: defaultProtectionPlanLoading
  } = useQuery(OWNER_DEFAULT_PROTECTION_PLAN, {
    fetchPolicy: "network-only"
  });
  const pageInfo = get(data, "viewer.me.owner.cars.pageInfo", {});
  const mappedData = mapListingData(
    data,
    get(defaultProtectionPlanData, "viewer.me.owner.defaultProtectionPlan", "")
  );
  const { fetchingMore, fetchMoreData } = useLoadMore(
    loading,
    error,
    fetchMore,
    pageInfo
  );

  return {
    data,
    mappedData,
    pageInfo,
    loading: loading || defaultProtectionPlanLoading,
    error,
    fetchingMore,
    fetchMoreData
  };
};

```

#### Using `useListingsTable.js`
**ListingsCardView.js**
```js
export const ListingsCardView = connect(
  state => ({
    search: state.fleet.header.search,
    selectedFilters: state.fleet.header.selectedFilters
  }),
  { resetSearch, setFilters, resetFilters }
)(
  ({
    resetSearch,
    initialWhere,
    filters,
    noDataLabel,
    search,
    setFilters,
    resetFilters,
    selectedFilters
  }) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("sm"));
    const { first, orderBy } = useTableState({
      initialFirst: 10,
      initialOrderBy: "updatedAt_DESC"
    });

    const {
      mappedData,
      pageInfo: { hasNextPage },
      loading,
      fetchMoreData,
      fetchingMore
    } = useListingsTable({
      variables: {
        searchText: search,
        first,
        orderBy,
        where: {
          ...initialWhere,
          ...selectedFilters.reduce((acc, val) => {
            if (Object.hasOwnProperty.call(acc, `${val.key}`)) {
              acc[val.key].push(val.value);
            } else {
              acc[val.key] = [val.value];
            }
            return acc;
          }, {})
        }
      },
      fetchPolicy: "network-only"
    });

    //...

    return (
      <DashboardLayout fullScreen={matches}>
        <CarInfoFilter />
        <ListingsCard
          data={mappedData}
          noDataLabel={noDataLabel}
          loading={loading}
        />
        {hasNextPage && (
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => {
              fetchMoreData();
            }}
          >
            {fetchingMore ? "Loading..." : "Load More"}
          </Button>
        )}
      </DashboardLayout>
    );
  }
);
```